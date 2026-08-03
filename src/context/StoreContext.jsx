import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts, getVariantStock } from "../data/products";

const StoreContext = createContext(null);

// Dynamic API Base URL using Vite env variable with Render as a fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://lavishloom-backend.onrender.com";

const ADMIN_PRODUCTS_KEY = "lavishloom_admin_products_v1";
const USERS_STORAGE_KEY = "lavishloom_users_v1";

function loadUsersDb() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsersDb(db) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore storage errors
  }
}

export function StoreProvider({ children }) {
  // ---- Products ----
  const [adminProducts, setAdminProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(adminProducts));
    } catch {}
  }, [adminProducts]);

  const [stockAdjustments, setStockAdjustments] = useState({});

  const products = useMemo(() => {
    const base = [...seedProducts, ...adminProducts];
    return base.map((p) => ({
      ...p,
      variants: p.variants?.map((v) => {
        const key = `${p._id}|${v.size}|${v.color}`;
        const adjustment = stockAdjustments[key] || 0;
        return { ...v, stock: Math.max(0, v.stock + adjustment) };
      }),
    }));
  }, [adminProducts, stockAdjustments]);

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

  // ---- Auth & Orders State ----
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lavishloom_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState({ fullName: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Helper to extract JWT token from state or localStorage
  const getToken = () => {
    return user?.token || localStorage.getItem("token") || "";
  };

  // Fetch orders from MongoDB Backend
  const fetchMyOrders = async () => {
    const rawToken = getToken();
    if (!rawToken) return;

    const authHeader = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

    setLoadingOrders(true);
    try {
      // Updated to use dynamic API_BASE_URL variable:
      const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders from MongoDB:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders automatically whenever user logs in or mounts
  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // Updated Login Function to store token inside user state & local storage
  const login = async (email, _password, token = null) => {
    const validToken = token || localStorage.getItem("token") || "";

    if (validToken) {
      localStorage.setItem("token", validToken);
    }

    const isAdmin = email.toLowerCase().includes("admin");
    const key = email.toLowerCase();
    const usersDb = loadUsersDb();
    let record = usersDb[key];

    if (!record) {
      record = {
        fullName: email.split("@")[0],
        email,
        phone: "",
        address: "",
        orders: [],
        wishlist: [],
      };
      usersDb[key] = record;
      saveUsersDb(usersDb);
    }

    // Include token directly inside user object
    const loggedInUser = {
      name: record.fullName,
      email,
      isAdmin,
      token: validToken,
    };

    setUser(loggedInUser);
    localStorage.setItem("lavishloom_user", JSON.stringify(loggedInUser));

    setProfile({
      fullName: record.fullName || "",
      phone: record.phone || "",
      address: record.address || "",
    });
    setWishlist(record.wishlist || []);

    // Load orders from Backend API
    await fetchMyOrders();

    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lavishloom_user");
    localStorage.removeItem("token");
    setProfile({ fullName: "", phone: "", address: "" });
    setOrders([]);
    setWishlist([]);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      const usersDb = loadUsersDb();
      const key = user.email.toLowerCase();
      usersDb[key] = { ...usersDb[key], ...next, email: user.email };
      saveUsersDb(usersDb);
      return next;
    });
    if (updates.fullName) {
      setUser((prev) => (prev ? { ...prev, name: updates.fullName } : prev));
    }
  };

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      if (user) {
        const usersDb = loadUsersDb();
        const key = user.email.toLowerCase();
        usersDb[key] = { ...usersDb[key], wishlist: next };
        saveUsersDb(usersDb);
      }
      return next;
    });
  };

  // ---- Cart helpers ----
  const adjustVariantStock = (productId, size, color, delta) => {
    const key = `${productId}|${size}|${color}`;
    setStockAdjustments((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + delta,
    }));
  };

  const addToCart = (product, size, color, qty = 1) => {
    const liveProduct = products.find((p) => p._id === product._id) || product;
    const stock = getVariantStock(liveProduct, size, color);
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
          image: product.images?.[0]?.url,
          qty: actualQty,
        },
      ];
    });

    adjustVariantStock(product._id, size, color, -actualQty);
  };

  const updateQty = (key, qty) => {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    if (qty < 1) return removeFromCart(key);

    const diff = qty - item.qty;
    adjustVariantStock(item.productId, item.size, item.color, -diff);
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  };

  const removeFromCart = (key) => {
    const item = cart.find((i) => i.key === key);
    if (item) {
      adjustVariantStock(item.productId, item.size, item.color, item.qty);
    }
    setCart((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setCart([]);

  // ---- Admin helpers ----
  const addProduct = (newProduct) => {
    setAdminProducts((prev) => [...prev, { ...newProduct, _id: `p${Date.now()}` }]);
  };

  const updateProduct = (productId, updates) => {
    setAdminProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (productId) => {
    setAdminProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const resetProductsToSeed = () => {
    setAdminProducts([]);
    setStockAdjustments({});
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const value = {
    products,
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
    login,
    logout,
    profile,
    updateProfile,
    orders,
    loadingOrders,
    addOrder,
    fetchMyOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToSeed,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}