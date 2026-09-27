import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const configs = await prisma.siteConfig.findMany();
  
  // Ubah ke object dictionary / record
  const configMap = configs.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-4xl">
       <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Platform</h1>
        <p className="text-slate-500 mt-1">Konfigurasi variabel dinamis dari situs Anda.</p>
      </div>
      
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm">
         <SettingsForm initialData={configMap} />
      </div>
    </div>
  );
}
