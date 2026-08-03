import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://lavishloom-backend.onrender.com";

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
      // FIXED HERE: Replaced localhost:5000 with ${API_BASE_URL}
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      await login(data.email || email, password, data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "We couldn't sign you in. Check your details and try again.");
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
          <h1 className="mb-2 font-semibold text-2xl">Welcome</h1>
          <p className="text-ink/70 mb-8">Sign in to your boutique account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs tracking-widest uppercase text-ink/70 block mb-2">
                Email Address
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-field w-full p-2 border border-stone"
                required
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-widest uppercase text-ink/70">
                  Password
                </span>
                <button type="button" className="text-xs underline">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full p-2 border border-stone"
                required
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 py-3 bg-black text-white"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-ink/50 mt-6">
            Tip: use any email containing "admin" (e.g. admin@lavishloom.com) to preview the admin
            dashboard.
          </p>
        </div>

        <div className="relative hidden md:block">
          <img
            src="/images/pic22.jpeg"
            alt="Lavishloom boutique interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-10">
            <h2 className="mb-4 text-xl font-semibold">New to the family?</h2>
            <p className="text-white/85 mb-8 text-sm">
              Join Lavishloom Kidz for curated collections, exclusive early access, and a
              personalized shopping experience tailored for your little ones.
            </p>
            <Link
              to="/register"
              className="border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors inline-block"
            >
              Create Account →
            </Link>
            <p className="text-xs text-white/60 mt-6">Handcrafted for Childhood since 2012</p>
          </div>
        </div>
      </div>
    </div>
  );
}