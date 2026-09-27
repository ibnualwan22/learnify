import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Kita mengambil data asli dari database

export default async function LandingPage() {
  // Ambil program aktif dari DB (maks 6 tampil di depan)
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // Ambil testimoni yang diapprove admin
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      {/* Dynamic sophisticated glowing ord in background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-200/30 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-300/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* NAVBAR */}
      <nav className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl leading-none">
             L
           </div>
           <span className="text-xl font-bold tracking-tight text-slate-800">Learnify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
            Masuk
          </Link>
          <Link href="/register" className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm shadow-brand-500/30">
            Daftar
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-grow">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-5xl px-6 pt-24 pb-32 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Investasi Terbaik Anda Adalah <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-400">Pendidikan.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed font-light">
            Platform microlearning privat dengan materi yang terstruktur dan dimentori langsung oleh ahlinya. 
            Mulai pelajari keahlian baru secara terarah hanya dalam genggaman Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              Mulai Belajar
            </Link>
            <Link href="#programs" className="px-8 py-4 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/60 hover:bg-white text-slate-700 font-semibold transition-all">
              Jelajahi Program
            </Link>
          </div>
        </section>

        {/* PROGRAMS SECTION */}
        <section id="programs" className="mx-auto max-w-7xl px-6 py-24 border-t border-slate-200/50 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Program Pembelajaran</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Pilih paket program eksklusif yang dirancang untuk kesuksesan Anda.</p>
          </div>

          {programs.length === 0 ? (
            <div className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60">
              <p className="text-slate-500">Belum ada program kelas yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((prog) => (
                <div key={prog.id} className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white border border-slate-100 flex flex-col hover:shadow-xl transition-all h-full group">
                  
                  {/* IMAGE SECTION */}
                  <div className="relative h-64 w-full shrink-0">
                    <img 
                       src={prog.imageUrl || "https://placehold.co/600x400/png?text=Program"} 
                       alt={prog.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Floating Teal Badge */}
                    <div className="absolute top-0 right-0 bg-[#25cba3] text-white font-bold px-5 py-2.5 rounded-bl-3xl shadow-sm z-10 w-fit max-w-[80%] line-clamp-1 leading-snug">
                      {prog.name}
                    </div>

                    {/* Floating Green Price box */}
                    <div className="absolute bottom-0 left-0 bg-[#49d156] text-white px-4 py-2.5 flex flex-wrap items-end gap-2.5 z-10">
                       <span className="line-through text-white/70 text-sm font-semibold tracking-wide">
                         Rp{(prog.price + 300000).toLocaleString("id-ID")}
                       </span>
                       <span className="font-extrabold text-xl leading-none">
                         Rp{prog.price.toLocaleString("id-ID")}
                       </span>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-extrabold text-slate-900 leading-snug mb-3">
                      {prog.name}
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed flex-grow text-sm md:text-base">
                      {prog.description}
                    </p>

                    <Link href={`/checkout/${prog.id}`} className="block w-full text-center py-4 rounded-xl bg-transparent border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors">
                      Pilih Program
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-24 relative mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Apa Kata Mereka</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Pengalaman asli dari para murid kami.</p>
          </div>

           {testimonials.length === 0 ? (
            <div className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60">
              <p className="text-slate-500">Belum ada testimoni saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {testimonials.map((testi) => (
                <div key={testi.id} className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                   <div className="flex gap-1 mb-4 text-brand-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < testi.rating ? "fill-brand-400" : "fill-slate-200"} stroke-none`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                      ))}
                   </div>
                   <p className="text-slate-700 italic text-lg leading-relaxed mb-6">"{testi.content}"</p>
                   <div className="font-semibold text-slate-900">— {testi.studentName}</div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md relative z-10 py-10 px-6 mt-auto text-center text-sm text-slate-500">
         <p>© {new Date().getFullYear()} Learnify Microlearning. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
