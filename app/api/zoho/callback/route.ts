import { NextRequest, NextResponse } from "next/server";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ ok: false, error: "Missing ?code=" }, { status: 400 });
    }

    const tokenUrl = `${env("ZOHO_ACCOUNTS_URL")}/oauth/v2/token`;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env("ZOHO_CLIENT_ID"),
      client_secret: env("ZOHO_CLIENT_SECRET"),
      redirect_uri: env("ZOHO_REDIRECT_URI"),
      code,
    });

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status, json }, { status: 500 });
    }

    // IMPORTANT: DO NOT return refresh_token in production logs forever.
    // For now, return it once so you can copy it into env vars.
    return NextResponse.json({ ok: true, json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
