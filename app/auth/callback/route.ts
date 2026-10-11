import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callbackDestination } from "@/lib/auth/callback-destination";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = callbackDestination(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  const failedPath =
    next === "/dashboard"
      ? "/dashboard/login?verification=invalid"
      : "/admin/forgot-password?recovery=invalid";
  return NextResponse.redirect(new URL(failedPath, requestUrl.origin));
}
