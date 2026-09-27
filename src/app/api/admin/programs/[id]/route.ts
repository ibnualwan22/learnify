import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const id = (await params).id;
    const body = await req.json();

    const program = await prisma.program.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ message: "Program diperbarui", program }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal memperbarui" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const id = (await params).id;
    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Program dihapus" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menghapus" }, { status: 500 });
  }
}
