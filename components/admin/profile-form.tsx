"use client";

import { useActionState } from "react";
import {
  updateProfileName,
  type ProfileActionState,
} from "@/app/admin/(dashboard)/settings/actions";
import type { StaffUser } from "@/lib/admin/auth";

const initialState: ProfileActionState = { status: "idle" };

export function ProfileForm({ user }: { user: StaffUser }) {
  const [state, formAction, pending] = useActionState(updateProfileName, initialState);

  return (
    <form action={formAction} className="border-line mt-8 max-w-2xl rounded-xl border bg-white p-6 sm:p-7">
      <div className="grid gap-5">
        <div>
          <label htmlFor="fullName" className="text-navy text-sm font-bold">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            defaultValue={user.fullName ?? ""}
            required
            minLength={2}
            maxLength={120}
            className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-navy text-sm font-bold">
            Email
          </label>
          <input
            id="email"
            value={user.email}
            readOnly
            className="border-line bg-off-white text-muted mt-2 w-full rounded-lg border px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-navy text-sm font-bold">
            Role
          </label>
          <input
            id="role"
            value={user.role}
            readOnly
            className="border-line bg-off-white text-muted mt-2 w-full rounded-lg border px-4 py-3 capitalize"
          />
          <p className="text-muted mt-2 text-xs">Roles can only be changed through an authorized administrative process.</p>
        </div>
      </div>

      <div className="mt-5 min-h-11" aria-live="polite">
        {state.message && (
          <p
            className={`rounded-lg border p-3 text-sm ${
              state.status === "success"
                ? "border-success/30 bg-success/5 text-success"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
            role="status"
          >
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-amber text-deep-navy hover:bg-amber-hover mt-2 rounded-lg px-5 py-3 font-bold disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
