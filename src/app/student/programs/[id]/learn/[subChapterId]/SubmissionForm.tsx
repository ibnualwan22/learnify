"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SubmissionForm({ 
  subChapterId, 
  initialAnswer, 
  isLocked 
}: { 
  subChapterId: string; 
  initialAnswer?: string; 
  isLocked: boolean; 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(initialAnswer || "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isLocked) return;

    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/student/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subChapterId, studentAnswer: answer }),
      });

      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        alert("Gagal mengirimkan tugas. Coba lagi.");
      }
    } catch {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Jawaban Anda:</label>
        <textarea
          required
          rows={6}
          disabled={isLocked}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={isLocked ? "" : "Tuliskan jawaban atau refleksi Anda di sini..."}
          className={`w-full px-4 py-3 rounded-2xl border outline-none transition-all ${
            isLocked 
              ? "bg-slate-100 border-slate-200 text-slate-600 resize-none cursor-not-allowed" 
              : "bg-white border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 text-slate-900"
          }`}
        />
      </div>
      
      {!isLocked && (
        <div className="flex items-center gap-4">
           <button 
             type="submit" 
             disabled={loading || answer.trim() === ""}
             className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100"
           >
             {loading ? "Mengirim..." : initialAnswer ? "Perbarui Jawaban" : "Kirim Jawaban"}
           </button>
           {saved && <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Berhasil tersimpan!</span>}
        </div>
      )}
    </form>
  );
}
