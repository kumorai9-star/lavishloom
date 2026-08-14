import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

const statusColor = {
  PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  SHIPPED: "bg-blue-100 text-blue-800 border-blue-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  RETURNED: "bg-stone-200 text-stone-700 border-stone-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function Profile() {
  const { user, profile, updateProfile, wishlist, products, orders, fetchMyOrders, logout, token } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });
  const [saved, setSaved] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Refresh orders on page load
  useEffect(() => {
    const loadData = async () => {
      if (token) {
        await fetchMyOrders();
      }
      setLoadingOrders(false);
    };
    loadData();
  }, [token]);

  useEffect(() => {
    setForm({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
  }, [profile]);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p._id));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone/60">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome, {profile?.fullName || user?.name || "Guest"}
          </h1>
          <p className="text-ink/70 text-sm mt-1">Manage your details and track your orders.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2">
            Logout
          </button>
          {user?.isAdmin && (
            <Link to="/admin" className="btn-primary text-xs flex items-center px-4 py-2">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        {/* Left Column: Personal Info & Wishlist */}
        <div className="space-y-8">
          <form onSubmit={handleSaveProfile} className="bg-white border border-stone/60 p-6 rounded-sm">
            <h2 className="text-base font-semibold mb-5">Personal Info</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-ink/50 block mb-1">
                  Full Name
                </span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Your full name"
                  className="input-field w-full"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-ink/50 block mb-1">
                  Email Address
                </span>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input-field w-full bg-stone/20 text-ink/60 cursor-not-allowed"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-ink/50 block mb-1">
                  Contact Number
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+977 98XXXXXXXX"
                  className="input-field w-full"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-ink/50 block mb-1">
                  Delivery Address
                </span>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  rows={3}
                  placeholder="Street, City, Postal Code"
                  className="input-field w-full"
                />
              </label>
            </div>

            <button type="submit" className="btn-primary w-full mt-5 text-xs py-2.5">
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>

          <div className="bg-white border border-stone/60 p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">My Wishlist</h2>
              <Link to="/shop" className="text-xs underline text-ink/70 hover:text-black">
                Browse
              </Link>
            </div>

            {wishlistedProducts.length === 0 ? (
              <p className="text-sm text-ink/50">Nothing saved yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistedProducts.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`} className="group block">
                    <img
                      src={p.images?.[0]?.url || p.images?.[0]}
                      alt={p.name}
                      className="aspect-square object-cover mb-2 rounded-sm group-hover:opacity-90 transition-opacity"
                    />
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-xs text-ink/60">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="bg-white border border-stone/60 p-6 h-fit rounded-sm">
          <h2 className="text-base font-semibold mb-5">Order & Transaction History</h2>

          {loadingOrders ? (
            <p className="text-sm text-ink/50 py-4">Loading your order history...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-stone/60 rounded">
              <p className="text-sm text-ink/60 mb-2">You haven't placed any orders yet.</p>
              <Link to="/shop" className="text-xs underline font-medium">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const items = o.items || [];
                const currentStatus = (o.status || "PROCESSING").toUpperCase();

                return (
                  <div key={o._id || o.id} className="border border-stone/50 p-4 rounded-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone/30">
                      <div>
                        <p className="font-semibold text-sm">{o.id}</p>
                        <p className="text-xs text-ink/50">{formatDate(o.date)}</p>
                      </div>
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 border rounded-full ${
                          statusColor[currentStatus] || "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {currentStatus.toLowerCase()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 text-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded border border-stone/30 flex-shrink-0"
                              />
                            )}
                            <div className="truncate">
                              <p className="font-medium text-xs truncate">{item.name}</p>
                              <p className="text-[11px] text-ink/60">
                                {item.size && `Size: ${item.size}`}{" "}
                                {item.color && `| Color: ${item.color}`} | Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium flex-shrink-0">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-stone/40 pt-2.5 mt-2">
                      <span className="text-ink/60 text-xs">Total Amount</span>
                      <span className="font-semibold text-sm">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}