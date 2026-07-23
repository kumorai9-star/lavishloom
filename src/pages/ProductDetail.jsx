import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { getVariantStock, isProductSoldOut } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const product = products.find((p) => p._id === id);

  const [size, setSize] = useState(product?.sizes?.[0]);
  const [color, setColor] = useState(product?.colors?.[0]?.name);
  const [openDetails, setOpenDetails] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-ink/70 mb-6">That piece isn't in our archive.</p>
        <button onClick={() => navigate("/shop")} className="btn-secondary">
          Back to Shop
        </button>
      </div>
    );
  }

  const related = products.filter((p) => p._id !== product._id).slice(0, 4);
  const isWishlisted = wishlist.includes(product._id);
  const productSoldOut = isProductSoldOut(product);
  const currentStock = getVariantStock(product, size, color);

  const handleAddToBag = () => {
    if (currentStock === 0) return;
    addToCart(product, size, color, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <nav className="text-xs text-ink/60 mb-8">
        <Link to="/">Home</Link> <span className="mx-1">›</span>
        <Link to="/collections">Collections</Link> <span className="mx-1">›</span>
        <span className="text-ink">{product.category}</span> <span className="mx-1">›</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-[4/5] bg-stone/30 overflow-hidden mb-4">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              className={`w-full h-full object-cover ${productSoldOut ? "opacity-60 grayscale" : ""}`}
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square bg-stone/30 overflow-hidden">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow mb-2">{product.collection}</p>
          <h1 className="text-2xl md:text-3xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">${product.price.toFixed(2)}</span>
            <span className="text-terracotta text-sm">{"★".repeat(product.rating)}</span>
            <span className="text-sm text-ink/60">({product.reviews} Reviews)</span>
          </div>
          <p className="text-ink/70 leading-relaxed mb-8">{product.description}</p>

          {productSoldOut && (
            <p className="text-sm bg-stone/30 text-ink/70 px-4 py-3 mb-6">
              This piece is currently sold out in all sizes and colors.
            </p>
          )}

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-widest2 uppercase">Select Size</p>
              <button className="text-xs underline underline-offset-4 text-ink/60">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const stockForThisSize = getVariantStock(product, s, color);
                const disabled = stockForThisSize === 0;
                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-sm rounded-full border ${
                      size === s ? "bg-indigo text-cream border-indigo" : "border-stone text-ink"
                    } ${disabled ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-8">
            <p className="text-xs tracking-widest2 uppercase mb-3">Color: {color}</p>
            <div className="flex gap-3">
              {product.colors.map((c) => {
                const stockForThisColor = getVariantStock(product, size, c.name);
                const disabled = stockForThisColor === 0;
                return (
                  <button
                    key={c.name}
                    disabled={disabled}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={`h-8 w-8 rounded-full border-2 relative flex items-center justify-center ${
                      color === c.name ? "border-ink" : "border-transparent"
                    } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {disabled && <span className="text-[8px] text-white">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleAddToBag}
            disabled={currentStock === 0}
            className="btn-primary w-full mb-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentStock === 0
              ? "Out of Stock in This Size/Color"
              : added
              ? "Added to Bag ✓"
              : "Add to Bag"}
          </button>

          {currentStock > 0 && currentStock <= 3 && (
            <p className="text-sm text-terracotta mb-3 mt-2">Only {currentStock} left in this size/color</p>
          )}
          {currentStock === 0 && (
            <p className="text-sm text-ink/50 mb-3 mt-2">
              Try a different size or color above.
            </p>
          )}

          <button
            onClick={() => toggleWishlist(product._id)}
            className="btn-secondary w-full mb-8 mt-3"
          >
            {isWishlisted ? "♥ In Wishlist" : "♡ Add to Wishlist"}
          </button>

          <div className="border-t border-stone">
            <button
              onClick={() => setOpenDetails((v) => !v)}
              className="w-full flex items-center justify-between py-4 text-sm tracking-widest2 uppercase"
            >
              Product Details <span>{openDetails ? "−" : "+"}</span>
            </button>
            {openDetails && (
              <p className="pb-4 text-sm text-ink/70 leading-relaxed">{product.description}</p>
            )}
          </div>
          <div className="border-t border-stone">
            <button
              onClick={() => setOpenShipping((v) => !v)}
              className="w-full flex items-center justify-between py-4 text-sm tracking-widest2 uppercase"
            >
              Shipping & Returns <span>{openShipping ? "−" : "+"}</span>
            </button>
            {openShipping && (
              <p className="pb-4 text-sm text-ink/70 leading-relaxed">
                Complimentary express shipping on orders over $250. 30-day curated return policy.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-20">
        <h2 className="text-lg mb-8">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}