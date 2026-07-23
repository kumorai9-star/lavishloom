import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { isProductSoldOut } from "../data/products";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product._id);
  const soldOut = isProductSoldOut(product);

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-stone/30 aspect-[4/5]">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0]?.url}
            alt={product.images?.[0]?.alt || product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              soldOut ? "opacity-50 grayscale" : ""
            }`}
          />
        </Link>

        {product.isNew && !soldOut && (
          <span className="absolute top-3 right-3 bg-terracotta text-cream text-[10px] tracking-widest2 uppercase px-3 py-1 rounded-full">
            New
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center pointer-events-none">
            <span className="bg-ink text-cream text-xs tracking-widest2 uppercase px-4 py-2">
              Sold Out
            </span>
          </div>
        )}

        <button
          onClick={() => toggleWishlist(product._id)}
          aria-label="Toggle wishlist"
          className="absolute top-3 left-3 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#C1633D" : "none"}
            stroke={isWishlisted ? "#C1633D" : "currentColor"}
            strokeWidth="1.5"
          >
            <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.2 4 6 4c2 0 3.5 1 6 3.5C14.5 5 16 4 18 4c3.8 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      <Link to={`/product/${product._id}`} className="block mt-4">
        <h3 className={soldOut ? "text-ink/50" : "text-ink"}>{product.name}</h3>
        {product.collection && (
          <p className="text-xs text-ink/60 mt-0.5">{product.collection}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className={`text-sm ${soldOut ? "text-ink/40" : "text-ink"}`}>
            ${product.price.toFixed(2)}
          </p>
          {soldOut && <span className="text-xs text-ink/40">Currently unavailable</span>}
        </div>
      </Link>
    </div>
  );
}