import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import api from "@/lib/mp-api";
import { db } from "@/db/drizzle";
import { paymentProcessorAccount } from "@/db/schema";

export async function GET(request: NextRequest) {
  // Obtenemos el code de los request search-params
  const code = request.nextUrl.searchParams.get("code");

  // Check Session
  const session = await auth.api.getSession({
    headers: await headers(), // pass the headers object for Better Auth to handle cookies
  });

  if (!session?.user?.id) {
    return NextResponse.redirect(`${process.env.APP_URL}/sign-in`);
  }

  try {
    // Get OAuth credentials from MercadoPago
    const credentials = await api.user.connect(code!);
    console.log(credentials);

    // Validate credentials
    if (!credentials?.access_token) {
      throw new Error("No access token received from MercadoPago");
    }

    // Extract MercadoPago user ID from access token
    // Format: "APP_USR-{user_id}-{timestamp}-{hash}-{app_id}"
    const processorAccountId = credentials.access_token.split("-")[1]; // "1470075971272873"

    // Insert into payment_processor_account table
    await db.insert(paymentProcessorAccount).values({
      id: `mpa_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: session.user.id,
      processorType: "mercadopago",
      processorAccountId,
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || null,
      tokenExpiresAt: credentials.expires_in
        ? new Date(Date.now() + credentials.expires_in * 1000)
        : null,
      scope: credentials.scope || null,
      status: "active",
      metadata: JSON.stringify({
        public_key: credentials.public_key,
        live_mode: credentials.live_mode || false,
        user_id: processorAccountId,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard?connected=mercadopago`
    );
  } catch (error) {
    console.error("MercadoPago connection error:", error);
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard?error=connection_failed`
    );
  }
}
