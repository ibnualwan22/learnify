import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChapterManager from "./ChapterManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgramChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const program = await prisma.program.findUnique({
    where: { id: (await params).id },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          subChapters: {
            orderBy: { order: "asc" },
          }
        }
      }
    }
  });

  if (!program) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <Link href="/admin/programs" className="text-sm font-medium text-slate-500 hover:text-brand-600 mb-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Silabus: {program.name}</h1>
        <p className="text-slate-500 mt-1">Atur bab materi dan tautan konten video untuk program ini.</p>
      </div>

      <ChapterManager program={program} />
    </div>
  );
}
