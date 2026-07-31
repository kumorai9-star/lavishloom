import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

export default function Checkout() {
  const { cart, cartTotal, clearCart, user, profile } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || "",
    fullName: profile?.fullName || "",
    contactNumber: profile?.phone || "",
    address: profile?.address || "",
    city: "",
    postalCode: "",
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((f) => ({
      ...f,
      email: user?.email || f.email,
      fullName: profile?.fullName || f.fullName,
      contactNumber: profile?.phone || f.contactNumber,
      address: profile?.address || f.address,
    }));
  }, [user, profile]);

  const shipping = cartTotal > 25000 || cartTotal === 0 ? 0 : 500;
  const total = cartTotal + shipping;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Step 1: Universal Token Inspector (checks StoreContext & LocalStorage)
  const getAuthToken = () => {
    // 1. Check React state (StoreContext)
    if (user?.token) {
      return user.token.startsWith("Bearer ") ? user.token : `Bearer ${user.token}`;
    }

    // 2. Check common LocalStorage keys
    const possibleKeys = ["userInfo", "user", "token", "authToken"];
    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        const tok = parsed?.token || parsed;
        if (typeof tok === "string" && tok.length > 10) {
          return tok.startsWith("Bearer ") ? tok : `Bearer ${tok}`;
        }
      } catch {
        if (typeof raw === "string" && raw.length > 10) {
          return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const authHeader = getAuthToken();

    if (!authHeader) {
      setError("Your session has expired or you are not logged in. Please log in again.");
      return;
    }

    setPlacing(true);
    setError("");

    const orderData = {
      orderItems: cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: {
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      paymentMethod: "COD",
      itemsPrice: cartTotal,
      taxPrice: 0,
      shippingPrice: shipping,
      totalPrice: total,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Token verification or order creation failed");
      }

      clearCart();
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Failed to connect to backend server.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <h1 className="mb-8 font-semibold text-2xl">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-6 font-semibold text-lg">Shipping Information</h2>
          <div className="space-y-4">
            <Field label="Email Address" type="email" value={form.email} onChange={update("email")} placeholder="example@lavishloom.com" />
            <Field label="Full Name" value={form.fullName} onChange={update("fullName")} placeholder="Your full name" />
            <Field label="Contact Number" type="tel" value={form.contactNumber} onChange={update("contactNumber")} placeholder="+977 98XXXXXXXX" />
            <Field label="Shipping Address" value={form.address} onChange={update("address")} placeholder="123 Atelier Lane" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={form.city} onChange={update("city")} placeholder="Kathmandu" />
              <Field label="Postal Code" value={form.postalCode} onChange={update("postalCode")} placeholder="44600" />
            </div>
          </div>

          <button type="submit" disabled={placing} className="btn-primary w-full mt-8 disabled:opacity-60">
            {placing ? "Placing Order..." : "Place Order 🔒"}
          </button>
        </form>

        <aside className="bg-white p-6 border border-stone/60 h-fit">
          <h2 className="mb-6 font-semibold text-lg">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.key || item._id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-ink/60 text-xs">Size: {item.size}</p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/70">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/70">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="border-t border-stone mt-3 pt-3 flex justify-between text-lg">
            <span>Total</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-ink/50 mt-4">
            🛡 Your information is kept secure and is never shared with third parties.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">{label}</span>
      <input {...props} required className="input-field" />
    </label>
  );
}