"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  claimMentorshipApplication,
  type ClaimState,
} from "@/app/dashboard/actions";

const initialState: ClaimState = { status: "idle" };

export function MenteeClaimForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    claimMentorshipApplication,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  return (
    <form action={formAction} className="mt-5 space-y-3">
      <label
        htmlFor="mentorship-invitation"
        className="text-navy block text-sm font-semibold"
      >
        Private invitation code
      </label>
      <input
        id="mentorship-invitation"
        name="invitationCode"
        type="password"
        autoComplete="off"
        minLength={43}
        maxLength={43}
        required
        className="border-line w-full max-w-lg rounded-lg border bg-white px-4 py-3 font-mono text-sm"
      />
      <p className="text-muted max-w-lg text-xs leading-5">
        After approving your application, Dune Consulting staff will share
        a one-use invitation with you privately. Enter it while signed in
        using the verified email on your application.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="bg-amber text-deep-navy hover:bg-amber-hover rounded-lg px-4 py-2.5 text-sm font-bold disabled:opacity-60"
      >
        {pending ? "Linking…" : "Link accepted application"}
      </button>
      {state.message && (
        <p role="status" className={state.status === "error"
          ? "text-sm text-red-800"
          : "text-sm text-green-800"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
