import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("We couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
      {redirectTo === "/checkout" && (
        <p className="text-sm bg-stone/30 text-ink/80 px-4 py-3 mb-6">
          Sign in to save your order and continue to checkout.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 border border-stone/60 bg-white overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="mb-2">Welcome</h1>
          <p className="text-ink/70 mb-8">Sign in to your boutique account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs tracking-widest2 uppercase text-ink/70 block mb-2">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-field"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-widest2 uppercase text-ink/70">Password</span>
                <button type="button" className="text-xs underline">Forgot?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </label>

            {error && <p className="text-sm text-terracotta">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-ink/50 mt-6">
            Tip: use any email containing "admin" (e.g. admin@lavishloom.com) to preview the admin
            dashboard.
          </p>
        </div>

        <div className="relative hidden md:block">
          <img src="/images/pic22.jpeg" alt="Lavishloom boutique interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-indigo/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-cream px-10">
            <h2 className="mb-4">New to the family?</h2>
            <p className="text-cream/85 mb-8">
              Join Lavishloom Kidz for curated collections, exclusive early access, and a
              personalized shopping experience tailored for your little ones.
            </p>
            <button className="border border-cream px-8 py-3 text-sm tracking-widest2 uppercase hover:bg-cream hover:text-ink transition-colors">
              Create Account →
            </button>
            <p className="text-xs text-cream/60 mt-6">Handcrafted for Childhood since 2012</p>
          </div>
        </div>
      </div>
    </div>
  );
}