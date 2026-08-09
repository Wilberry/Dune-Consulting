"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Brand } from "@/components/layout/brand";
import { createClient } from "@/lib/supabase/client";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Enter a password with at least 8 characters."),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export function UpdatePasswordForm() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;
        if (event === "PASSWORD_RECOVERY" || session?.user) {
          setReady(true);
        }
      },
    );

    void supabase.auth.getUser().then(({ data, error: userError }) => {
      if (!active) return;
      if (data.user) {
        setReady(true);
      } else if (userError) {
        setReady(false);
      } else {
        setReady(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!ready) {
      setError(
        "This recovery link is missing, invalid or expired. Request a new recovery email.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Review the password fields.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: parsed.data.password,
      });

      if (updateError) {
        setError("Could not update the password. Request a new recovery link.");
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
    } catch {
      setError("Could not update the password. Try again later.");
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
            Choose a new password
          </h1>

          {success ? (
            <div className="mt-6">
              <p
                className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                role="status"
              >
                Your password has been updated. Sign in with the new password.
              </p>
              <Link
                href="/admin/login"
                className="bg-amber text-deep-navy hover:bg-amber-hover mt-5 flex w-full items-center justify-center rounded-lg px-5 py-3.5 font-bold"
              >
                Return to admin sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted mt-3 text-sm leading-6">
                Use the secure recovery link from your email, then choose a new
                password for your staff account.
              </p>

              {ready === false && (
                <p
                  className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
                  role="alert"
                >
                  No valid recovery session was found. Request a new recovery
                  email before changing your password.
                </p>
              )}

              <form
                className="mt-7 space-y-5"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <label
                    htmlFor="password"
                    className="text-navy text-sm font-bold"
                  >
                    New password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={ready !== true || loading}
                    className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-navy text-sm font-bold"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={ready !== true || loading}
                    className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3 disabled:opacity-60"
                  />
                </div>

                <div className="min-h-12" aria-live="polite">
                  {ready === null && (
                    <p className="text-muted text-sm">Checking recovery link…</p>
                  )}
                  {error && (
                    <p
                      className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={ready !== true || loading}
                  className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Update password"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/admin/forgot-password"
                  className="text-amber-text text-sm font-semibold hover:underline"
                >
                  Request another recovery link
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
