"use client";
import { ImageResponse } from "@vercel/og";

import RealAiStatsInfographic from "@/app/components/og/RealAiStatsInfographic";
import RealAiProductInfographic from "@/app/components/og/RealAiProductInfographic";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const campaignType = searchParams.get("campaignType") ?? "audience";
  const industry = (searchParams.get("industry") ?? "CPG").toUpperCase();

  // ----- Audience params -----
  const sample_size = searchParams.get("sampleSize") ?? "10,000+";
  const conversion_rate = searchParams.get("conversion") ?? "40-45%";
  const ltv_multiple = searchParams.get("ltv") ?? "25-30x";

  // ----- Product params -----
  const items =
    searchParams.get("items")?.split(",").map(s => s.trim()).filter(Boolean) ??
    [];

  // ----- Switch by campaign type -----
  if (campaignType === "audience") {
    return new ImageResponse(
      (
        <RealAiStatsInfographic
          industry_header={industry}
          sample_size={sample_size}
          conversion_rate={conversion_rate}
          ltv_multiple={ltv_multiple}
        />
      ),
      { width: 1200, height: 1533 }
    );
  }

  // 👇 Anything NOT audience is product
  return new ImageResponse(
    (
      <RealAiProductInfographic
        industry_header={industry}
        items={items}
      />
    ),
    { width: 1200, height: 1533 }
  );
}
