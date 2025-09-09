import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import twilio from "twilio";

// Initialize Twilio
const getTwilioClient = () =>
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Simple in-memory store for OTP codes (in production, use Redis or database)
const otpStore = new Map<
  string,
  { code: string; expires: number; userId: string }
>();

export async function POST(request: NextRequest) {
  try {
    const { action, phoneNumber, code, checkVerified } = await request.json();

    // If no action is provided, check if phone number exists
    if (!action) {
      // Check if phone number already exists in database
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.phonenumber, phoneNumber))
        .limit(1);

      // If checkVerified is requested, also check verification status
      if (checkVerified && existingUser.length > 0) {
        return NextResponse.json({
          exists: true,
          isVerified: existingUser[0].phonenumberverified || false,
          message: existingUser[0].phonenumberverified
            ? "Phone number already verified by another account"
            : "Phone number exists but not verified",
        });
      }

      return NextResponse.json({
        exists: existingUser.length > 0,
        message:
          existingUser.length > 0
            ? "Phone number already registered"
            : "Phone number available",
      });
    }

    // Get current user session for other actions
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "send") {
      // Verify the phone number belongs to the current user
      const user = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, session.user.id))
        .limit(1);

      if (!user[0] || user[0].phonenumber !== phoneNumber) {
        return NextResponse.json(
          { error: "Phone number not found or doesn't belong to user" },
          { status: 400 }
        );
      }

      // Generate OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP
      otpStore.set(`${session.user.id}:${phoneNumber}`, {
        code: otpCode,
        expires,
        userId: session.user.id,
      });

      // Send SMS
      try {
        const message = await getTwilioClient().messages.create({
          body: `Tu código de verificación Hunt Tickets: ${otpCode}. Válido por 5 minutos. No compartas este código.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        });

        console.log(`📱 Verification OTP sent to ${phoneNumber}: ${otpCode}`);
        console.log(`✅ SMS sent successfully. Message SID: ${message.sid}`);
      } catch (smsError) {
        console.error(`❌ Failed to send SMS:`, smsError);
        throw new Error("Failed to send SMS");
      }

      return NextResponse.json({ success: true });
    } else if (action === "verify") {
      // Verify the OTP code
      const stored = otpStore.get(`${session.user.id}:${phoneNumber}`);

      if (!stored) {
        return NextResponse.json(
          { error: "No verification code found" },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expires) {
        otpStore.delete(`${session.user.id}:${phoneNumber}`);
        return NextResponse.json(
          { error: "Verification code has expired" },
          { status: 400 }
        );
      }

      if (stored.code !== code) {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        );
      }

      // OTP is valid, update user's phone verification status
      await db
        .update(schema.user)
        .set({
          phonenumberverified: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.user.id, session.user.id));

      // Clean up the OTP
      otpStore.delete(`${session.user.id}:${phoneNumber}`);

      console.log(
        `✅ Phone ${phoneNumber} verified for user ${session.user.id}`
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
