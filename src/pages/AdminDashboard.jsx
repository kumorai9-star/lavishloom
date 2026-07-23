import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/products";

const navItems = ["Dashboard", "Products", "Orders", "Customers", "Analytics"];
const productTypes = ["Jacket", "Trousers", "Shorts", "Shirt", "Tank", "Cami", "Skirt", "Set"];

const emptyVariant = () => ({ size: "", color: "", stock: 0 });

export default function AdminDashboard() {
  const { user, logout, products, addProduct, deleteProduct } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone/20 flex">
      <aside className="w-64 bg-cream border-r border-stone/60 flex flex-col justify-between px-6 py-8">
        <div>
          <p className="font-display">Admin Portal</p>
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

      <div className="flex-1 p-8">
        {active === "Dashboard" && <DashboardOverview user={user} />}
        {active === "Products" && (
          <ProductsPanel products={products} addProduct={addProduct} deleteProduct={deleteProduct} />
        )}
        {active !== "Dashboard" && active !== "Products" && (
          <div className="bg-white border border-stone/60 p-10 text-center text-ink/60">
            {active} isn't wired up yet — ask to have it built next.
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardOverview({ user }) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Overview</h1>
          <p className="text-ink/70 mt-1">
            Welcome back, {user?.name || "Eleanor"}. Here's what's happening with Lavishloom today.
          </p>
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

      <div className="bg-white border border-stone/60 p-6">
        <h2 className="mb-4">Recent Orders</h2>
        <p className="text-sm text-ink/50">
          Real order data will appear here once wired to a backend — currently orders are stored
          per-customer under their Profile page.
        </p>
      </div>
    </>
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

function ProductsPanel({ products, addProduct, deleteProduct }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Products</h1>
          <p className="text-ink/70 mt-1">{products.length} products in your catalog.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary text-xs">
          {showForm ? "Close Form" : "+ Add Product"}
        </button>
      </div>

      {showForm && <AddProductForm addProduct={addProduct} onDone={() => setShowForm(false)} />}

      <div className="bg-white border border-stone/60 p-6 mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-ink/50 border-b border-stone/60">
              <th className="pb-3">Image</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Total Stock</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
              return (
                <tr key={p._id} className="border-b border-stone/30 last:border-0">
                  <td className="py-3">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.images?.[0]?.alt || p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 text-ink/70">{p.category}</td>
                  <td className="py-3">${p.price.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={totalStock === 0 ? "text-terracotta" : ""}>{totalStock}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => deleteProduct(p._id)} className="text-xs text-ink/50 hover:text-terracotta">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddProductForm({ addProduct, onDone }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState(productTypes[0]);
  const [collection, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [variants, setVariants] = useState([emptyVariant()]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: field === "stock" ? Number(value) : value } : v))
    );
  };

  const addVariantRow = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariantRow = (index) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !imagePreview) {
      alert("Please fill in name, price, and upload an image before saving.");
      return;
    }

    const validVariants = variants.filter((v) => v.size && v.color);
    const sizes = [...new Set(validVariants.map((v) => v.size))];
    const colorNames = [...new Set(validVariants.map((v) => v.color))];

    addProduct({
      name,
      price: Number(price),
      category,
      type,
      collection: collection || "New Arrivals",
      description: description || "A new addition to the Lavishloom collection.",
      sizes,
      colors: colorNames.map((c) => ({ name: c, hex: "#B4713F" })),
      variants: validVariants,
      images: [{ url: imagePreview, alt: name }],
      rating: 5,
      reviews: 0,
    });

    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone/60 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Product Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
        </label>
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Price ($)</span>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" required />
        </label>
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            {productTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Collection Name</span>
          <input value={collection} onChange={(e) => setCollectionName(e.target.value)} placeholder="e.g. Latest Arrivals" className="input-field" />
        </label>
        <label className="block">
          <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Product Image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="input-field" required />
        </label>
      </div>

      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border border-stone" />
      )}

      <label className="block">
        <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field" />
      </label>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-widest2 uppercase text-ink/70">Sizes, Colors & Stock</p>
          <button type="button" onClick={addVariantRow} className="text-xs underline">+ Add Row</button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
              <input placeholder="Size (e.g. 4Y)" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} className="input-field" />
              <input placeholder="Color (e.g. Navy)" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} className="input-field" />
              <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="input-field" />
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariantRow(i)} className="text-xs text-ink/50 hover:text-terracotta">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary">Save Product</button>
    </form>
  );
}