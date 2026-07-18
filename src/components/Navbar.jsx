import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/StoreContext";

const navLinks = [
  { label: "Shop", to: "/shop" },
  { label: "Boys", to: "/shop?category=Boys" },
  { label: "Girls", to: "/shop?category=Girls" },
];

export default function Navbar() {
  const { cartCount, user } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className=" border-b border-stone/60 bg-cream sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-xl md:text-2xl tracking-wide text-ink">
          Lavishloom Kidz
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm tracking-widest2 uppercase">
          {navLinks.map((link) => {
            const linkCategory = link.to.includes("category=")
              ? link.to.split("category=")[1]
              : null;
            const isActive =
              typeof window !== "undefined" &&
              window.location.pathname === "/shop" &&
              ((linkCategory && activeCategory === linkCategory) ||
                (!linkCategory && !activeCategory));
            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={`pb-1 border-b transition-colors ${
                  isActive ? "border-ink text-ink" : "border-transparent text-ink/80 hover:text-ink"
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={`hover:opacity-70 ${searchOpen ? "text-terracotta" : ""}`}
          >
            <SearchIcon />
          </button>
          <Link to={user ? "/profile" : "/login"} aria-label="Account" className="hover:opacity-70">
            <UserIcon />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:opacity-70">
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-cream text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full bg-cream border-b border-stone/60 py-4 shadow-sm z-30">
          <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-6 md:px-10 flex gap-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "red trousers", "jackets", or "shirts for girls"'
              className="flex-1 input-field"
            />
            <button type="submit" className="btn-primary text-xs px-6">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="text-sm text-ink/60 px-2"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm tracking-widest2 uppercase">
          <form onSubmit={submitSearch} className="flex gap-2 normal-case tracking-normal mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 input-field text-sm"
            />
            <button type="submit" className="btn-primary text-xs px-4">
              Go
            </button>
          </form>
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}