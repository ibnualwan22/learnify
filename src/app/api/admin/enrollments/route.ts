import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const { userId, programId } = await req.json();

    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ message: "Program tidak ditemukan" }, { status: 404 });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + program.durationInDays);

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        programId,
        expiresAt,
      }
    });

    return NextResponse.json({ message: "Akses diberikan", enrollment }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
       return NextResponse.json({ message: "Siswa sudah terdaftar di program ini" }, { status: 400 });
    }
    return NextResponse.json({ message: "Gagal memberikan akses" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID parameter missing" }, { status: 400 });

    await prisma.enrollment.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
