"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/student/dashboard"); // Redirect depending on their role in middleware or a dashboard wrapper
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Dynamic sophisticated glowing orb in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(100,149,237,0.15)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-slate-800">
            Masuk ke Akun
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Selamat datang kembali di platform kami.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50/50 rounded-xl border border-red-100 backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
              placeholder="alwangaming@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-2xl font-medium shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
