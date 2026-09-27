import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, chapterId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const body = await req.json();
    const chapter = await prisma.chapter.update({
      where: { id: (await params).chapterId },
      data: { title: body.title, order: Number(body.order) },
    });
    return NextResponse.json(chapter);
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, chapterId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    await prisma.chapter.delete({ where: { id: (await params).chapterId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
