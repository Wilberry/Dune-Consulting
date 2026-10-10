"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MenteeAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email.includes("@") || password.length < 8) {
      setMessage(
        "Enter a valid email and a password of at least eight characters.",
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              window.location.origin + "/auth/callback?next=/dashboard",
          },
        });

        if (error) {
          setMessage("Your account could not be created. Please try again.");
        } else if (!data.session) {
          setMessage(
            "Check your inbox and verify your email address before signing in.",
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
          setMessage(
            "Sign-in failed. Check your credentials or verify your email address.",
          );
        } else {
          router.replace("/dashboard");
          router.refresh();
        }
      }
    } catch {
      setMessage("Authentication is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      id="main-content"
      className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12"
    >
      <div className="w-full max-w-md">
        <Link href="/" className="text-navy text-sm font-semibold underline">
          ← Dune Consulting
        </Link>
        <div className="border-line mt-6 rounded-2xl border bg-white p-7 shadow-sm">
          <p className="text-amber-text text-xs font-extrabold tracking-widest uppercase">
            HSE Mentorship
          </p>
          <h1 className="text-navy mt-3 text-3xl font-extrabold">
            {mode === "signin" ? "Mentee sign in" : "Create a mentee account"}
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">
            Use the email on your mentorship application. Account creation does
            not automatically grant an enrolment.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="mentee-email"
                className="text-navy text-sm font-bold"
              >
                Email address
              </label>
              <input
                id="mentee-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border-line mt-2 w-full rounded-lg border px-4 py-3"
              />
            </div>
            <div>
              <label
                htmlFor="mentee-password"
                className="text-navy text-sm font-bold"
              >
                Password
              </label>
              <input
                id="mentee-password"
                name="password"
                type="password"
                minLength={8}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
                className="border-line mt-2 w-full rounded-lg border px-4 py-3"
              />
            </div>
            {message && (
              <p role="status" className="text-muted text-sm">
                {message}
              </p>
            )}
            <button
              disabled={busy}
              type="submit"
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3 font-bold disabled:opacity-60"
            >
              {busy
                ? "Processing…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setMessage("");
            }}
            className="text-navy mt-5 text-sm font-semibold underline"
          >
            {mode === "signin"
              ? "Create an account instead"
              : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
