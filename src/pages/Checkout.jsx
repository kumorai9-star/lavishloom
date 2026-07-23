import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Checkout() {
  const { cart, cartTotal, clearCart, addOrder, user, profile } = useStore();
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

  useEffect(() => {
    setForm((f) => ({
      ...f,
      email: user?.email || f.email,
      fullName: profile?.fullName || f.fullName,
      contactNumber: profile?.phone || f.contactNumber,
      address: profile?.address || f.address,
    }));
  }, [user, profile]);

  const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 12;
  const total = +(cartTotal + shipping).toFixed(2);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      addOrder({
        items: cart.map((item) => ({
          name: item.name,
          size: item.size,
          color: item.color,
          qty: item.qty,
          price: item.price,
          image: item.image,
        })),
        shipping: { ...form },
        subtotal: cartTotal,
        shippingCost: shipping,
        total,
      });
      clearCart();
      navigate("/profile");
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <h1 className="mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-6">Shipping Information</h2>
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
          <h2 className="mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-ink/60 text-xs">Size: {item.size}</p>
                </div>
                <p className="text-sm">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/70">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/70">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="border-t border-stone mt-3 pt-3 flex justify-between text-lg">
            <span>Total</span>
            <span className="font-medium">${total.toFixed(2)}</span>
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