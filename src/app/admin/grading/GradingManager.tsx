"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GradingManager({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNotes.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes, status: "REVIEWED" }),
      });

      if (res.ok) {
        router.refresh(); // This submission will disappear from the pending list
      } else {
        alert("Gagal menyimpan penilaian");
      }
    } catch {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white border border-slate-200 p-5 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
       <label className="text-sm font-semibold text-slate-700 block mb-2">Catatan / Nilai Anda</label>
       <textarea 
         required rows={5}
         placeholder="Berikan feedback, koreksi, atau skor di sini..."
         className="w-full flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm resize-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 transition-all mb-4"
         value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
       />
       <button 
         type="submit" disabled={loading}
         className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 text-sm shadow-sm"
       >
         {loading ? "Menyimpan..." : "Kirim Feedback & Selesai"}
       </button>
    </form>
  );
}
