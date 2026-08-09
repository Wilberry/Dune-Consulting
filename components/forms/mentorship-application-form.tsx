"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  mentorshipApplicationSchema,
  type MentorshipApplicationFormInput,
  type MentorshipApplicationInput,
} from "@/lib/validations";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message?: string;
};

const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy disabled:opacity-60";

export function MentorshipApplicationForm() {
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
  } = useForm<
    MentorshipApplicationFormInput,
    unknown,
    MentorshipApplicationInput
  >({
    resolver: zodResolver(mentorshipApplicationSchema),
    defaultValues: {
      consent: false,
      website: "",
      formStartedAt: startedAt,
    },
  });

  async function onSubmit(values: MentorshipApplicationInput) {
    setSubmission({ kind: "idle" });

    try {
      const response = await fetch("/api/mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          formStartedAt: startedAt,
        }),
      });
      const result = (await response.json()) as {
        status: SubmissionState["kind"];
        message: string;
        issues?: Record<string, string[]>;
      };

      if (result.issues) {
        Object.entries(result.issues).forEach(([field, messages]) => {
          if (messages?.[0]) {
            setError(field as keyof MentorshipApplicationFormInput, {
              message: messages[0],
            });
          }
        });
      }

      setSubmission({ kind: result.status, message: result.message });

      if (response.ok && result.status === "success") {
        reset({
          consent: false,
          website: "",
          formStartedAt: startedAt,
        });
      }
    } catch {
      setSubmission({
        kind: "error",
        message:
          "The application service could not be reached. Your information remains in the form so you can try again.",
      });
    }
  }

  return (
    <form
      id="apply"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="border-line rounded-xl border bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-navy text-2xl font-bold">
        Apply for the HSE Mentorship Program
      </h2>
      <p className="text-muted mt-2 text-sm leading-6">
        Tell us about your current stage and what you want to develop. All
        fields marked * are required.
      </p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="mentorship-website">Website</label>
        <input
          id="mentorship-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input
        type="hidden"
        {...register("formStartedAt", { valueAsNumber: true })}
      />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          id="mentorship-name"
          label="Full name *"
          error={errors.name?.message}
        >
          <input
            id="mentorship-name"
            className={control}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "mentorship-name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          id="mentorship-email"
          label="Email address *"
          error={errors.email?.message}
        >
          <input
            id="mentorship-email"
            className={control}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "mentorship-email-error" : undefined
            }
            {...register("email")}
          />
        </Field>

        <Field
          id="mentorship-phone"
          label="Phone number *"
          error={errors.phone?.message}
        >
          <input
            id="mentorship-phone"
            className={control}
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={
              errors.phone ? "mentorship-phone-error" : undefined
            }
            {...register("phone")}
          />
        </Field>

        <Field id="mentorship-role" label="Current role or occupation">
          <input
            id="mentorship-role"
            className={control}
            autoComplete="organization-title"
            {...register("professionalRole")}
          />
        </Field>

        <Field
          id="mentorship-experience"
          label="Experience level *"
          error={errors.experienceLevel?.message}
        >
          <select
            id="mentorship-experience"
            className={control}
            defaultValue=""
            aria-invalid={!!errors.experienceLevel}
            aria-describedby={
              errors.experienceLevel
                ? "mentorship-experience-error"
                : undefined
            }
            {...register("experienceLevel")}
          >
            <option value="" disabled>
              Select your current stage
            </option>
            <option>Student</option>
            <option>Recent graduate</option>
            <option>Early-career HSE professional</option>
            <option>Transitioning into HSE</option>
            <option>Experienced professional seeking broader HSE context</option>
          </select>
        </Field>

        <Field id="mentorship-education" label="Education or qualifications">
          <input
            id="mentorship-education"
            className={control}
            {...register("education")}
          />
        </Field>

        <Field
          id="mentorship-reason"
          label="Why do you want to join? *"
          error={errors.reasonForApplying?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="mentorship-reason"
            className={control}
            rows={5}
            aria-invalid={!!errors.reasonForApplying}
            aria-describedby={
              errors.reasonForApplying ? "mentorship-reason-error" : undefined
            }
            {...register("reasonForApplying")}
          />
        </Field>

        <Field
          id="mentorship-goals"
          label="What are your HSE career goals? *"
          error={errors.careerGoals?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="mentorship-goals"
            className={control}
            rows={5}
            aria-invalid={!!errors.careerGoals}
            aria-describedby={
              errors.careerGoals ? "mentorship-goals-error" : undefined
            }
            {...register("careerGoals")}
          />
        </Field>

        <Field
          id="mentorship-additional"
          label="Anything else you would like us to know?"
          className="sm:col-span-2"
        >
          <textarea
            id="mentorship-additional"
            className={control}
            rows={4}
            {...register("additionalInformation")}
          />
        </Field>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="accent-navy mt-1 size-4"
          aria-invalid={!!errors.consent}
          aria-describedby={
            errors.consent ? "mentorship-consent-error" : undefined
          }
          {...register("consent")}
        />
        <span>
          By submitting this application, you agree that Dune Consulting may
          review the information provided and contact you about the mentorship
          programme. Read our{" "}
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
        <p id="mentorship-consent-error" className="mt-1 text-sm text-red-700">
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
                ? "Application received"
                : "Application not submitted"}
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
        {isSubmitting ? "Submitting application…" : "Submit application"}
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
