"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BarChart2, BookOpen, Users, FileText, Star, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: <BarChart2 className="w-5 h-5" /> },
  { name: "Programs", href: "/admin/programs", icon: <BookOpen className="w-5 h-5" /> },
  { name: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { name: "Grading", href: "/admin/grading", icon: <FileText className="w-5 h-5" /> },
  { name: "Testimonials", href: "/admin/testimonials", icon: <Star className="w-5 h-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-10 transition-transform md:translate-x-0 -translate-x-full">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link href="/admin" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-lg leading-none">L</div>
            <span className="tracking-tight text-brand-900">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-100"
                    : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors"
          >
             Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex items-center px-6 md:justify-end justify-between">
            <div className="md:hidden text-lg font-bold text-brand-700">Admin Panel</div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">Admin Area</span>
            </div>
        </header>
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
