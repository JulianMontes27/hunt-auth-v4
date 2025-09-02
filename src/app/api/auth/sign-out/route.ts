import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/* Endpoint to signout a User */
export async function POST(request: Request) {
  try {
    const requestHeaders = await headers();

    // Get current session to validate user is authenticated
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    // After validating the Session, sign-out the User
    if (session?.user) {
      // Use Better Auth's signOut method to properly clear session and cookies
      const signOutResult = await auth.api.signOut({
        headers: requestHeaders,
      });

      if (signOutResult.success) {
        // Create response with CORS headers for cross-origin requests
        const response = new Response(
          JSON.stringify({ signed_out: signOutResult.success }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin":
                request.headers.get("origin") || "*",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers":
                "Content-Type, Authorization, Cookie",
            },
          }
        );

        // Better Auth automatically handles cookie clearing through the nextCookies() plugin
        // when called with the correct headers context

        return response;
      }
    }

    return new Response(
      JSON.stringify({ signed_out: false, error: "Not authenticated" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Sign out error:", error);
    return new Response(
      JSON.stringify({ signed_out: false, error: "Sign out failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400", // 24 hours
    },
  });
}
