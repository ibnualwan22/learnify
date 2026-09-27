import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const programsCount = await prisma.program.count();
  const pendingSubmissionsCount = await prisma.submission.count({ where: { status: "PENDING" } });

  const stats = [
    { name: "Total Siswa", value: usersCount, icon: <Users className="w-6 h-6 text-brand-600" /> },
    { name: "Total Program", value: programsCount, icon: <BookOpen className="w-6 h-6 text-brand-600" /> },
    { name: "Tugas Menunggu", value: pendingSubmissionsCount, icon: <Clock className="w-6 h-6 text-brand-600" /> },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Ikhtisar platform pembelajaran Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Aktivitas Terbaru</h2>
        <div className="text-slate-500 text-sm">
          Aktivitas belum tersedia (Fitur coming soon).
        </div>
      </div>
    </div>
  );
}
