import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { categories, sizeRange, searchProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

const collectionsList = ["All Pieces", "Linen Essentials", "Denim Heritage", "Playwear Edit"];
const PAGE_SIZE = 6;

export default function Shop() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Category and search both come from the URL so they're shareable/linkable
  // (?category=Boys, ?search=red%20trousers)
  const activeCategory = searchParams.get("category") || "All";
  const urlSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [collection, setCollection] = useState("All Pieces");
  const [size, setSize] = useState(null);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Keep the input box in sync if the URL changes (e.g. navbar search / back button)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const setActiveCategory = (cat) => {
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === "All") {
        next.delete("category");
      } else {
        next.set("category", cat);
      }
      return next;
    });
  };

  const applySearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (searchInput.trim()) {
        next.set("search", searchInput.trim());
      } else {
        next.delete("search");
      }
      return next;
    });
  };

  const clearSearch = () => {
    setSearchInput("");
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (urlSearch) {
      list = searchProducts(list, urlSearch);
    }
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (collection !== "All Pieces") {
      list = list.filter((p) => p.collection === collection);
    }
    if (size) {
      list = list.filter((p) => p.sizes?.includes(size));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, urlSearch, activeCategory, collection, size, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <h1 className="text-3xl md:text-4xl mb-3">The Curated Archive</h1>
      <p className="text-ink/70 max-w-xl mb-8">
        Discover our latest editorial collections, where artisanal craftsmanship meets the
        whimsical spirit of childhood.
      </p>

      {/* Search box */}
      <form onSubmit={applySearch} className="flex gap-3 mb-8 max-w-xl">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Try "jackets", "red trousers", or "shirts for girls"'
          className="flex-1 input-field"
        />
        <button type="submit" className="btn-primary text-xs px-6">
          Search
        </button>
      </form>

      {/* Category pills — the primary way to browse */}
      <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-stone/60">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-4 py-2 text-sm rounded-full border ${
            activeCategory === "All" ? "bg-indigo text-cream border-indigo" : "border-stone text-ink"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full border ${
              activeCategory === cat ? "bg-indigo text-cream border-indigo" : "border-stone text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
        {/* Filters */}
        <aside>
          <div className="mb-8">
            <p className="eyebrow mb-4">Collection</p>
            <ul className="space-y-2 text-sm">
              {collectionsList.map((c) => (
                <li key={c}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="collection"
                      checked={collection === c}
                      onChange={() => {
                        setCollection(c);
                        setPage(1);
                      }}
                    />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <p className="eyebrow mb-4">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizeRange.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(size === s ? null : s);
                    setPage(1);
                  }}
                  className={`border px-3 py-1.5 text-xs ${
                    size === s ? "bg-indigo text-cream border-indigo" : "border-stone text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {(activeCategory !== "All" || collection !== "All Pieces" || size || urlSearch) && (
            <button
              onClick={() => {
                setActiveCategory("All");
                setCollection("All Pieces");
                setSize(null);
                clearSearch();
              }}
              className="text-xs underline text-ink/60 hover:text-ink"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <p className="text-sm text-ink/60">
              {urlSearch ? (
                <>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
                  <span className="text-ink">"{urlSearch}"</span>
                  <button onClick={clearSearch} className="ml-2 underline text-ink/60 hover:text-ink">
                    clear
                  </button>
                </>
              ) : (
                <>
                  Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                  {activeCategory !== "All" && (
                    <>
                      {" "}
                      in <span className="text-ink">{activeCategory}</span>
                    </>
                  )}
                </>
              )}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-stone bg-white text-sm px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="text-ink/60">No pieces match these filters yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-14 text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="disabled:opacity-30"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded-full ${
                      n === page ? "bg-indigo text-cream" : "text-ink hover:bg-stone/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}