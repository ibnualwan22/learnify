import { prisma } from "@/lib/prisma";
import TestimonialApproval from "./TestimonialApproval";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Testimoni</h1>
        <p className="text-slate-500 mt-1">Review dan pilih testimoni mana yang akan ditampilkan di Halaman Utama (Landing Page).</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Ulasan</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada testimoni dari siswa.
                  </td>
                </tr>
              ) : (
                testimonials.map((testi) => (
                  <tr key={testi.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{testi.studentName}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{testi.content}</td>
                    <td className="px-6 py-4 text-brand-500 font-bold">{testi.rating} / 5</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        testi.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {testi.isApproved ? "Dipublikasi" : "Menunggu"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <TestimonialApproval id={testi.id} isApproved={testi.isApproved} />
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
