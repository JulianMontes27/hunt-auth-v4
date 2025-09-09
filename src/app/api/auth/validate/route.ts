import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import { NextRequest } from "next/server";

/* Endpoint to validate Better-Auth Sessions */
export async function GET() {
  try {
    // Use Better Auth's built-in session validation
    // Don't manually check for session cookies - Better Auth handles this internally
    const session = await auth.api.getSession({
      headers: await headers(), // pass the headers object for Better Auth to handle cookies
    });

    if (session?.user) {
      return Response.json(
        {
          authenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
          },
        },
        {
          headers: {
            "Cache-Control": "private, max-age=300", // 5 minutes
            Vary: "Cookie",
          },
        }
      );
    }

    return Response.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error("Session validation error:", error);
    return Response.json(
      { authenticated: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
