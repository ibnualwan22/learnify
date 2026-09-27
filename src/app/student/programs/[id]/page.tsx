import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, PlayCircle, Video, FileText, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Validate enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId: session.user.id,
        programId: (await params).id,
      }
    }
  });

  if (!enrollment || new Date(enrollment.expiresAt) < new Date()) {
    redirect("/student/dashboard");
  }

  // Fetch syllabus with chapters and sub-chapters
  const program = await prisma.program.findUnique({
    where: { id: (await params).id },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          subChapters: {
            orderBy: { order: "asc" },
            include: {
              submissions: {
                where: { studentId: session.user.id }
              }
            }
          }
        }
      }
    }
  });

  if (!program) redirect("/student/dashboard");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-brand-600 mb-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{program.name}</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">{program.description}</p>
        <div className="mt-4 inline-flex items-center text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg border border-brand-100">
           Masa aktif kelas: {new Date(enrollment.expiresAt).toLocaleDateString("id-ID")}
        </div>
      </div>

      <div className="space-y-6">
        {program.chapters.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
             Materi kelas sedang dalam tahap penyusunan oleh Admin.
          </div>
        ) : (
          program.chapters.map((chap, index) => (
            <div key={chap.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
               <div className="bg-slate-50 border-b border-slate-200 p-5 md:p-6">
                  <div className="text-xs font-semibold tracking-wider text-brand-600 uppercase mb-1">
                    Bab {chap.order || index + 1}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{chap.title}</h2>
               </div>
               <div className="p-2 md:p-4">
                 {chap.subChapters.length === 0 ? (
                   <p className="text-sm text-slate-400 p-4 text-center">Belum ada sesi di bab ini.</p>
                 ) : (
                   <ul className="space-y-2">
                     {chap.subChapters.map((sub, sIndex) => {
                       const submission = sub.submissions[0];
                       // Status indicators
                       let StatusIcon: React.ElementType = Circle;
                       let statusText = "Mulai Belajar";
                       let statusColor = "text-slate-400";
                       let isRawIcon = false;
                       
                       if (submission) {
                         if (submission.status === "REVIEWED") {
                           StatusIcon = CheckCircle;
                           statusText = "Selesai (Dinilai)";
                           statusColor = "text-emerald-500";
                         } else {
                           StatusIcon = Clock;
                           statusText = "Menunggu Penilaian";
                           statusColor = "text-amber-500";
                         }
                       } else if (!sub.essayQuestion) {
                         StatusIcon = PlayCircle;
                         statusColor = "text-brand-500";
                       } else {
                         isRawIcon = true;
                       }

                       return (
                         <li key={sub.id}>
                           <Link 
                             href={`/student/programs/${program.id}/learn/${sub.id}`}
                             className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                           >
                              <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${statusColor}`}>
                                  {isRawIcon ? (sIndex + 1) : <StatusIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">{sub.title}</h3>
                                  <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Materi Video</span>
                                    {sub.essayQuestion && (
                                       <>
                                         <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                         <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Tugas/Kuis Teks</span>
                                       </>
                                    )}
                                  </div>
                                </div>
                             </div>
                             <div className="hidden sm:block">
                               <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                                  statusColor === "text-emerald-500" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                  statusColor === "text-amber-500" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                  "bg-white text-slate-600 border-slate-200 group-hover:border-brand-300 group-hover:text-brand-600"
                               }`}>
                                 {statusText}
                               </span>
                             </div>
                           </Link>
                         </li>
                       )
                     })}
                   </ul>
                 )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
