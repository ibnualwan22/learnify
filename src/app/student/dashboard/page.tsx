import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Hand, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      program: true
    },
    orderBy: { createdAt: "desc" }
  });

  const activePrograms = enrollments.filter(enr => new Date(enr.expiresAt) > new Date());
  const expiredPrograms = enrollments.filter(enr => new Date(enr.expiresAt) <= new Date());

  return (
    <div className="max-w-5xl mx-auto">
       <div className="mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-900 tracking-tight">Selamat Belajar, {session.user.name} <Hand className="w-8 h-8 text-amber-400" /></h1>
          <p className="text-slate-500 mt-2">Mari lanjutkan proses belajar Anda dan kembangkan keahlian baru.</p>
       </div>

       <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
             Kelas Aktif Anda
          </h2>
          {activePrograms.length === 0 ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <GraduationCap className="w-16 h-16 mb-4 text-brand-300" />
                <h3 className="text-lg font-bold text-slate-800">Anda belum mendaftar di kelas manapun</h3>
                <p className="text-slate-500 mt-1 max-w-sm mb-6">Pilih dan daftarkan diri Anda pada program kelas yang kami sediakan untuk mulai belajar.</p>
                <Link href="/#programs" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                   Jelajahi Program
                </Link>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePrograms.map(enr => (
                   <div key={enr.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-brand-200 transition-all flex flex-col group">
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">{enr.program.name}</h3>
                         </div>
                         <div className="text-sm font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-1.5 inline-block mb-6">
                            Aktif s/d {new Date(enr.expiresAt).toLocaleDateString("id-ID")}
                         </div>
                      </div>
                      <Link href={`/student/programs/${enr.programId}`} className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 group-hover:bg-brand-600 group-hover:shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-all font-medium rounded-xl text-center">
                         Lanjut Belajar
                      </Link>
                   </div>
                ))}
             </div>
          )}
       </div>

       {expiredPrograms.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
               <span className="w-2 h-6 bg-slate-200 rounded-full"></span>
               Riwayat Kelas (Kedaluwarsa)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-75">
                {expiredPrograms.map(enr => (
                   <div key={enr.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 filter grayscale-[50%]">
                      <h3 className="text-md font-bold text-slate-700 line-clamp-1">{enr.program.name}</h3>
                      <p className="text-xs text-slate-500 mt-2">Selesai pada: {new Date(enr.expiresAt).toLocaleDateString("id-ID")}</p>
                   </div>
                ))}
            </div>
          </div>
       )}
    </div>
  );
}
