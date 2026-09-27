import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { name, description, price, durationInDays, imageUrl, isActive } = await req.json();

    if (!name || !description || price === undefined || durationInDays === undefined) {
      return NextResponse.json({ message: "Isian tidak lengkap" }, { status: 400 });
    }

    const program = await prisma.program.create({
      data: {
        name,
        description,
        price,
        durationInDays,
        imageUrl,
        isActive,
      }
    });

    return NextResponse.json({ message: "Program berhasil dibuat", program }, { status: 201 });
  } catch (err: any) {
    console.error("API Create Program Error:", err);
    return NextResponse.json({ message: "Gagal menyimpan program ke database" }, { status: 500 });
  }
}
