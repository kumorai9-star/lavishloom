import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as allProducts, getVariantStock } from "../data/products";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem("lavishloom_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null); // null = logged out. { name, email, isAdmin }

  useEffect(() => {
    sessionStorage.setItem("lavishloom_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, color, qty = 1) => {
    const stock = getVariantStock(product, size, color);
    if (stock === 0) return; // this size/color combo is unavailable

    setCart((prev) => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find((item) => item.key === key);
      const currentQtyInCart = existing ? existing.qty : 0;
      const nextQty = Math.min(currentQtyInCart + qty, stock); // never exceed available stock

      if (existing) {
        return prev.map((item) => (item.key === key ? { ...item, qty: nextQty } : item));
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
          image: product.images?.[0],
          qty: nextQty,
        },
      ];
    });
  };

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCart((prev) => prev.map((item) => (item.key === key ? { ...item, qty } : item)));
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Stand-ins for real API calls (POST /api/auth/login etc). Swap the body
  // of these functions for fetch() calls once the Express routes exist.
  const login = async (email, _password) => {
    const isAdmin = email.toLowerCase().includes("admin");
    const loggedInUser = { name: email.split("@")[0], email, isAdmin };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => setUser(null);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const value = {
    products: allProducts,
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
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}