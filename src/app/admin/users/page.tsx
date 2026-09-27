import { prisma } from "@/lib/prisma";
import EnrollmentManager from "./EnrollmentManager";
import { Mail, Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: {
          program: true,
        }
      }
    }
  });

  const programs = await prisma.program.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500 mt-1">Kelola data siswa dan akses program kursus mereka.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Nama & Kontak</th>
                <th className="px-6 py-4">Akses Program Aktif</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Belum ada siswa yang mendaftar.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500 flex flex-col gap-1 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
                        <span className="flex items-center gap-1"><Smartphone className="w-3 h-3"/> {user.whatsapp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.enrollments.length === 0 ? (
                        <span className="text-slate-400 italic">Belum ada</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.enrollments.map((enr) => {
                            const isExpired = new Date() > new Date(enr.expiresAt);
                            return (
                              <div key={enr.id} className={`text-xs px-2 py-1 border rounded bg-white ${isExpired ? "text-slate-400 border-slate-200" : "text-brand-700 border-brand-200"}`}>
                                {enr.program.name} {isExpired && "(Expired)"}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <EnrollmentManager 
                         userId={user.id} 
                         userName={user.name}
                         userEnrollments={user.enrollments} 
                         availablePrograms={programs} 
                       />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
