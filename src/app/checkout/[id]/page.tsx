import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect(`/register?redirect=/checkout/${id}`);
  }

  const program = await prisma.program.findUnique({
    where: { id }
  });

  if (!program) {
    redirect("/#programs");
  }

  // Check if they already have active enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_programId: { userId: session.user.id, programId: program.id } }
  });

  if (enrollment && new Date(enrollment.expiresAt) > new Date()) {
    redirect(`/student/programs/${program.id}`);
  }

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  const adminWa = "6285609431970";
  const waText = encodeURIComponent(`Halo admin, saya ${session.user.name} (Email: ${session.user.email}). Saya ingin mengkonfirmasi pembayaran untuk Program [${program.name}] sebesar ${formatRupiah(program.price)}. Ini bukti transfer saya: `);
  const waLink = `https://wa.me/${adminWa}?text=${waText}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
         <div className="bg-brand-600 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Instruksi Pembayaran</h1>
            <p className="text-brand-100">Selesaikan pembayaran untuk mulai belajar</p>
         </div>
         
         <div className="p-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
               <div className="text-sm text-slate-500 font-medium mb-1">Paket Kelas:</div>
               <div className="text-lg font-bold text-slate-900 mb-4">{program.name}</div>
               
               <div className="text-sm text-slate-500 font-medium mb-1">Total Dibayar:</div>
               <div className="text-3xl font-bold text-brand-600 mb-2">{formatRupiah(program.price)}</div>
               <div className="text-xs text-slate-400 bg-white inline-block px-2 py-1 rounded border border-slate-200">
                 Akses selama {program.durationInDays} Hari
               </div>
            </div>

            <div className="mb-8">
               <h3 className="text-md font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <CreditCard className="w-6 h-6 text-slate-700" /> Transfer ke Rekening Berikut:
               </h3>
               <div className="bg-white border-2 border-slate-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Bank BRI</div>
                  <div className="text-2xl font-mono text-slate-900 font-bold mb-1 tracking-widest">1234 5678 9012</div>
                  <div className="text-sm text-slate-600 font-medium">a.n. Dummy Admin</div>
               </div>
            </div>

            <div className="text-center text-sm text-slate-600 bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
               Setelah Anda men-transfer sejumlah nominal di atas, harap <b>foto/screenshot bukti transfer</b> dan kirimkan konfirmasi melalui WhatsApp Admin di bawah ini.
            </div>

            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl text-center shadow-lg transition-transform hover:-translate-y-1"
            >
              Kirim Konfirmasi Via WhatsApp
            </a>

            <div className="mt-6 text-center">
              <Link href="/#programs" className="text-sm text-slate-500 font-medium hover:text-slate-800">
                Batal & Kembali ke Halaman Utama
              </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
