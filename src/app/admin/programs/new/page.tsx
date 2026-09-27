"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationInDays: "",
    imageUrl: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if(res.ok && data.url) {
         setFormData(prev => ({...prev, imageUrl: data.url}));
      } else {
         alert("Gagal mengunggah gambar. Pastikan CLOUDINARY terhubung.");
      }
    } catch(e) {
      alert("Terjadi kesalahan teknis saat unggah.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          durationInDays: Number(formData.durationInDays),
          isActive: true
        }),
      });

      if (res.ok) {
        router.push("/admin/programs");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Gagal: ${errorData.message}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/programs" className="text-sm font-medium text-slate-500 hover:text-brand-600 mb-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tambah Program Baru</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nama Program</label>
            <input 
              required type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
            <textarea 
              required rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
              <input 
                required type="number" min="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Durasi Akses (Hari)</label>
              <input 
                required type="number" min="1"
                className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 outline-none transition-all"
                value={formData.durationInDays} onChange={e => setFormData({...formData, durationInDays: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5 border-b border-slate-200 pb-8">
            <label className="text-sm font-semibold text-slate-700">Gambar Banner Program</label>
            <div className="flex items-center gap-4 mt-1">
              <input 
                type="file" accept="image/*"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border border-slate-200 file:text-sm file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-50 transition-all cursor-pointer bg-slate-50 border border-slate-200 rounded-xl"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-brand-600 font-medium">Mengunggah...</span>}
            </div>
            {formData.imageUrl && (
              <div className="mt-4 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={formData.imageUrl} alt="Banner Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
             <button
               type="submit" disabled={loading}
               className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
             >
               {loading ? "Menyimpan..." : "Simpan Program"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
