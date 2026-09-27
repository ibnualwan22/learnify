"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";

// Define strict types corresponding to our Prisma schema inclusion
type SubChapter = { id: string; title: string; youtubeVideoId: string; essayQuestion: string | null; order: number; chapterId: string };
type Chapter = { id: string; title: string; order: number; programId: string; subChapters: SubChapter[] };
type ProgramWithChapters = { id: string; name: string; chapters: Chapter[] };

export default function ChapterManager({ program }: { program: ProgramWithChapters }) {
  const router = useRouter();
  
  // States for Modals
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterForm, setChapterForm] = useState({ title: "", order: 0 });

  const [showSubModal, setShowSubModal] = useState(false);
  const [editingSub, setEditingSub] = useState<SubChapter | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [subForm, setSubForm] = useState({ title: "", youtubeVideoId: "", essayQuestion: "", order: 0 });

  const [loading, setLoading] = useState(false);

  // --- CHAPTER ACTIONS ---
  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = !!editingChapter;
    const url = isEdit 
       ? `/api/admin/programs/${program.id}/chapters/${editingChapter.id}`
       : `/api/admin/programs/${program.id}/chapters`;

    try {
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chapterForm),
      });
      setShowChapterModal(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Hapus seluruh bab beserta isinya?")) return;
    await fetch(`/api/admin/programs/${program.id}/chapters/${chapterId}`, { method: "DELETE" });
    router.refresh();
  };

  // --- SUBCHAPTER ACTIONS ---
  const handleSaveSubChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = !!editingSub;
    const chapId = editingSub ? editingSub.chapterId : activeChapterId;
    
    if (!chapId) return;

    const url = isEdit 
       ? `/api/admin/programs/${program.id}/chapters/${chapId}/subchapters/${editingSub.id}`
       : `/api/admin/programs/${program.id}/chapters/${chapId}/subchapters`;

    try {
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subForm),
      });
      setShowSubModal(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubChapter = async (chapId: string, subId: string) => {
    if (!confirm("Hapus materi ini?")) return;
    await fetch(`/api/admin/programs/${program.id}/chapters/${chapId}/subchapters/${subId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => { setEditingChapter(null); setChapterForm({ title: "", order: program.chapters.length + 1 }); setShowChapterModal(true); }}
        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm"
      >
        + Tambah Bab (Chapter)
      </button>

      <div className="space-y-4">
        {program.chapters.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            Belum ada silabus / bab.
          </div>
        )}
        
        {program.chapters.map((chap) => (
          <div key={chap.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Chapter Header */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-slate-400 font-normal">Bab {chap.order}</span>
                  {chap.title}
                </h3>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => { setActiveChapterId(chap.id); setEditingSub(null); setSubForm({ title: "", youtubeVideoId: "", essayQuestion: "", order: chap.subChapters.length + 1 }); setShowSubModal(true); }} className="text-sm px-3 py-1.5 bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 rounded-lg font-medium transition-colors">
                   + Sub-Bab
                 </button>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingChapter(chap); setChapterForm({ title: chap.title, order: chap.order }); setShowChapterModal(true); }} className="p-1.5 text-slate-500 hover:text-slate-900">Edit</button>
                    <button onClick={() => handleDeleteChapter(chap.id)} className="p-1.5 text-red-400 hover:text-red-600">Hapus</button>
                 </div>
              </div>
            </div>

            {/* SubChapters List */}
            <div className="p-4 bg-white space-y-2">
              {chap.subChapters.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">Belum ada materi/sub-bab.</div>
              ) : (
                chap.subChapters.map((sub, idx) => (
                  <div key={sub.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                       <div>
                         <h4 className="font-medium text-slate-800 text-sm">{sub.title}</h4>
                         <a href={`https://youtube.com/watch?v=${sub.youtubeVideoId}`} target="_blank" className="text-xs text-brand-500 hover:underline flex items-center mt-1">
                           <Video className="w-3.5 h-3.5 mr-1" /> {sub.youtubeVideoId}
                         </a>
                       </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingSub(sub); setSubForm({ title: sub.title, youtubeVideoId: sub.youtubeVideoId, essayQuestion: sub.essayQuestion || "", order: sub.order }); setShowSubModal(true); }} className="text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 bg-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleDeleteSubChapter(chap.id, sub.id)} className="text-xs font-medium text-red-500 hover:text-red-700 border border-slate-200 bg-white px-2 py-1 rounded">Hapus</button>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <form onSubmit={handleSaveChapter} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <h2 className="text-xl font-bold mb-6">{editingChapter ? "Edit Bab" : "Tambah Bab"}</h2>
              <div className="space-y-4">
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1.5">Judul Bab</label>
                   <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1.5">Urutan (Angka)</label>
                   <input required type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={chapterForm.order} onChange={e => setChapterForm({...chapterForm, order: Number(e.target.value)})} />
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                 <button type="button" onClick={() => setShowChapterModal(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                 <button type="submit" disabled={loading} className="px-5 py-2.5 font-medium bg-brand-600 text-white rounded-xl disabled:opacity-50">Simpan</button>
              </div>
           </form>
        </div>
      )}

      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <form onSubmit={handleSaveSubChapter} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">{editingSub ? "Edit Sub-Bab (Materi)" : "Tambah Sub-Bab (Materi)"}</h2>
              <div className="space-y-4">
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1.5">Judul Materi</label>
                   <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={subForm.title} onChange={e => setSubForm({...subForm, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-semibold text-slate-700 block mb-1.5">Youtube Video ID</label>
                     <input required type="text" placeholder="ex: dQw4w9WgXcQ" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={subForm.youtubeVideoId} onChange={e => setSubForm({...subForm, youtubeVideoId: e.target.value})} />
                   </div>
                   <div>
                     <label className="text-sm font-semibold text-slate-700 block mb-1.5">Urutan (Angka)</label>
                     <input required type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={subForm.order} onChange={e => setSubForm({...subForm, order: Number(e.target.value)})} />
                   </div>
                 </div>
                 <div>
                   <label className="text-sm font-semibold text-slate-700 block mb-1.5 flex justify-between">
                     Pertanyaan Essay (Tugas) <span className="font-normal text-slate-400">Opsional</span>
                   </label>
                   <textarea rows={4} placeholder="Kosongkan jika materi ini tidak memerlukan ujian kuis essay..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none" value={subForm.essayQuestion} onChange={e => setSubForm({...subForm, essayQuestion: e.target.value})} />
                 </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                 <button type="button" onClick={() => setShowSubModal(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                 <button type="submit" disabled={loading} className="px-5 py-2.5 font-medium bg-brand-600 text-white rounded-xl disabled:opacity-50">Simpan</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
}
