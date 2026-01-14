// app/api/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

import { buildOgUrl } from "@/app/lib/org/buildOgUrl";
import type { PreviewContext } from "@/app/lib/types/campaign";
import type { FormOutput } from "@/app/lib/org/buildOgUrl";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { previewContext, formOutput } = (await req.json()) as {
      previewContext: PreviewContext;
      formOutput: FormOutput;
    };

    if (!previewContext || !formOutput) {
      return NextResponse.json(
        { error: "previewContext and formOutput are required" },
        { status: 400 }
      );
    }

    const ogPath = buildOgUrl(formOutput as any, previewContext);

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const ogUrl = ogPath.startsWith("http") ? ogPath : `${baseUrl}${ogPath}`;

    // 3) Fetch the OG image (PNG)
    const imgRes = await fetch(ogUrl, { cache: "no-store" });
    if (!imgRes.ok) {
      const text = await imgRes.text().catch(() => "");
      console.error("OG fetch failed:", imgRes.status, text);
      return NextResponse.json(
        { error: "Failed to fetch OG image" },
        { status: 500 }
      );
    }

    const pngBytes = await imgRes.arrayBuffer();

    // 4) Wrap the PNG into a 1-page PDF
    const pdfDoc = await PDFDocument.create();
    const png = await pdfDoc.embedPng(pngBytes);

    const { width, height } = png.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(png, { x: 0, y: 0, width, height });

    const pdfBytes = await pdfDoc.save();

    // 5) Return as downloadable PDF
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="realai-campaign.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
