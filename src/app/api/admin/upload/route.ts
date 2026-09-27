import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import stream from "stream";

// API to handle Cloudinary upload from server securely
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "learnify-programs", resource_type: "auto" },
        (error, result) => {
          if (error) {
             console.error("Cloudinary Error:", error);
             reject(NextResponse.json({ message: "Cloudinary failed" }, { status: 500 }));
          } else {
             resolve(NextResponse.json({ url: result!.secure_url }, { status: 200 }));
          }
        }
      );

      const readStream = new stream.PassThrough();
      readStream.end(buffer);
      readStream.pipe(uploadStream);
    });
  } catch (err) {
    return NextResponse.json({ message: "Upload stream exception" }, { status: 500 });
  }
}
