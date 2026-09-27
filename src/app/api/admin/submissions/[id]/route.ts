import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const { adminNotes, status } = await req.json();

    const submission = await prisma.submission.update({
      where: { id: (await params).id },
      data: {
        adminNotes,
        status, // usually "REVIEWED"
      }
    });

    return NextResponse.json({ message: "Penilaian disimpan", submission }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menyimpan penilaian" }, { status: 500 });
  }
}
