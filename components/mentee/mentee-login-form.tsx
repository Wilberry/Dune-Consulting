"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MenteeLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      setMessage("Enter a valid email and password to continue.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setMessage("Choose a password with at least eight characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });

        if (error) {
          setMessage("Account registration is unavailable. Check your details or try again later.");
        } else if (!data.session) {
          setMessage(
            "If registration is available for this email, check your inbox for a verification link. An account alone does not grant enrolment.",
          );
        } else {
          router.replace("/dashboard");
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage("Your credentials are incorrect or the account is not verified.");
        } else {
          router.replace("/dashboard");
          router.refresh();
        }
      }
    } catch {
      setMessage("Authentication could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-navy text-sm font-semibold underline">
          ← Dune Consulting
        </Link>
        <div className="border-line mt-5 rounded-2xl border bg-white p-6 shadow-[0_18px_50px_rgba(15,35,68,0.10)] sm:p-8">
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Mentee Access
          </p>
          <h1 className="text-navy mt-3 text-3xl font-extrabold">
            {mode === "signin" ? "Mentee sign in" : "Create a mentee account"}
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">
            {mode === "signin"
              ? "Sign in with your existing Dune Consulting account."
              : "Register using the email on your application. Staff approval and a private invitation are still required for enrolment."}
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="mentee-email" className="text-navy text-sm font-bold">
                Email address
              </label>
              <input
                id="mentee-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="mentee-password" className="text-navy text-sm font-bold">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="mentee-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={mode === "signup" ? 8 : undefined}
                  required
                  className="border-line text-ink w-full rounded-lg border bg-white px-4 py-3 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted absolute top-1/2 right-3 -translate-y-1/2 text-sm hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="min-h-12" aria-live="polite">
              {message && (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800" role="status">
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:opacity-60"
            >
              {loading
                ? "Processing…"
                : mode === "signin"
                  ? "Sign in to dashboard"
                  : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode((current) => current === "signin" ? "signup" : "signin");
              setMessage(null);
            }}
            className="text-navy mt-5 text-sm font-semibold underline"
          >
            {mode === "signin" ? "Create a mentee account" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
