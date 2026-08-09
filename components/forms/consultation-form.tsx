"use client";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  consultationSchema,
  type ConsultationFormInput,
  type ConsultationInput,
} from "@/lib/validations";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message?: string;
};
const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy disabled:opacity-60";

export function ConsultationForm() {
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
  } = useForm<ConsultationFormInput, unknown, ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      consent: false,
      website: "",
      formStartedAt: startedAt,
      originPage: "",
    },
  });

  async function onSubmit(values: ConsultationInput) {
    setSubmission({ kind: "idle" });
    const payload = {
      ...values,
      formStartedAt: startedAt,
      originPage: window.location.href,
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        status: SubmissionState["kind"];
        message: string;
        issues?: Record<string, string[]>;
      };
      if (result.issues)
        Object.entries(result.issues).forEach(([field, messages]) => {
          if (messages?.[0])
            setError(field as keyof ConsultationFormInput, {
              message: messages[0],
            });
        });
      setSubmission({ kind: result.status, message: result.message });
      if (response.ok && result.status === "success")
        reset({
          consent: false,
          website: "",
          formStartedAt: startedAt,
          originPage: "",
        });
    } catch {
      setSubmission({
        kind: "error",
        message:
          "The enquiry service could not be reached. Your information remains in the form so you can try again.",
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
      <h2 className="text-navy text-2xl font-bold">Request a consultation</h2>
      <p className="text-muted mt-2 text-sm">
        Tell us what support you need. All fields marked * are required.
      </p>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
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
        <Field id="organisation" label="Organisation">
          <input
            id="organisation"
            className={control}
            autoComplete="organization"
            {...register("organisation")}
          />
        </Field>
        <Field
          id="service"
          label="Service required *"
          error={errors.service?.message}
        >
          <select
            id="service"
            className={control}
            defaultValue=""
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
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
        <Field id="projectDate" label="Event or project date">
          <input
            id="projectDate"
            className={control}
            type="date"
            {...register("projectDate")}
          />
        </Field>
        <Field id="location" label="Location" className="sm:col-span-2">
          <input
            id="location"
            className={control}
            autoComplete="address-level2"
            {...register("location")}
          />
        </Field>
        <Field
          id="message"
          label="How can we help? *"
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
          information provided to respond to your enquiry. Read our{" "}
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
        <p id="consent-error" className="mt-1 text-sm text-red-700">
          {errors.consent.message}
        </p>
      )}
      <div className="mt-5 min-h-14" aria-live="polite" aria-atomic="true">
        {submission.message && (
          <div
            role="status"
            className={`rounded-md border p-4 text-sm ${submission.kind === "success" ? "border-success/40 bg-success/5 text-success" : "border-amber/50 bg-amber/10 text-navy"}`}
          >
            <strong className="block">
              {submission.kind === "success"
                ? "Enquiry received"
                : "Enquiry not received"}
            </strong>
            <span className="text-muted mt-1 block">{submission.message}</span>
          </div>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="bg-amber text-deep-navy hover:bg-amber-hover mt-2 min-h-12 rounded-md px-6 py-3 font-bold disabled:cursor-wait disabled:opacity-60"
        type="submit"
      >
        {isSubmitting ? "Sending enquiry…" : "Send enquiry"}
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
