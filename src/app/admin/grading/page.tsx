import { prisma } from "@/lib/prisma";
import GradingManager from "./GradingManager";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGradingPage() {
  const submissions = await prisma.submission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      student: { select: { name: true, email: true } },
      subChapter: { 
        select: { 
          title: true, 
          essayQuestion: true,
          chapter: { select: { title: true, program: { select: { name: true } } } } 
        } 
      }
    }
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Penilaian Tugas</h1>
        <p className="text-slate-500 mt-1">Review dan berikan feedback pada jawaban essay siswa yang menunggu.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-700 font-medium text-lg">Semua tugas telah ternilai!</p>
            <p className="text-sm">Tidak ada tugas yang menunggu review saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {submissions.map(sub => (
              <div key={sub.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                   <div className="flex-1 space-y-4">
                      <div>
                        <div className="text-xs font-semibold tracking-wider text-brand-600 uppercase mb-1">
                          {sub.subChapter.chapter.program.name} — {sub.subChapter.chapter.title}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{sub.subChapter.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Siswa: <span className="font-medium text-slate-800">{sub.student.name}</span></p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                         <div className="text-xs font-semibold text-slate-500 mb-2">PERTANYAAN:</div>
                         <div className="text-sm font-medium text-slate-800">{sub.subChapter.essayQuestion}</div>
                      </div>

                      <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl">
                         <div className="text-xs font-semibold text-brand-600 mb-2">JAWABAN SISWA:</div>
                         <div className="text-sm text-slate-800 whitespace-pre-wrap">{sub.studentAnswer}</div>
                      </div>
                   </div>

                   <div className="w-full md:w-1/3">
                      <GradingManager submissionId={sub.id} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
