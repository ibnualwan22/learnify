"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: initialData.siteName || "Learnify",
    heroText: initialData.heroText || "Investasi Terbaik Anda Adalah Pendidikan.",
    contactWhatsapp: initialData.contactWhatsapp || "081234567890",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData),
      });

      if (res.ok) {
         alert("Pengaturan disimpan!");
         router.refresh();
      } else {
         alert("Gagal menyimpan");
      }
    } catch {
       alert("Error teknis");
    } finally {
       setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div className="space-y-1.5 border-b border-slate-100 pb-6">
         <label className="text-sm font-semibold text-slate-700">Nama Situs (Site Name)</label>
         <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} />
       </div>

       <div className="space-y-1.5 border-b border-slate-100 pb-6">
         <label className="text-sm font-semibold text-slate-700">Judul Banner Depan (Hero Text)</label>
         <textarea rows={2} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={formData.heroText} onChange={e => setFormData({...formData, heroText: e.target.value})} />
       </div>

       <div className="space-y-1.5 border-b border-slate-100 pb-6">
         <label className="text-sm font-semibold text-slate-700">No. WhatsApp Admin (Hubungi Kami)</label>
         <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={formData.contactWhatsapp} onChange={e => setFormData({...formData, contactWhatsapp: e.target.value})} />
       </div>

       <div className="pt-2 flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50">
             {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
       </div>
    </form>
  );
}
