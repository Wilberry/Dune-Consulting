"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message?: string;
};

export function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>({
    kind: "idle",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmission({ kind: "idle" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, formStartedAt: startedAt }),
      });
      const result = (await response.json()) as {
        status: "success" | "error";
        message: string;
      };

      setSubmission({ kind: result.status, message: result.message });
      if (response.ok && result.status === "success") {
        setEmail("");
        setWebsite("");
        setStartedAt(Date.now());
      }
    } catch {
      setSubmission({
        kind: "error",
        message:
          "The newsletter service could not be reached. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3" noValidate>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.currentTarget.value)}
        />
      </div>

      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Work email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          disabled={submitting}
          className="focus:border-amber min-h-10 rounded-md border border-white/15 bg-white/5 px-3 text-xs text-white transition placeholder:text-white/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-amber text-deep-navy hover:bg-amber-hover min-h-10 rounded-md px-3 text-xs font-bold transition disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      <div className="mt-2 min-h-8" aria-live="polite" aria-atomic="true">
        {submission.message && (
          <p
            role="status"
            className={`text-xs leading-5 ${submission.kind === "success" ? "text-white/80" : "text-amber"}`}
          >
            {submission.message}
          </p>
        )}
      </div>

      <p className="mt-1 text-[11px] leading-5 text-white/50">
        By subscribing, you agree that Dune Consulting may send HSE insights to
        this address. See our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-white/70"
        >
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
