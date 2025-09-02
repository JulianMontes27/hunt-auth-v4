import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user as userSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { imageUrl } = await request.json();

    // Validate the image URL (optional but recommended)
    if (imageUrl && typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    // Update user's avatar in database
    await db
      .update(userSchema)
      .set({ 
        image: imageUrl || null,
        updatedAt: new Date()
      })
      .where(eq(userSchema.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
      imageUrl: imageUrl || null
    });

  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}