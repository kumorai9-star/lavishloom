import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const orders = [
  { id: "#LK-98210", date: "Oct 24, 2025", status: "DELIVERED", total: 432.5 },
  { id: "#LK-97554", date: "Sep 12, 2025", status: "DELIVERED", total: 210.0 },
  { id: "#LK-96201", date: "Aug 05, 2025", status: "RETURNED", total: 89.0 },
];

const statusColor = {
  DELIVERED: "bg-green-100 text-green-700",
  RETURNED: "bg-stone/60 text-ink/60",
  SHIPPED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-orange-100 text-orange-700",
};

export default function Profile() {
  const { user, logout, wishlist, products } = useStore();
  const navigate = useNavigate();
  const wishlistedProducts = products.filter((p) => wishlist.includes(p._id));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone/60">
        <div>
          <h1 className="text-3xl">Welcome, {user?.name}</h1>
          <p className="text-ink/70 mt-1">Curating timeless pieces for your little ones.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-xs">Edit Profile</button>
          <button onClick={handleLogout} className="btn-secondary text-xs">Logout</button>
          {user?.isAdmin && (
            <Link to="/admin" className="btn-primary text-xs flex items-center">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="bg-white border border-stone/60 p-6 h-fit">
          <h2 className="text-lg mb-5">Personal Info</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase text-ink/50">Email Address</dt>
              <dd className="mt-1">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-ink/50">Phone</dt>
              <dd className="mt-1">+1 (555) 012-3456</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-ink/50">Delivery Address</dt>
              <dd className="mt-1">124 Boutique Lane, Savannah, GA</dd>
            </div>
          </dl>

          <div className="mt-8 pt-6 border-t border-stone/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">My Wishlist</h2>
              <Link to="/shop" className="text-xs underline">View All</Link>
            </div>
            {wishlistedProducts.length === 0 ? (
              <p className="text-sm text-ink/50">Nothing saved yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistedProducts.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`}>
                    <img src={p.images[0]} alt={p.name} className="aspect-square object-cover mb-2" />
                    <p className="text-xs">{p.name}</p>
                    <p className="text-xs text-ink/60">${p.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white border border-stone/60 p-6 mb-6">
            <h2 className="text-lg mb-5">Recent Orders</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-ink/50 border-b border-stone/60">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-stone/30 last:border-0">
                    <td className="py-4">{o.id}</td>
                    <td className="py-4 text-ink/70">{o.date}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-indigo text-cream p-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Lavishloom Loyalty</p>
              <p className="text-sm text-cream/80">You have 1,250 points to spend</p>
            </div>
            <button className="bg-cream text-ink text-xs tracking-widest2 uppercase px-5 py-3">
              Redeem Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
