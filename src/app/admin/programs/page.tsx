import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Program Kelas</h1>
          <p className="text-slate-500 mt-1">Kelola semua program kursus di platform Anda.</p>
        </div>
        <Link 
          href="/admin/programs/new" 
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm text-center"
        >
          + Tambah Program
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Program</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Durasi Akses</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada program yang dibuat.
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{program.name}</td>
                    <td className="px-6 py-4">Rp {program.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">{program.durationInDays} Hari</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        program.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {program.isActive ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link href={`/admin/programs/${program.id}/chapters`} className="text-brand-600 hover:text-brand-800 font-medium">Babs</Link>
                      <Link href={`/admin/programs/${program.id}/edit`} className="text-slate-600 hover:text-slate-900 font-medium">Edit</Link>
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
