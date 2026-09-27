"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
               <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                     <Link href="/student/dashboard" className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-lg leading-none">L</div>
                        <span className="tracking-tight text-brand-900">Student Area</span>
                     </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                     <Link href="/student/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === "/student/dashboard" ? "border-brand-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                        Dashboard Utama
                     </Link>
                     <Link href="/student/programs" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname?.startsWith("/student/programs") ? "border-brand-500 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                        Kelas Saya
                     </Link>
                  </div>
               </div>
               <div className="flexItems items-center pt-3 gap-4">
                  <span className="text-sm text-slate-500 hidden sm:inline-block">Halo, Siswa</span>
                  <button 
                     onClick={() => signOut({ callbackUrl: "/login" })}
                     className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                     Keluar
                  </button>
               </div>
            </div>
         </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
         {children}
      </main>
    </div>
  );
}
