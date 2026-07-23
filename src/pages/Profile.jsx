import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const statusColor = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Returned: "bg-stone/60 text-ink/60",
};

export default function Profile() {
  const { user, profile, updateProfile, orders, wishlist, products, logout } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    address: profile.address || "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  }, [profile]);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p._id));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (iso) => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone/60">
        <div>
          <h1>Welcome, {profile.fullName || user?.name}</h1>
          <p className="text-ink/70 mt-1">Manage your details and track your orders.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="btn-secondary text-xs">Logout</button>
          {user?.isAdmin && (
            <Link to="/admin" className="btn-primary text-xs flex items-center">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        <div className="space-y-8">
          <form onSubmit={handleSaveProfile} className="bg-white border border-stone/60 p-6">
            <h2 className="mb-5">Personal Info</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs uppercase text-ink/50 block mb-1">Full Name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Your full name"
                  className="input-field"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase text-ink/50 block mb-1">Email Address</span>
                <input value={user?.email || ""} disabled className="input-field bg-stone/20 text-ink/60" />
              </label>
              <label className="block">
                <span className="text-xs uppercase text-ink/50 block mb-1">Contact Number</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+977 98XXXXXXXX"
                  className="input-field"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase text-ink/50 block mb-1">Delivery Address</span>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  rows={3}
                  placeholder="Street, City, Postal Code"
                  className="input-field"
                />
              </label>
            </div>
            <button type="submit" className="btn-primary w-full mt-5 text-xs">
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>

          <div className="bg-white border border-stone/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>My Wishlist</h2>
              <Link to="/shop" className="text-xs underline">Browse</Link>
            </div>
            {wishlistedProducts.length === 0 ? (
              <p className="text-sm text-ink/50">Nothing saved yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistedProducts.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`}>
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.images?.[0]?.alt || p.name}
                      className="aspect-square object-cover mb-2"
                    />
                    <p className="text-xs">{p.name}</p>
                    <p className="text-xs text-ink/60">${p.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone/60 p-6 h-fit">
          <h2 className="mb-5">Order & Transaction History</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-ink/50">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-stone/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{o.id}</p>
                      <p className="text-xs text-ink/50">{formatDate(o.date)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status] || "bg-stone/40 text-ink/60"}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="text-sm text-ink/70 space-y-1 mb-2">
                    {o.items?.map((item, i) => (
                      <p key={i}>
                        {item.name} — {item.size} / {item.color} × {item.qty}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm border-t border-stone/40 pt-2">
                    <span className="text-ink/60">Total</span>
                    <span className="font-medium">${o.total?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}