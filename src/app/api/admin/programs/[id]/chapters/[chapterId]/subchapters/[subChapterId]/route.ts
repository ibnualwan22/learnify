import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, chapterId: string, subChapterId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const body = await req.json();
    const subChapter = await prisma.subChapter.update({
      where: { id: (await params).subChapterId },
      data: {
        title: body.title,
        youtubeVideoId: body.youtubeVideoId,
        essayQuestion: body.essayQuestion,
        order: Number(body.order),
      },
    });
    return NextResponse.json(subChapter);
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, chapterId: string, subChapterId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    await prisma.subChapter.delete({ where: { id: (await params).subChapterId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
