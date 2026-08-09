"use client";

import { useState } from "react";
import { z } from "zod";

const forgotSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Enter a password with at least 8 characters."),
    confirmPassword: z.string()
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
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Review the form fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Password reset response error:", result);
        setError(result.message || "Could not reset password. Try again later.");
        return;
      }

      setMessage("Password reset successfully. You may now sign in.");
    } catch (err) {
      console.error(err);
      setError("Could not reset password. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <h2 className="text-navy text-2xl font-extrabold">Reset password</h2>
        </div>

        <div className="border-line rounded-2xl border bg-white p-6 shadow-[0_18px_50px_rgba(15,35,68,0.10)] sm:p-8">
          <p className="text-muted mt-3 text-sm leading-6">
            Enter the admin email and a new password to reset the account directly.
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
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-navy text-sm font-bold">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>

            <div className="min-h-12" aria-live="polite">
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-lg px-5 py-3.5 font-bold disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
