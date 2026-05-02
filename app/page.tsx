"use client";
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/api/me`, {
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const endpoint = mode === "login" ? "login" : "register";
    const payload =
      mode === "register"
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

    try {
      const res = await fetch(`${API_BASE}/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // ✅ FIX ADDED
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Request failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setMessage(mode === "login" ? "Logged in successfully." : "Registered successfully.");
    } catch (error) {
      setMessage("Network error. Please check your backend.");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // ✅ FIX ADDED
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Logout failed.");
        setLoading(false);
        return;
      }

      localStorage.removeItem("token");
      setUser(null);
      setForm({ name: "", email: "", password: "" });
      setMessage("Logged out successfully.");
    } catch (error) {
      setMessage("Network error during logout.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl shadow-sm p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <img src="/logo.png" alt="Logo" className="w-24 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-black text-center">
              {user ? `Welcome back, ${user.name}` : mode === "login" ? "Sign in" : "Create account"}
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                mode === "login" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                mode === "register" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {message ? <div className="mb-4 text-sm text-red-600">{message}</div> : null}

        {user ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              Signed in as <span className="font-semibold">{user.email}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="w-full rounded-full bg-yellow-400 px-4 py-3 text-black font-semibold hover:bg-yellow-500 disabled:opacity-60"
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-blue-600 mt-2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-yellow-400 px-4 py-3 text-black font-semibold hover:bg-yellow-500 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Continue" : "Create account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}