import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (listError) {
      console.error("Admin password reset listUsers error:", listError);
      return NextResponse.json(
        { message: "Could not reset password. Try again later." },
        { status: 500 },
      );
    }

    const user = data.users.find((item) => item.email === email);

    if (!user) {
      return NextResponse.json({ message: "Password reset successful." });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password },
    );

    if (updateError) {
      console.error("Admin password reset updateUserById error:", updateError);
      return NextResponse.json(
        { message: "Could not reset password. Try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Admin password reset exception:", err);
    return NextResponse.json(
      { message: "Could not reset password. Try again later." },
      { status: 500 },
    );
  }
}
