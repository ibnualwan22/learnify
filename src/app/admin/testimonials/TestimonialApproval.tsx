"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestimonialApproval({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleApproval = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      if (res.ok) router.refresh();
      else alert("Gagal memperbarui status");
    } catch {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Hapus testimoni ini secara permanen?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={toggleApproval} disabled={loading}
        className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
          isApproved 
           ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
           : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {isApproved ? "Sembunyikan" : "Setujui (Publikasi)"}
      </button>
      <button 
        onClick={handleDelete} disabled={loading}
        className="px-3 py-1.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded text-xs font-medium transition-colors"
      >
        Hapus
      </button>
    </div>
  );
}
