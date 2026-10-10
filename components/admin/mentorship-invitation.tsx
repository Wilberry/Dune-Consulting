"use client";

import { useActionState } from "react";
import {
  createMentorshipInvitation,
  type MentorshipInvitationState,
} from "@/app/admin/(dashboard)/mentorship/actions";

const initialState: MentorshipInvitationState = { status: "idle" };

export function MentorshipInvitation({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(
    createMentorshipInvitation,
    initialState,
  );

  return (
    <div className="border-line mt-4 rounded-lg border bg-white p-4">
      <h3 className="text-navy text-sm font-bold">Mentee invitation</h3>
      <p className="text-muted mt-2 text-xs leading-5">
        Generate a 48-hour, single-use code for an approved applicant. Share it
        privately with the applicant. A new code invalidates the previous code.
      </p>
      <form action={formAction} className="mt-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <button
          type="submit"
          disabled={pending}
          className="border-navy text-navy hover:bg-off-white rounded-md border px-3 py-2 text-xs font-bold disabled:opacity-60"
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
            Copy now. This code will not be shown again.
          </p>
          <code className="mt-2 block break-all select-all text-xs">
            {state.code}
          </code>
          <p className="text-muted mt-2 text-xs">
            Send only through a private, verified channel. Never put it in a URL.
          </p>
        </div>
      )}
    </div>
  );
}
