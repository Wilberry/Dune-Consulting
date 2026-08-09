"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Brand } from "@/components/layout/brand";
import { createClient } from "@/lib/supabase/client";

const forgotSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const parsed = forgotSchema.safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Review the email address.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        parsed.data.email,
        { redirectTo },
      );

      if (resetError) {
        setError("Could not send the recovery email. Try again later.");
        return;
      }

      setMessage(
        "If an account exists for that email, a password recovery link has been sent.",
      );
    } catch {
      setError("Could not send the recovery email. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Brand logoClassName="h-12 w-auto" textClassName="text-lg" />
        </div>

        <div className="border-line rounded-2xl border bg-white p-6 shadow-[0_18px_50px_rgba(15,35,68,0.10)] sm:p-8">
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Staff Recovery
          </p>
          <h1 className="text-navy mt-3 text-3xl font-extrabold">
            Forgot your password?
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">
            Enter your staff email. We will send a secure recovery link if the
            account exists.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="text-navy text-sm font-bold">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>

            <div className="min-h-12" aria-live="polite">
              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                  role="alert"
                >
                  {error}
                </p>
              )}
              {message && (
                <p
                  className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                  role="status"
                >
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send recovery link"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/admin/login"
              className="text-amber-text text-sm font-semibold hover:underline"
            >
              Back to admin sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
