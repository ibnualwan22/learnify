"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Program } from "@prisma/client";

type EnrollmentDetail = {
  id: string;
  programId: string;
  expiresAt: Date;
  program: Program;
};

export default function EnrollmentManager({
  userId,
  userName,
  userEnrollments,
  availablePrograms,
}: {
  userId: string;
  userName: string;
  userEnrollments: EnrollmentDetail[];
  availablePrograms: Program[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, programId: selectedProgramId }),
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || "Gagal memberikan akses");
      }
    } catch {
      alert("Kesalahan teknis");
    } finally {
      setLoading(false);
      setSelectedProgramId("");
    }
  };

  const handleRevoke = async (enrollmentId: string) => {
    if (!confirm("Cabut akses program ini?")) return;
    try {
      await fetch(`/api/admin/enrollments?id=${enrollmentId}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("Kesalahan teknis");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100"
      >
        Kelola Akses
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm text-left">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <h2 className="text-xl font-bold mb-1 text-slate-900">Akses Program</h2>
              <p className="text-slate-500 mb-6 text-sm">Siswa: {userName}</p>
              
              <div className="space-y-3 mb-6">
                 {userEnrollments.length === 0 ? (
                   <div className="text-sm text-slate-400 italic text-center py-4 borded border-dashed border-slate-200 rounded-xl">Belum ada akses program</div>
                 ) : (
                   userEnrollments.map(enr => (
                     <div key={enr.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{enr.program.name}</div>
                          <div className="text-xs text-slate-500">Akses s/d: {new Date(enr.expiresAt).toLocaleDateString("id-ID")}</div>
                        </div>
                        <button onClick={() => handleRevoke(enr.id)} className="text-xs text-red-500 hover:text-red-700 bg-white border border-red-100 px-2 py-1 rounded">Cabut</button>
                     </div>
                   ))
                 )}
              </div>

              <form onSubmit={handleEnroll} className="border-t border-slate-100 pt-6">
                 <label className="text-sm font-semibold text-slate-700 block mb-1.5">Beri Akses Baru</label>
                 <div className="flex gap-2">
                   <select 
                     required
                     value={selectedProgramId}
                     onChange={(e) => setSelectedProgramId(e.target.value)}
                     className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm text-slate-700"
                   >
                     <option value="" disabled>Pilih Program...</option>
                     {availablePrograms.filter(p => !userEnrollments.some(e => e.programId === p.id)).map(p => (
                       <option key={p.id} value={p.id}>{p.name}</option>
                     ))}
                   </select>
                   <button type="submit" disabled={loading || !selectedProgramId} className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-xl disabled:opacity-50 transition-colors">
                     Beri
                   </button>
                 </div>
              </form>

              <div className="flex justify-end mt-6">
                 <button onClick={() => setIsOpen(false)} className="px-5 py-2 font-medium text-slate-500 hover:bg-slate-100 rounded-xl text-sm">Tutup</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
