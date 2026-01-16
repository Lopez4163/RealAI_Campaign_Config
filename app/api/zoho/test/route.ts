import { NextResponse } from "next/server";

/**
 * Small helper to safely read env vars
 */
function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Refresh Zoho access token using refresh token
 */
async function getZohoAccessToken() {
  const res = await fetch(`${env("ZOHO_ACCOUNTS_URL")}/oauth/v2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
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

/**
 * GET /api/zoho/test
 */
export async function GET() {
  try {
    // 1️⃣ Get access token
    const { accessToken, apiDomain } = await getZohoAccessToken();

    // 2️⃣ Call Zoho CRM (Current User)
    const res = await fetch(
      `${apiDomain}/crm/v2/users?type=CurrentUser`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    // 3️⃣ Return response
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
