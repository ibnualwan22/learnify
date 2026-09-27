import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const body = await req.json();

    // Upsert each key in the body dictionary 
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
