"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { claimMentorship, type MenteeActionState } from "@/app/dashboard/actions";

const initialState: MenteeActionState = { status: "idle" };

export function ClaimForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(claimMentorship, initialState);

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  return (
    <div className="border-line mt-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-navy text-xl font-bold">Link your approved application</h2>
      <p className="text-muted mt-2 text-sm leading-6">
        After staff approve your application, they will provide a private
        invitation code. Sign in using the verified email address on your
        application, then enter the code below. An email match alone does not
        grant enrolment.
      </p>
      <form action={formAction} className="mt-5 space-y-3">
        <label htmlFor="mentee-claim-code" className="text-navy block text-sm font-bold">
          Invitation code
        </label>
        <input
          id="mentee-claim-code"
          name="code"
          type="password"
          autoComplete="off"
          required
          minLength={43}
          maxLength={43}
          className="border-line w-full rounded-lg border px-4 py-3 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-amber text-deep-navy hover:bg-amber-hover rounded-lg px-5 py-3 font-bold disabled:opacity-60"
        >
          {pending ? "Verifying…" : "Link enrolment"}
        </button>
      </form>
      {state.message && (
        <p role="status" className="text-muted mt-4 text-sm">
          {state.message}
        </p>
      )}
    </div>
  );
}
