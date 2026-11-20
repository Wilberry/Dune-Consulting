"use client";

import { useActionState } from "react";
import {
  updateCompanyContactDetails,
  type CompanyContactActionState,
} from "@/app/admin/(dashboard)/settings/actions";
import type { CompanyContactDetails } from "@/lib/company-contact";

const initialState: CompanyContactActionState = { status: "idle" };

export function CompanyContactForm({
  contactDetails,
}: {
  contactDetails: CompanyContactDetails;
}) {
  const [state, formAction, pending] = useActionState(
    updateCompanyContactDetails,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="border-line mt-5 max-w-2xl rounded-xl border bg-white p-6 sm:p-7"
    >
      <div className="grid gap-5">
        <div>
          <label htmlFor="companyPhone" className="text-navy text-sm font-bold">
            Public phone number
          </label>
          <input
            id="companyPhone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={contactDetails.telephone}
            required
            minLength={7}
            maxLength={30}
            pattern="[+]?[0-9(). ]+"
            title="Enter a phone number using digits and optional spaces or punctuation."
            className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="companyEmail" className="text-navy text-sm font-bold">
            Public email address
          </label>
          <input
            id="companyEmail"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={contactDetails.email}
            required
            maxLength={254}
            className="border-line text-ink mt-2 w-full rounded-lg border bg-white px-4 py-3"
          />
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
        {pending ? "Saving…" : "Save contact details"}
      </button>
    </form>
  );
}
