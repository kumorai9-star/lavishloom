import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    setEmail("");
  };

  return (
    <footer className="bg-stone/30 border-t border-stone/60 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-lg mb-3">Lavishloom Kidz</h3>
          <p className="text-sm text-ink/70 leading-relaxed">
            Curating high-end aesthetics for the next generation of unhurried dreamers.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Sustainability</a></li>
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Size Guide</a></li>
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Shipping & Returns</a></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Privacy Policy</a></li>
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Contact Us</a></li>
            <li><a href="/#" className="hover:text-ink underline decoration-stone underline-offset-4">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Newsletter</h4>
          <p className="text-sm text-ink/70 mb-3">Join our atelier for exclusive previews and stories of craftsmanship.</p>
          {joined ? (
            <p className="text-sm text-terracotta">You're on the list — welcome in.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@address.com"
                className="flex-1 bg-white border border-stone px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo"
              />
              <button type="submit" className="bg-indigo text-cream text-sm px-5 hover:bg-ink transition-colors">
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-stone/60 py-6 text-center text-xs text-ink/60">
        © {new Date().getFullYear()} Lavishloom Kidz. Crafted for the unhurried childhood.
      </div>
    </footer>
  );
}
