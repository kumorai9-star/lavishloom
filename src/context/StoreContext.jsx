import { createContext, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);
const TOKEN_KEY = "lavishloom_token";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://lavishloom-backend.onrender.com";
const API_BASE_URL = rawApiUrl.replace(/['"]+/g, "").replace(/\/+$/, "").trim();

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function StoreProvider({ children }) {
  // ---- Products ----
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const POLL_MS = 30000;
    let lastCount = products.length;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();

        if (data.length > lastCount) {
          const newest = data[data.length - 1];
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("New arrival at Lavishloom Kidz", {
              body: `${newest.name} just landed — take a look.`,
              icon: "/favicon.svg",
            });
          }
          setProducts(data);
        }
        lastCount = data.length;
      } catch {
        // ignore polling errors
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [products.length]);

  // ---- Cart ----
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem("lavishloom_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("lavishloom_cart", JSON.stringify(cart));
  }, [cart]);

  // ---- Auth ----
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const persistAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      isAdmin: data.role === "admin",
      phone: data.phone || "",
      shippingAddress: data.shippingAddress || {},
    });
    setWishlist((data.wishlist || []).map((id) => (typeof id === "string" ? id : id._id)));
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid credentials");
    }
    const data = await res.json();
    persistAuth(data);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Could not create account");
    }
    const data = await res.json();
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("lavishloom_user_cache");
    setToken(null);
    setUser(null);
    setWishlist([]);
    setOrders([]);
  };

  useEffect(() => {
    if (!token) return;
    const cached = localStorage.getItem("lavishloom_user_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUser(parsed.user);
        setWishlist(parsed.wishlist || []);
      } catch {
        // ignore
      }
    }
    fetchMyOrders();
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("lavishloom_user_cache", JSON.stringify({ user, wishlist }));
    } else {
      localStorage.removeItem("lavishloom_user_cache");
    }
  }, [user, wishlist]);

  const updateProfile = async (updates) => {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify({
        name: updates.fullName,
        phone: updates.phone,
        address: updates.address,
      }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    setUser((prev) => ({
      ...prev,
      name: data.name,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
    }));
  };

  const toggleWishlist = async (productId) => {
    if (!token) return;
    const wasWishlisted = wishlist.includes(productId);
    setWishlist((prev) =>
      wasWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    try {
      await fetch(`${API_BASE_URL}/api/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ productId }),
      });
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  // ---- Newsletter ----
  const subscribe = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }

      return { success: res.ok, message: data.message };
    } catch {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  };

  // ---- Orders ----
  const fetchMyOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: authHeaders(token),
      });
      if (!res.ok) return;
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(
          data.map((o) => ({
            _id: o._id,
            id: `#LK-${o._id.slice(-6).toUpperCase()}`,
            date: o.createdAt,
            status: o.status ? o.status.toUpperCase() : "PROCESSING",
            items: (o.orderItems || o.items || []).map((i) => ({
              name: i.name || i.title || "Kids Item",
              image: i.image || "/images/placeholder.jpg",
              size: i.size,
              color: i.color,
              qty: i.qty || 1,
              price: i.price || 0,
            })),
            total: o.totalPrice || o.total || 0,
            paymentMethod: o.paymentMethod,
            paymentProof: o.paymentProof,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const addOrder = async (orderData) => {
    const itemsSource = orderData.orderItems || orderData.items || cart;

    const formattedOrderItems = itemsSource.map((item) => {
      const itemName = item.name || item.title || "Kids Apparel Item";
      const itemImage =
        item.image ||
        (Array.isArray(item.images) && item.images[0]?.url) ||
        (Array.isArray(item.images) && item.images[0]) ||
        item.imageUrl ||
        "/images/placeholder.jpg";

      return {
        name: itemName,
        title: itemName,
        image: itemImage,
        qty: Number(item.qty || item.quantity || 1),
        price: Number(item.price || 0),
        size: item.size || "Standard",
        color: item.color || "Default",
        product: item.productId || item.product || item._id || item.id,
      };
    });

    const shippingInfo = orderData.shippingAddress || orderData.shipping || {};

    const payload = {
      orderItems: formattedOrderItems,
      shippingAddress: {
        fullName: shippingInfo.fullName || "",
        address: shippingInfo.address || "",
        city: shippingInfo.city || "",
        postalCode: shippingInfo.postalCode || "",
      },
      subtotal: Number(orderData.subtotal || orderData.itemsPrice || 0),
      itemsPrice: Number(orderData.subtotal || orderData.itemsPrice || 0),
      shippingPrice: Number(orderData.shippingCost || orderData.shippingPrice || 0),
      taxPrice: 0,
      totalPrice: Number(orderData.total || orderData.totalPrice || 0),
      paymentMethod: orderData.paymentMethod || "eSewa",
      paymentProof: orderData.paymentProof || "",
    };

    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to place order");
    }

    const saved = await res.json();
    await fetchMyOrders();
    return saved;
  };

  // ---- Cart / stock ----
  const getVariantStock = (product, size, color) => {
    const variant = product?.variants?.find((v) => v.size === size && v.color === color);
    return variant ? variant.stock : 0;
  };

  const addToCart = (product, size, color, qty = 1) => {
    const stock = getVariantStock(product, size, color);
    if (stock === 0) return;
    const actualQty = Math.min(qty, stock);
    if (actualQty <= 0) return;

    setCart((prev) => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + actualQty } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product._id,
          name: product.name,
          price: product.price,
          size,
          color,
          image: product.images?.[0]?.url || product.images?.[0] || product.image,
          qty: actualQty,
        },
      ];
    });
  };

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setCart([]);

  // ---- Admin ----
  const addProduct = async (newProduct) => {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify(newProduct),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to add product");
    }
    const saved = await res.json();
    setProducts((prev) => [...prev, saved]);
    return saved;
  };

  const updateProduct = async (productId, updates) => {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p._id === productId ? updated : p)));
  };

  const deleteProduct = async (productId) => {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to delete product");
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const value = {
    products,
    productsLoading,
    getVariantStock,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    user,
    token,
    login,
    register,
    logout,
    profile: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: user?.shippingAddress?.address || "",
    },
    updateProfile,
    orders,
    fetchMyOrders,
    addOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    subscribe,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}