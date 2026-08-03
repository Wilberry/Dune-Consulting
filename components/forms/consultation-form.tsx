"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { consultationSchema, type ConsultationInput } from "@/lib/validations";

const fields =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy";
export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationInput>({ resolver: zodResolver(consultationSchema) });
  const onSubmit = () => setSubmitted(true);
  if (submitted)
    return (
      <div
        role="status"
        className="border-success/30 bg-success/5 rounded-xl border p-8"
      >
        <h2 className="text-navy text-2xl font-bold">
          Thank you for your enquiry.
        </h2>
        <p className="text-muted mt-3">
          Form delivery will be activated when the client supplies an approved
          inbox or form endpoint. Please use the contact details on this page in
          the meantime.
        </p>
      </div>
    );
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
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Full name *" error={errors.name?.message}>
          <input className={fields} autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Work email *" error={errors.email?.message}>
          <input
            className={fields}
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
        <Field label="Organisation">
          <input
            className={fields}
            autoComplete="organization"
            {...register("organisation")}
          />
        </Field>
        <Field label="Service required *" error={errors.service?.message}>
          <select className={fields} defaultValue="" {...register("service")}>
            <option value="" disabled>
              Select a service
            </option>
            <option>Event Safety Management</option>
            <option>Tailored HSE Training</option>
            <option>HSE Personnel Outsourcing</option>
            <option>HSE Mentorship Programme</option>
            <option>Other HSE Support</option>
          </select>
        </Field>
        <Field
          className="sm:col-span-2"
          label="How can we help? *"
          error={errors.message?.message}
        >
          <textarea className={fields} rows={5} {...register("message")} />
        </Field>
      </div>
      <button
        disabled={isSubmitting}
        className="bg-amber text-deep-navy hover:bg-amber-hover mt-6 min-h-12 rounded-md px-6 py-3 font-bold disabled:opacity-60"
        type="submit"
      >
        Send enquiry
      </button>
    </form>
  );
}
function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="text-navy text-sm font-bold">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-sm text-red-700">{error}</span>
      )}
    </label>
  );
}
