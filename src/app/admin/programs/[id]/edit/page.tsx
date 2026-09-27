import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProgramForm from "./EditProgramForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const program = await prisma.program.findUnique({
    where: { id: (await params).id },
  });

  if (!program) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/programs" className="text-sm font-medium text-slate-500 hover:text-brand-600 mb-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Program</h1>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <EditProgramForm program={program} />
      </div>
    </div>
  );
}
