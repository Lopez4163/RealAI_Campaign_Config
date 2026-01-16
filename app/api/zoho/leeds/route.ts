import { NextRequest, NextResponse } from "next/server";
import type { PreviewContext } from "@/app/lib/types/campaign";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function getZohoAccessToken() {
  const res = await fetch(`${env("ZOHO_ACCOUNTS_URL")}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: env("ZOHO_REFRESH_TOKEN"),
      client_id: env("ZOHO_CLIENT_ID"),
      client_secret: env("ZOHO_CLIENT_SECRET"),
      grant_type: "refresh_token",
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.access_token) {
    throw new Error(`Zoho token error: ${JSON.stringify(json)}`);
  }

  return {
    accessToken: json.access_token as string,
    apiDomain: (json.api_domain as string) ?? env("ZOHO_API_BASE_URL"),
  };
}

async function leadExistsByEmail(
  apiDomain: string,
  accessToken: string,
  email: string
): Promise<boolean> {
  const criteria = `(Email:equals:${email})`;
  const url = `${apiDomain}/crm/v2/Leads/search?criteria=${encodeURIComponent(
    criteria
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  });

  if (res.status === 204) return false;

  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) && json.data.length > 0;
}

/**
 * POST /api/zoho/leeds
 * Body: { previewContext: PreviewContext }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { previewContext?: PreviewContext };
    const previewContext = body.previewContext;

    if (!previewContext?.email) {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    const Email = previewContext.email.trim();
    const Company = previewContext.companyName?.trim() || "Individual";
    const Last_Name = previewContext.name?.trim() || "Website Lead";
    const Description = previewContext.description?.trim() || "";

    const { accessToken, apiDomain } = await getZohoAccessToken();

    const exists = await leadExistsByEmail(apiDomain, accessToken, Email);
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Lead already exists for this email" },
        { status: 409 }
      );
    }

    const CAMPAIGN_API = "Campaign_Type";
    const INDUSTRY_API = "Industry_Type";

    const payload = {
      data: [
        {
          Company,
          Email,
          Last_Name,
          Description,
          [CAMPAIGN_API]: previewContext.campaignType ?? "",
          [INDUSTRY_API]: previewContext.industry ?? "",
        },
      ],
    };

    const res = await fetch(`${apiDomain}/crm/v2/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const zoho = await res.json().catch(() => null);
    const recordStatus = zoho?.data?.[0]?.status;

    if (!res.ok || recordStatus !== "success") {
      return NextResponse.json(
        { ok: false, status: res.status, zoho, sent: payload },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, zoho });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
