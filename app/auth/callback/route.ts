import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext =
    requestUrl.searchParams.get("next") ?? "/admin/update-password";
  // Reject scheme-relative URLs, backslashes and controls that could escape
  // the application origin after URL resolution.
  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !/[\\\\\u0000-\u001F]/.test(requestedNext)
      ? requestedNext
      : "/admin/update-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/admin/forgot-password?recovery=invalid", requestUrl.origin),
  );
}
