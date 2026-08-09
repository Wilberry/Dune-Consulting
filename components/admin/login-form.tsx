"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Brand } from "@/components/layout/brand";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Review your sign-in details.",
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword(parsed.data);

      if (signInError || !data.user) {
        console.error(
          "Sign-in error:",
          signInError ?? "no user returned",
          data,
        );
        setError(
          "The email or password is incorrect, or this account is unavailable.",
        );
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (
        profileError ||
        !profile ||
        (profile.role !== "admin" && profile.role !== "editor")
      ) {
        await supabase.auth.signOut();
        setError(
          "This account is not authorized to access Dune administration.",
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Admin sign-in is not configured or could not be reached.");
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
            Staff Access
          </p>
          <h1 className="text-navy mt-3 text-3xl font-extrabold">
            Admin sign in
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">
            Sign in with an approved Dune Consulting staff account.
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
            <div>
              <label htmlFor="password" className="text-navy text-sm font-bold">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="border-line text-ink w-full rounded-lg border bg-white px-4 py-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center justify-center rounded p-1 text-sm hover:bg-slate-50"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58A3 3 0 0113.42 13.42M9.88 5.12A12.06 12.06 0 0121 12c-2.14 3.49-5.74 6-9 6a8.29 8.29 0 01-3.67-.78"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5c4 0 7.4 2.5 9 6-1.6 3.5-5 6-9 6s-7.4-2.5-9-6c1.6-3.5 5-6 9-6z"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/admin/forgot-password"
                className="text-amber text-sm font-medium hover:underline"
              >
                Forgot password?
              </Link>
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="text-muted mt-5 text-center text-xs">
          There is no public administrator registration.
        </p>
      </div>
    </div>
  );
}
