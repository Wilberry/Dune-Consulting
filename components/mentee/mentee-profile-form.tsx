"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateMenteeDisplayName,
  type ClaimState,
} from "@/app/dashboard/actions";

const initialState: ClaimState = { status: "idle" };

export function MenteeProfileForm({ name }: { name: string | null }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    updateMenteeDisplayName,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  return (
    <form action={action} className="mt-5 space-y-3">
      <label htmlFor="mentee-name" className="text-navy block text-sm font-semibold">
        Display name
      </label>
      <input
        id="mentee-name"
        name="displayName"
        defaultValue={name ?? ""}
        minLength={2}
        maxLength={120}
        required
        className="border-line w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-navy rounded-lg px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save display name"}
      </button>
      {state.message && <p role="status" className="text-muted text-sm">{state.message}</p>}
    </form>
  );
}
