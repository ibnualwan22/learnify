"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Program } from "@prisma/client";

export default function EditProgramForm({ program }: { program: Program }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: program.name,
    description: program.description,
    price: program.price.toString(),
    durationInDays: program.durationInDays.toString(),
    imageUrl: program.imageUrl || "",
    isActive: program.isActive,
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
      const res = await fetch(`/api/admin/programs/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          durationInDays: Number(formData.durationInDays),
        }),
      });

      if (res.ok) {
        router.push("/admin/programs");
        router.refresh();
      } else {
        alert("Gagal memperbarui program");
      }
    } catch (err) {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus program ini secara permanen beserta semua bab di dalamnya?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/programs/${program.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/programs");
        router.refresh();
      } else {
        alert("Gagal menghapus program");
      }
    } catch (err) {
      alert("Kesalahan teknis");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
         <span className="text-sm font-medium text-slate-700">Status Program</span>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
           <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
         </label>
      </div>

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

      <div className="pt-2 flex flex-col-reverse sm:flex-row justify-between gap-4 w-full">
         <button
           type="button" onClick={handleDelete} disabled={deleting}
           className="px-6 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors disabled:opacity-50"
         >
           {deleting ? "Menghapus..." : "Hapus Program"}
         </button>
         <button
           type="submit" disabled={loading}
           className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
         >
           {loading ? "Menyimpan..." : "Simpan Perubahan"}
         </button>
      </div>
    </form>
  );
}
