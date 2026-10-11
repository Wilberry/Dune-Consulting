"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MenteeLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        setError("Your email or password is incorrect, or this account has not been verified yet.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("The sign-in flow could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="border-line rounded-2xl border bg-white p-6 shadow-[0_18px_50px_rgba(15,35,68,0.10)] sm:p-8">
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Mentee Access
          </p>
          <h1 className="text-navy mt-3 text-3xl font-extrabold">Sign in</h1>
          <p className="text-muted mt-3 text-sm leading-6">
            Continue with the same secure Dune Consulting account used for your mentorship application.
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
                  className="border-line text-ink w-full rounded-lg border bg-white px-4 py-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center justify-center rounded p-1 text-sm hover:bg-slate-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="min-h-12" aria-live="polite">
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
