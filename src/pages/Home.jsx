import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";

const categoryTiles = [
  { name: "Boys", img: "/images/pic10.jpeg" },
  { name: "Girls", img: "/images/pic1.jpeg" },
];

export default function Home() {
  const { products } = useStore();
  const latest = products.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[520px] md:h-[600px] flex items-end">
        <img
          src="/images/pic22.jpeg"
          alt="Child in linen shirt beneath dappled light"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-16 w-full text-cream">
          <p className="eyebrow text-terracotta mb-3">Season of Grace</p>
          <h1 className="max-w-xl leading-tight">Crafted for the unhurried childhood.</h1>
          <p className="mt-4 max-w-md text-cream/90">
            Discover a collection where timeless craftsmanship meets the whimsical spirit of play.
          </p>
          <Link to="/shop" className="inline-block mt-8 btn-primary">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2>Curated Collections</h2>
          <Link to="/collections" className="text-sm underline underline-offset-4">
            View All Stories
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative h-96 overflow-hidden">
            <img src="/images/pic5.jpeg" alt="Premium linen collection" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 text-cream">
              <p className="eyebrow text-cream/80">Premium Linen</p>
              <h3>The Solstice Edit</h3>
            </div>
          </div>
          <div className="relative h-96 overflow-hidden">
            <img src="/images/pic21.jpeg" alt="Heritage knits collection" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 text-cream">
              <h3>Heritage Knits</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="bg-stone/20 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="eyebrow mb-2">Latest Arrivals</p>
          <h2 className="mb-3">Playful Precision</h2>
          <p className="max-w-xl text-ink/70 mb-10">
            Our newest pieces embrace the duality of a child's day — robust enough for adventure,
            elegant enough for celebration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {latest.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
        <h2 className="mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
          {categoryTiles.map((cat) => (
            <Link key={cat.name} to={`/shop?category=${cat.name}`} className="group">
              <div className="w-32 h-32 md:w-36 md:h-36 mx-auto rounded-full overflow-hidden bg-stone/40">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="mt-3 text-sm">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-10 text-center shadow-sm">
          <p className="text-terracotta mb-4">★★★★★</p>
          <p className="font-display text-lg italic text-ink/90 mb-4">
            "The quality of the linen is unparalleled. It feels like we're investing in heirlooms
            rather than just clothing. My daughter loves the freedom of the cuts."
          </p>
          <p className="text-sm text-ink/60">— Eleanor Thorne, New York</p>
        </div>
      </section>

      {/* Join the Atelier */}
      <section className="bg-indigo py-20">
        <div className="max-w-xl mx-auto px-6 text-center text-cream">
          <h2 className="mb-3">Join the Atelier</h2>
          <p className="text-cream/80 mb-8">
            Be the first to know when new pieces arrive — subscribe for instant new-arrival alerts.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const { subscribe } = useStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = subscribe(email);
    setMessage(result.message);
    if (result.success) setEmail("");
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 bg-transparent border border-cream/40 px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-1 focus:ring-cream"
        />
        <button
          type="submit"
          className="bg-cream text-ink text-sm tracking-widest2 uppercase px-8 py-3 hover:bg-white transition-colors"
        >
          Subscribe
        </button>
      </form>
      {message && <p className="text-sm text-cream/90 mt-3">{message}</p>}
    </div>
  );
}