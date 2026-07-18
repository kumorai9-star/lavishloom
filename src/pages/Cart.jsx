import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, user } = useStore();
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();

  const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 12;
  const tax = +(cartTotal * 0.08).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <h1 className="text-3xl mb-10">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/70 mb-6">Your bag is waiting to be filled.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-4 bg-white p-5 border border-stone/60">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg">{item.name}</h3>
                      <p className="text-xs text-ink/60 mt-1">
                        SIZE: {item.size} | COLOR: {item.color}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-stone">
                      <button
                        className="px-3 py-1"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="px-3">{item.qty}</span>
                      <button
                        className="px-3 py-1"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-xs text-ink/60 hover:text-terracotta"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="bg-white p-6 border border-stone/60 h-fit">
            <h2 className="text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/70">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Shipping</span>
                <span className={shipping === 0 ? "text-terracotta" : ""}>
                  {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-stone mt-4 pt-4 flex justify-between items-baseline">
              <span className="text-lg">Total</span>
              <span className="text-xl font-medium">${total.toFixed(2)}</span>
            </div>

            <div className="mt-6">
              <p className="text-xs tracking-widest2 uppercase mb-2">Promotional Code</p>
              <div className="flex">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-stone px-3 py-2 text-sm"
                />
                <button className="bg-indigo text-cream text-sm px-4">Apply</button>
              </div>
            </div>

            <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-6">
              Proceed to Checkout
            </button>

            {!user && (
              <p className="text-xs text-center text-ink/50 mt-3">
                You'll need to sign in to save and complete your order.
              </p>
            )}
            <p className="text-xs text-center text-ink/50 mt-2">
              🔒 Secure checkout powered by Lavishloom
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}