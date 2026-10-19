"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  quoteRequestSchema,
  type QuoteRequestFormInput,
  type QuoteRequestInput,
} from "@/lib/validations";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message?: string;
  referenceNumber?: string;
};

const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy disabled:opacity-60";

export function QuoteRequestForm() {
  const [startedAt] = useState(() => Date.now());
  const [submission, setSubmission] = useState<SubmissionState>({
    kind: "idle",
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestFormInput, unknown, QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      consent: false,
      website: "",
      formStartedAt: startedAt,
      originPage: "",
    },
  });

  async function onSubmit(values: QuoteRequestInput) {
    setSubmission({ kind: "idle" });
    const payload = {
      ...values,
      formStartedAt: startedAt,
      originPage: window.location.href,
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        status: SubmissionState["kind"];
        message: string;
        referenceNumber?: string;
        issues?: Record<string, string[]>;
      };

      if (result.issues) {
        Object.entries(result.issues).forEach(([field, messages]) => {
          if (messages?.[0]) {
            setError(field as keyof QuoteRequestFormInput, {
              message: messages[0],
            });
          }
        });
      }

      setSubmission({
        kind: result.status,
        message: result.message,
        referenceNumber: result.referenceNumber,
      });

      if (response.ok && result.status === "success") {
        reset({
          consent: false,
          website: "",
          formStartedAt: startedAt,
          originPage: "",
        });
      }
    } catch {
      setSubmission({
        kind: "error",
        message:
          "The quote service could not be reached. Your information remains in the form so you can try again.",
      });
    }
  }

  return (
    <form
      id="quote-request"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="border-line bg-off-white rounded-xl border p-6 sm:p-8"
    >
      <h2 className="text-navy text-2xl font-bold">Request a quote</h2>
      <p className="text-muted mt-2 text-sm">
        Give us enough context to understand the work. All fields marked * are
        required.
      </p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input
          id="quote-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input
        type="hidden"
        {...register("formStartedAt", { valueAsNumber: true })}
      />
      <input type="hidden" {...register("originPage")} />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="quote-name" label="Full name *" error={errors.name?.message}>
          <input
            id="quote-name"
            className={control}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "quote-name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field id="quote-company" label="Company or organisation">
          <input
            id="quote-company"
            className={control}
            autoComplete="organization"
            {...register("company")}
          />
        </Field>

        <Field
          id="quote-email"
          label="Email address *"
          error={errors.email?.message}
        >
          <input
            id="quote-email"
            className={control}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "quote-email-error" : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          id="quote-phone"
          label="Phone number *"
          error={errors.phone?.message}
        >
          <input
            id="quote-phone"
            className={control}
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "quote-phone-error" : undefined}
            {...register("phone")}
          />
        </Field>

        <Field
          id="quote-service"
          label="Service required *"
          error={errors.service?.message}
        >
          <select
            id="quote-service"
            className={control}
            defaultValue=""
            aria-invalid={!!errors.service}
            aria-describedby={
              errors.service ? "quote-service-error" : undefined
            }
            {...register("service")}
          >
            <option value="" disabled>
              Select a service
            </option>
            <option>Event Safety Management</option>
            <option>HSE Training</option>
            <option>HSE Personnel Outsourcing</option>
            <option>HSE Mentorship Program</option>
            <option>Other HSE Support</option>
          </select>
        </Field>

        <Field id="quote-location" label="Location">
          <input
            id="quote-location"
            className={control}
            autoComplete="address-level2"
            {...register("location")}
          />
        </Field>

        <Field id="quote-start-date" label="Expected start date">
          <input
            id="quote-start-date"
            className={control}
            type="date"
            {...register("expectedStartDate")}
          />
        </Field>

        <Field
          id="quote-participants"
          label="Participants or people covered"
          error={errors.participantCount?.message}
        >
          <input
            id="quote-participants"
            className={control}
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            aria-invalid={!!errors.participantCount}
            aria-describedby={
              errors.participantCount ? "quote-participants-error" : undefined
            }
            {...register("participantCount", {
              setValueAs: (value) =>
                value === "" || value === undefined ? undefined : Number(value),
            })}
          />
        </Field>

        <Field
          id="quote-description"
          label="Project or event description *"
          error={errors.projectDescription?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="quote-description"
            className={control}
            rows={6}
            aria-invalid={!!errors.projectDescription}
            aria-describedby={
              errors.projectDescription ? "quote-description-error" : undefined
            }
            {...register("projectDescription")}
          />
        </Field>

        <Field
          id="quote-requirements"
          label="Additional requirements"
          className="sm:col-span-2"
        >
          <textarea
            id="quote-requirements"
            className={control}
            rows={4}
            {...register("additionalRequirements")}
          />
        </Field>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="accent-navy mt-1 size-4"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "quote-consent-error" : undefined}
          {...register("consent")}
        />
        <span>
          By submitting this form, you agree that Dune Consulting may use the
          information provided to prepare and respond to your quote request.
          Read our{" "}
          <Link
            href="/privacy"
            className="text-navy decoration-amber font-bold underline decoration-2 underline-offset-2"
          >
            privacy policy
          </Link>
          .
        </span>
      </label>
      {errors.consent && (
        <p id="quote-consent-error" className="mt-1 text-sm text-red-700">
          {errors.consent.message}
        </p>
      )}

      <div className="mt-5 min-h-16" aria-live="polite" aria-atomic="true">
        {submission.message && (
          <div
            role="status"
            className={`rounded-md border p-4 text-sm ${submission.kind === "success" ? "border-success/40 bg-success/5 text-success" : "border-amber/50 bg-amber/10 text-navy"}`}
          >
            <strong className="block">
              {submission.kind === "success"
                ? "Quote request received"
                : "Quote request not sent"}
            </strong>
            {submission.referenceNumber && (
              <span className="text-navy mt-1 block font-bold">
                Reference: {submission.referenceNumber}
              </span>
            )}
            <span className="text-muted mt-1 block">{submission.message}</span>
          </div>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className="bg-amber text-deep-navy hover:bg-amber-hover mt-2 min-h-12 rounded-md px-6 py-3 font-bold disabled:cursor-wait disabled:opacity-60"
        type="submit"
      >
        {isSubmitting ? "Submitting request…" : "Request a quote"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-navy text-sm font-bold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
