"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "./actions";

const initialState: ProfileState = {};

export function ProfileForm({ fullName }: { fullName: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="fullName" className="text-navy text-sm font-bold">Full name</label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          required
          minLength={2}
          maxLength={120}
          className="border-line text-ink mt-2 w-full rounded-md border bg-white px-4 py-3"
        />
      </div>
      {state.message && (
        <p
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${state.status === "success" ? "border-success/40 bg-success/5 text-success" : "border-amber/50 bg-amber/10 text-navy"}`}
        >
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-amber text-deep-navy hover:bg-amber-hover rounded-md px-5 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
