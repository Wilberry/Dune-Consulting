"use client";

import { useActionState } from "react";
import {
  updateMenteeProfile,
  type MenteeActionState,
} from "@/app/dashboard/actions";

const initialState: MenteeActionState = { status: "idle" };

export function MenteeProfileForm({ fullName }: { fullName: string | null }) {
  const [state, formAction, pending] = useActionState(
    updateMenteeProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="mentee-full-name" className="text-navy text-sm font-semibold">
          Display name
        </label>
        <input
          id="mentee-full-name"
          name="fullName"
          type="text"
          defaultValue={fullName ?? ""}
          minLength={2}
          maxLength={120}
          required
          className="border-line mt-2 w-full rounded-lg border bg-white px-4 py-3"
        />
      </div>
      <button
        disabled={pending}
        type="submit"
        className="bg-navy rounded-lg px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update name"}
      </button>
      {state.message && <p role="status" className="text-muted text-xs">{state.message}</p>}
    </form>
  );
}
