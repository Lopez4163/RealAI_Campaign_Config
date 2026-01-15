// app/api/zoho/test/route.ts
import { NextResponse } from "next/server";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function getAccessToken() {
  const url = new URL(`${env("ZOHO_ACCOUNTS_URL")}/oauth/v2/token`);
  url.searchParams.set("refresh_token", env("ZOHO_REFRESH_TOKEN"));
  url.searchParams.set("client_id", env("ZOHO_CLIENT_ID"));
  url.searchParams.set("client_secret", env("ZOHO_CLIENT_SECRET"));
  url.searchParams.set("grant_type", "refresh_token");

  const res = await fetch(url.toString(), { method: "POST" });
  const json = await res.json();

  if (!res.ok || !json.access_token) {
    throw new Error(`Token error: ${res.status} ${JSON.stringify(json)}`);
  }
  return json.access_token as string;
}

export async function GET() {
  try {
    const access = await getAccessToken();

    const res = await fetch(`${env("ZOHO_API_BASE_URL")}/crm/v2/users?type=CurrentUser`, {
      headers: { Authorization: `Zoho-oauthtoken ${access}` },
    });

    const data = await res.json();
    return NextResponse.json({ ok: res.ok, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
