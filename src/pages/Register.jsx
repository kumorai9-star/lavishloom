const API_BASE_URL = import.meta.env.VITE_API_URL || "https://lavishloom-backend.onrender.com";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Register() {
  const { login } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Automatically log user in upon registration
      if (data.token) {
        await login(data.email || email, password, data.token);
      }

      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="border border-stone/60 bg-white p-8 md:p-12">
        <h1 className="mb-2 font-semibold text-2xl">Create Account</h1>
        <p className="text-ink/70 mb-8">Join the Lavishloom Kidz family today.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs tracking-widest uppercase text-ink/70 block mb-2">
              Full Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="input-field w-full p-2 border border-stone"
              required
            />
          </label>

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
            <span className="text-xs tracking-widest uppercase text-ink/70 block mb-2">
              Password
            </span>
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
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}