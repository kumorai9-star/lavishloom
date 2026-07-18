import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const navItems = ["Dashboard", "Products", "Orders", "Customers", "Analytics"];

const recentOrders = [
  { id: "#LV-8901", customer: "Sophie Bennett", product: "Silk Heirloom Dress", status: "SHIPPED", amount: 185 },
  { id: "#LV-8902", customer: "James Miller", product: "Linen Tailored Vest", status: "PROCESSING", amount: 110 },
  { id: "#LV-8903", customer: "Elena Rodriguez", product: "Cashmere Baby Set", status: "PENDING", amount: 240 },
  { id: "#LV-8904", customer: "Arthur P.", product: "Velvet Occasion Cape", status: "SHIPPED", amount: 195 },
  { id: "#LV-8905", customer: "Claire Thompson", product: "Embroidered Cotton Tunic", status: "DELIVERED", amount: 95 },
];

const inventoryAlerts = [
  { name: "Classic Silk Bow Dress", sku: "CH-D-012", size: "4Y", left: 2 },
  { name: "Midnight Linen Trouser", sku: "CH-P-442", size: "2Y", left: 1 },
  { name: "Terracotta Wool Knit", sku: "CH-K-109", size: "6Y", left: 4 },
];

const statusColor = {
  SHIPPED: "bg-green-100 text-green-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-blue-100 text-blue-700",
};

export default function AdminDashboard() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone/20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-cream border-r border-stone/60 flex flex-col justify-between px-6 py-8">
        <div>
          <p className="font-display text-lg">Admin Portal</p>
          <p className="text-xs tracking-widest2 uppercase text-ink/50 mb-10">Management Suite</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`w-full text-left px-4 py-3 rounded text-sm ${
                  active === item ? "bg-indigo text-cream" : "text-ink/80 hover:bg-stone/40"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between border-t border-stone/60 pt-5">
          <div>
            <p className="text-sm font-medium">{user?.name || "Eleanor Loom"}</p>
            <p className="text-xs text-ink/50">Store Owner</p>
          </div>
          <button onClick={handleSignOut} className="text-xs underline">Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl">Overview</h1>
            <p className="text-ink/70 mt-1">Welcome back, {user?.name || "Eleanor"}. Here's what's happening with Lavishloom today.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary text-xs">Last 30 Days</button>
            <button className="btn-primary text-xs">Export Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Sales" value="$42,890.00" delta="+12.5%" />
          <StatCard label="New Orders" value="156" delta="+8.2%" />
          <StatCard label="Visitors Today" value="2,405" delta="Stable" neutral />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white border border-stone/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Recent Orders</h2>
              <button className="text-xs underline">View All</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-ink/50 border-b border-stone/60">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-stone/30 last:border-0">
                    <td className="py-3">{o.id}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3 text-ink/70">{o.product}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">${o.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-stone/60 p-6 h-fit">
            <h2 className="text-lg mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              {inventoryAlerts.map((item) => (
                <div key={item.sku} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-ink/50">SKU: {item.sku} | Size: {item.size}</p>
                  </div>
                  <span className="text-xs text-terracotta">{item.left} Left</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full text-xs mt-6">Restock Inventory</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, neutral }) {
  return (
    <div className="bg-white border border-stone/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-9 w-9 rounded-full bg-stone/40" />
        <span className={`text-xs px-2 py-1 rounded-full ${neutral ? "bg-stone/40 text-ink/60" : "bg-green-100 text-green-700"}`}>
          {delta}
        </span>
      </div>
      <p className="text-xs uppercase tracking-widest2 text-ink/50">{label}</p>
      <p className="text-2xl font-display mt-1">{value}</p>
    </div>
  );
}
