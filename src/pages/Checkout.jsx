import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

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
  const [paymentMethod, setPaymentMethod] = useState(null); // "esewa" | "mobile_banking"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!paymentMethod) {
      setError("Please select a payment method to continue.");
      return;
    }

    setPlacing(true);
    try {
      await addOrder({
        items: cart.map((item) => ({
          name: item.name,
          size: item.size,
          color: item.color,
          qty: item.qty,
          price: item.price,
          image: item.image,
          productId: item.productId,
        })),
        shipping: { ...form },
        subtotal: cartTotal,
        shippingCost: shipping,
        total,
        paymentMethod: paymentMethod === "esewa" ? "eSewa" : "Mobile Banking",
      });
      clearCart();
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Something went wrong placing your order.");
    } finally {
      setPlacing(false);
    }
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

          <h2 className="mb-4 mt-10">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PaymentOption
              id="esewa"
              label="eSewa"
              description="Pay securely using your eSewa wallet."
              selected={paymentMethod === "esewa"}
              onSelect={() => setPaymentMethod("esewa")}
            >
              <EsewaLogo />
            </PaymentOption>

            <PaymentOption
              id="mobile_banking"
              label="Mobile Banking"
              description="Pay directly via your bank's mobile app."
              selected={paymentMethod === "mobile_banking"}
              onSelect={() => setPaymentMethod("mobile_banking")}
            >
              <MobileBankingIcon />
            </PaymentOption>
          </div>

          {error && <p className="text-sm text-terracotta mt-4">{error}</p>}

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

function PaymentOption({ id, label, description, selected, onSelect, children }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-start gap-4 p-4 border text-left transition-colors ${
        selected ? "border-indigo bg-indigo/5" : "border-stone hover:border-ink/40"
      }`}
    >
      <div className="h-10 w-10 flex items-center justify-center shrink-0">{children}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">{label}</span>
          <span
            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
              selected ? "border-indigo" : "border-stone"
            }`}
          >
            {selected && <span className="h-2 w-2 rounded-full bg-indigo" />}
          </span>
        </div>
        <p className="text-xs text-ink/60 mt-1">{description}</p>
      </div>
    </button>
  );
}

function EsewaLogo() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" fill="#60BB46" />
      <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="sans-serif">
        e
      </text>
    </svg>
  );
}

function MobileBankingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="6" y1="6" x2="18" y2="6" />
      <line x1="6" y1="18" x2="18" y2="18" />
      <circle cx="12" cy="20" r="0.5" fill="currentColor" />
    </svg>
  );
}