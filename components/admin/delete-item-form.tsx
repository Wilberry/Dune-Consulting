"use client";

import { useActionState } from "react";
import type { AdminActionState } from "@/lib/admin/action-state";

const initialState: AdminActionState = { status: "idle" };

export function DeleteItemForm({
  action,
  id,
  label,
}: {
  action: (
    previousState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  id: string;
  label: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
      </form>
      {state.message && (
        <p
          className={`mt-2 max-w-48 text-xs ${
            state.status === "success" ? "text-success" : "text-red-700"
          }`}
          role="status"
          aria-label={`${label} deletion status`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
