import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Firebase Storage entegrasyonu için admin SDK gerekir.
    // Şimdilik base64 data URL döndürüyoruz (demo).
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const url = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
