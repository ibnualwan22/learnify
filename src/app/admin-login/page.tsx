"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
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
      router.push("/admin/programs");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-brand-500/30">
            A
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-sm">
            Gunakan kredensial otoritas Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 pl-1">
              Email
            </label>
            <input
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all duration-300 text-white placeholder:text-slate-600"
              placeholder="admin@admin.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 pl-1">
              Password
            </label>
            <input
              type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all duration-300 text-white placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 px-4 mt-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Otentikasi..." : "Masuk ke Panel"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
