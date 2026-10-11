"use client";

import { useActionState } from "react";
import {
  createMentorshipInvitation,
  type InvitationActionState,
} from "@/app/admin/(dashboard)/mentorship/actions";

const initialState: InvitationActionState = { status: "idle" };

export function MentorshipInvitation({ applicationId }: { applicationId: string }) {
  const [state, action, pending] = useActionState(
    createMentorshipInvitation,
    initialState,
  );

  return (
    <section className="border-line mt-4 rounded-lg border bg-white p-4">
      <h3 className="text-navy text-sm font-bold">Secure mentee invitation</h3>
      <p className="text-muted mt-2 text-xs leading-5">
        Generate a private 48-hour invitation code for this approved applicant.
        Creating another code invalidates the earlier one.
      </p>
      <form action={action} className="mt-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <button
          type="submit"
          disabled={pending}
          className="border-navy text-navy rounded-md border px-3 py-2 text-xs font-bold disabled:opacity-60"
        >
          {pending ? "Generating…" : "Generate invitation code"}
        </button>
      </form>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-xs text-red-800">
          {state.message}
        </p>
      )}
      {state.status === "created" && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3">
          <p className="text-navy text-xs font-bold">
            Copy now — the code will not be shown again.
          </p>
          <code className="mt-2 block break-all select-all text-xs">
            {state.code}
          </code>
          <p className="text-muted mt-2 text-xs leading-5">
            Share it directly with the intended applicant through a verified
            private channel, never in a URL or public message.
          </p>
        </div>
      )}
    </section>
  );
}
