import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProtectedVideoPlayer from "@/app/components/ProtectedVideoPlayer";
import SubmissionForm from "./SubmissionForm";
import { ArrowLeft, CheckCircle, Clock, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LearnSubChapterPage({ params }: { params: Promise<{ id: string, subChapterId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Validate enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_programId: { userId: session.user.id, programId: (await params).id } }
  });

  if (!enrollment || new Date(enrollment.expiresAt) < new Date()) {
    redirect("/student/dashboard");
  }

  const subChapter = await prisma.subChapter.findUnique({
    where: { id: (await params).subChapterId },
    include: {
      chapter: {
        include: {
          program: true,
        }
      },
      submissions: {
        where: { studentId: session.user.id },
        take: 1
      }
    }
  });

  if (!subChapter || subChapter.chapter.programId !== (await params).id) {
    notFound();
  }

  const submission = subChapter.submissions[0];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link href={`/student/programs/${(await params).id}`} className="text-sm font-medium text-slate-500 flex items-center gap-1 hover:text-brand-600 mb-2 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Silabus
        </Link>
        <div className="text-xs font-semibold tracking-wider text-brand-600 uppercase mb-1">
          {subChapter.chapter.program.name} / {subChapter.chapter.title}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{subChapter.title}</h1>
      </div>

      <div className="mb-10">
         <ProtectedVideoPlayer videoId={subChapter.youtubeVideoId} />
      </div>

      {subChapter.essayQuestion && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
             <FileText className="w-6 h-6 text-brand-600" /> Penugasan & Kuis Teks
           </h2>
           <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-6">
              <h3 className="text-xs font-bold tracking-wider text-slate-500 mb-2">PERTANYAAN:</h3>
              <p className="text-slate-800 font-medium leading-relaxed">
                {subChapter.essayQuestion}
              </p>
           </div>

           {(!submission || submission.status === "PENDING" || submission.status === "REVIEWED") ? (
             <div className="space-y-6">
               <SubmissionForm 
                 subChapterId={subChapter.id} 
                 initialAnswer={submission?.studentAnswer} 
                 isLocked={submission?.status === "REVIEWED"} 
               />

               {submission?.status === "REVIEWED" && submission.adminNotes && (
                 <div className="mt-8 bg-brand-50 border border-brand-200 rounded-2xl p-6">
                   <h3 className="text-sm font-bold text-brand-800 mb-2 flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-emerald-600" /> Ulasan Pengajar (Admin):
                   </h3>
                   <p className="text-brand-900 whitespace-pre-wrap text-sm leading-relaxed">
                     {submission.adminNotes}
                   </p>
                 </div>
               )}
               {submission?.status === "PENDING" && (
                 <div className="mt-4 text-amber-600 bg-amber-50 px-4 py-3 border border-amber-200 rounded-xl text-sm font-medium flex items-center gap-2">
                   <Clock className="w-5 h-5 text-amber-500" /> Sedang menunggu ulasan dari pengajar. Anda bisa memperbarui jawaban Anda jika perlu.
                 </div>
               )}
             </div>
           ) : null}
        </div>
      )}
    </div>
  );
}
