// app/api/emailPdf/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

import { buildOgUrl } from "@/app/lib/org/buildOgUrl";
import type { PreviewContext } from "@/app/lib/types/campaign";
import type { FormOutput } from "@/app/lib/org/buildOgUrl";
import { sendPdfEmail } from "@/app/lib/sendGrid/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const { email, previewContext, formOutput } = (await req.json()) as {
      email: string;
      previewContext: PreviewContext;
      formOutput: FormOutput;
    };

    if (!email || !previewContext || !formOutput) {
      return NextResponse.json(
        { error: "email, previewContext, and formOutput are required" },
        { status: 400 }
      );
    }

    // 1) Build OG URL (DO NOT change your helper)
    const ogPath = buildOgUrl(formOutput as any, previewContext);

    // 2) Make OG URL absolute (server-side fetch needs it)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const ogUrl = ogPath.startsWith("http") ? ogPath : `${baseUrl}${ogPath}`;

    // 3) Fetch OG image (png)
    const imgRes = await fetch(ogUrl, { cache: "no-store" });
    if (!imgRes.ok) {
      const text = await imgRes.text().catch(() => "");
      console.error("OG fetch failed:", imgRes.status, text);
      return NextResponse.json({ error: "Failed to fetch OG image" }, { status: 500 });
    }

    const pngBytes = await imgRes.arrayBuffer();

    // 4) PNG -> PDF
    const pdfDoc = await PDFDocument.create();
    const png = await pdfDoc.embedPng(pngBytes);

    const { width, height } = png.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(png, { x: 0, y: 0, width, height });

    const pdfBytes = await pdfDoc.save();

    // 5) Email PDF
    await sendPdfEmail(email, Buffer.from(pdfBytes));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("emailPdf route error:", err);
    return NextResponse.json({ error: "Failed to email PDF" }, { status: 500 });
  }
}
