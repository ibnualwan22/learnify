import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { subChapterId, studentAnswer } = await req.json();

    if (!subChapterId || !studentAnswer) {
      return NextResponse.json({ message: "Isian tidak lengkap" }, { status: 400 });
    }

    // Check if the student actually has enrollment for the program involving this chapter
    const subChapter = await prisma.subChapter.findUnique({
      where: { id: subChapterId },
      include: { chapter: true }
    });

    if (!subChapter) {
      return NextResponse.json({ message: "Materi tak ditemukan" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_programId: { userId: session.user.id, programId: subChapter.chapter.programId } }
    });

    if (!enrollment || new Date(enrollment.expiresAt) < new Date()) {
      return NextResponse.json({ message: "Akses program kadaluarsa" }, { status: 403 });
    }

    // Upsert submission
    // First, try finding an existing one to avoid duplicates if possible, or just create it since id isn't explicitly tied (but logically 1 subchap/user)
    const existing = await prisma.submission.findFirst({
       where: { studentId: session.user.id, subChapterId }
    });

    if (existing) {
       if (existing.status === "REVIEWED") {
         return NextResponse.json({ message: "Sudah direview, tidak bisa diubah" }, { status: 403 });
       }
       const up = await prisma.submission.update({
          where: { id: existing.id },
          data: { studentAnswer }
       });
       return NextResponse.json({ message: "Tersimpan", submission: up }, { status: 200 });
    } else {
       const create = await prisma.submission.create({
          data: {
            studentAnswer,
            status: "PENDING", // Wait for Admin to review
            studentId: session.user.id,
            subChapterId
          }
       });
       return NextResponse.json({ message: "Tersimpan", submission: create }, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Gagal menyimpan pengumpulan" }, { status: 500 });
  }
}
