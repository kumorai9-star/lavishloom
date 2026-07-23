import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts, getVariantStock } from "../data/products";

const StoreContext = createContext(null);

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
  // ---- Products (base catalog + admin additions) ----
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
    } catch {
      // ignore
    }
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

  // ---- Auth + per-user profile, order history, wishlist ----
  // Everything is keyed by email in localStorage, so logging out and back in
  // with the same email restores name/phone/address, past orders, and wishlist.
  const [user, setUser] = useState(null); // { name, email, isAdmin }
  const [profile, setProfile] = useState({ fullName: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const login = async (email, _password) => {
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

    const loggedInUser = { name: record.fullName, email, isAdmin };
    setUser(loggedInUser);
    setProfile({
      fullName: record.fullName || "",
      phone: record.phone || "",
      address: record.address || "",
    });
    setOrders(record.orders || []);
    setWishlist(record.wishlist || []);

    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
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
    if (!user) return null;
    const newOrder = {
      id: `#LK-${Math.floor(10000 + Math.random() * 89999)}`,
      date: new Date().toISOString(),
      status: "Processing",
      ...order,
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      const usersDb = loadUsersDb();
      const key = user.email.toLowerCase();
      usersDb[key] = { ...usersDb[key], orders: next };
      saveUsersDb(usersDb);
      return next;
    });
    return newOrder;
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

  // ---- Cart / stock ----
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

  // ---- Admin: product management ----
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
    addOrder,
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