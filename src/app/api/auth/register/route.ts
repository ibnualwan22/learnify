import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, whatsapp, email, password } = await req.json();

    if (!name || !whatsapp || !email || !password) {
      return NextResponse.json(
        { message: "Semua data wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        whatsapp,
        email,
        password: hashedPassword,
        // Role is implicitly defaults to "STUDENT" due to the Prisma schema @default(STUDENT)
      },
    });

    return NextResponse.json(
      { message: "Akun berhasil dibuat", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registrasi Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
