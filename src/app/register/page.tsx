"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Kata sandi tidak cocok. Silakan periksa kembali.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat mendaftar");
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/student/dashboard";
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Dynamic sophisticated glowing orb in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-200/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassmorphism Card (Wider for 2-column or more fields if needed, but 1 col is fine too) */}
      <div className="relative w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(100,149,237,0.15)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-slate-800">
            Daftar Akun Baru
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Bergabung ke platform kursus dan mulai belajar!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50/50 rounded-xl border border-red-100 backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ibnu Alwan"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 pl-1">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="081227225453"
                className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 pl-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alwangaming@gmail.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">Kata Sandi</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">Ulangi Kata Sandi</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-slate-200/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-2xl font-medium shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? "Mendaftar..." : "Buat Akun"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
