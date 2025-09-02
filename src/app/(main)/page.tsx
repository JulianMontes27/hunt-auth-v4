import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // This is the '/' route, its only for redirection
  // if the User is signed in, sent him to the dashboard
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    console.log("session :", session);
    if (session) {
      redirect("/dashboard");
    }
    redirect("/sign-in");
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT")
      console.error("Auth error:", error);
    redirect("/sign-in");
  }
}
