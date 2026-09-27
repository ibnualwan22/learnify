import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { title, order } = await req.json();

    if (!title) {
      return NextResponse.json({ message: "Judul Bab wajib diisi" }, { status: 400 });
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        order: Number(order) || 0,
        programId: (await params).id,
      }
    });

    return NextResponse.json({ message: "Bab ditambahkan", chapter }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Gagal menyimpan Bab" }, { status: 500 });
  }
}
