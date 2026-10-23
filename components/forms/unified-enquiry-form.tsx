"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  unifiedEnquirySchema,
  type UnifiedEnquiryFormInput,
  type UnifiedEnquiryInput,
} from "@/lib/validations";
import { buildEnquirySubmission } from "@/lib/forms/unified-enquiry";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message?: string;
  referenceNumber?: string;
};
const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy disabled:opacity-60";

export function UnifiedEnquiryForm({
  initialIntent = "enquiry",
}: {
  initialIntent?: "enquiry" | "quote";
}) {
  const [startedAt] = useState(() => Date.now());
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });
  const defaults = {
    intent: initialIntent,
    consent: false,
    website: "",
    formStartedAt: startedAt,
    originPage: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnifiedEnquiryFormInput, unknown, UnifiedEnquiryInput>({
    resolver: zodResolver(unifiedEnquirySchema),
    defaultValues: defaults,
  });
  const intent = watch("intent");
  const isQuote = intent === "quote";

  function selectIntent(next: "enquiry" | "quote") {
    if (isSubmitting) return;
    setValue("intent", next);
    clearErrors();
    setSubmission({ kind: "idle" });
  }

  async function onSubmit(values: UnifiedEnquiryInput) {
    setSubmission({ kind: "idle" });
    const { endpoint, payload } = buildEnquirySubmission(
      values,
      window.location.href,
      startedAt,
    );
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        status: string;
        message?: string;
        referenceNumber?: string;
        issues?: Record<string, string[]>;
      };
      if (result.issues) {
        const aliases: Record<string, keyof UnifiedEnquiryFormInput> = {
          company: "organisation",
          expectedStartDate: "projectDate",
          projectDescription: "message",
        };
        for (const [field, messages] of Object.entries(result.issues)) {
          if (messages?.[0]) {
            setError(aliases[field] ?? (field as keyof UnifiedEnquiryFormInput), {
              message: messages[0],
            });
          }
        }
      }
      const success = response.ok && result.status === "success";
      setSubmission({
        kind: success ? "success" : "error",
        message: result.message ?? "We could not record your request. Please try again.",
        referenceNumber: success ? result.referenceNumber : undefined,
      });
      if (success) reset({ ...defaults, intent: values.intent });
    } catch {
      setSubmission({
        kind: "error",
        message: "The enquiry service could not be reached. Your information remains in the form so you can try again.",
      });
    }
  }

  return (
    <form
      id="consultation"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="border-line bg-off-white rounded-xl border p-6 sm:p-8"
    >
      <h2 className="text-navy text-2xl font-bold">
        {isQuote ? "Request a quote" : "Get in touch"}
      </h2>
      <p className="text-muted mt-2 text-sm">
        {isQuote
          ? "Share your requirements so we can review the scope and commercial next steps."
          : "Tell us what you would like to discuss. All fields marked * are required."}
      </p>
      <fieldset className="mt-7" disabled={isSubmitting}>
        <legend className="text-navy text-sm font-bold">
          How can we help you?
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(["enquiry", "quote"] as const).map((purpose) => (
            <label
              key={purpose}
              className={[
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition",
                intent === purpose
                  ? "border-navy bg-white text-navy ring-1 ring-navy"
                  : "border-line bg-white/60 text-ink hover:border-navy/40",
              ].join(" ")}
            >
              <input
                type="radio"
                name="enquiry-purpose"
                value={purpose}
                checked={intent === purpose}
                onChange={() => selectIntent(purpose)}
                className="accent-navy size-4"
              />
              {purpose === "quote" ? "Request a quote" : "General enquiry"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="unified-website">Website</label>
        <input
          id="unified-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input type="hidden" {...register("intent")} />
      <input
        type="hidden"
        {...register("formStartedAt", { valueAsNumber: true })}
      />
      <input type="hidden" {...register("originPage")} />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name *" error={errors.name?.message}>
          <input
            id="name"
            className={control}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field id="organisation" label="Company or organisation">
          <input
            id="organisation"
            className={control}
            autoComplete="organization"
            {...register("organisation")}
          />
        </Field>
        <Field id="email" label="Email address *" error={errors.email?.message}>
          <input
            id="email"
            className={control}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
        <Field id="phone" label="Phone number *" error={errors.phone?.message}>
          <input
            id="phone"
            className={control}
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
        </Field>
        <Field id="service" label="Service required *" error={errors.service?.message}>
          <select
            id="service"
            className={control}
            defaultValue=""
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
            {...register("service")}
          >
            <option value="" disabled>Select a service</option>
            <option>Event Safety Management</option>
            <option>HSE Training</option>
            <option>HSE Personnel Outsourcing</option>
            <option>HSE Mentorship Program</option>
            <option>Other HSE Support</option>
          </select>
        </Field>
        <Field id="location" label="Location">
          <input
            id="location"
            className={control}
            autoComplete="address-level2"
            {...register("location")}
          />
        </Field>
        <Field
          id="projectDate"
          label={isQuote ? "Expected start date" : "Event or project date"}
        >
          <input
            id="projectDate"
            className={control}
            type="date"
            {...register("projectDate")}
          />
        </Field>
        {isQuote && (
          <Field
            id="participantCount"
            label="Participants or people covered"
            error={errors.participantCount?.message}
          >
            <input
              id="participantCount"
              className={control}
              type="number"
              min={0}
              max={1000000}
              step={1}
              inputMode="numeric"
              aria-invalid={!!errors.participantCount}
              aria-describedby={
                errors.participantCount ? "participantCount-error" : undefined
              }
              {...register("participantCount", {
                setValueAs: (value) =>
                  value === "" || value === undefined ? undefined : Number(value),
              })}
            />
          </Field>
        )}
        <Field
          id="message"
          label={isQuote ? "Project or event description *" : "How can we help? *"}
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            className={control}
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
          />
        </Field>
        {isQuote && (
          <Field
            id="additionalRequirements"
            label="Additional requirements"
            className="sm:col-span-2"
          >
            <textarea
              id="additionalRequirements"
              className={control}
              rows={3}
              {...register("additionalRequirements")}
            />
          </Field>
        )}
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="accent-navy mt-1 size-4"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          {...register("consent")}
        />
        <span>
          By submitting this form, you agree that Dune Consulting may use the
          information provided to respond to your{" "}
          {isQuote ? "quote request" : "enquiry"}. Read our{" "}
          <Link
            href="/privacy"
            className="text-navy decoration-amber font-bold underline decoration-2 underline-offset-2"
          >
            privacy policy
          </Link>.
        </span>
      </label>
      {errors.consent && (
        <p id="consent-error" className="mt-1 text-sm text-red-700">
          {isQuote
            ? "Please confirm that we may respond to your quote request."
            : errors.consent.message}
        </p>
      )}

      <div className="mt-5 min-h-14" aria-live="polite" aria-atomic="true">
        {submission.message && (
          <div
            role="status"
            className={[
              "rounded-md border p-4 text-sm",
              submission.kind === "success"
                ? "border-success/40 bg-success/5 text-success"
                : "border-amber/50 bg-amber/10 text-navy",
            ].join(" ")}
          >
            <strong className="block">
              {submission.kind === "success"
                ? isQuote ? "Quote request received" : "Enquiry received"
                : isQuote ? "Quote request not sent" : "Enquiry not received"}
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
        {isSubmitting
          ? isQuote ? "Submitting request…" : "Sending enquiry…"
          : isQuote ? "Request a quote" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  id, label, error, className, children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-navy text-sm font-bold">{label}</label>
      {children}
      {error && <p id={id + "-error"} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
