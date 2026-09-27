import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string, chapterId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const { title, youtubeVideoId, essayQuestion, order } = await req.json();

    if (!title || !youtubeVideoId) {
      return NextResponse.json({ message: "Data utama tidak lengkap" }, { status: 400 });
    }

    const subChapter = await prisma.subChapter.create({
      data: {
        title,
        youtubeVideoId,
        essayQuestion,
        order: Number(order) || 0,
        chapterId: (await params).chapterId,
      }
    });

    return NextResponse.json(subChapter, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Gagal menyimpan Sub-Bab" }, { status: 500 });
  }
}
