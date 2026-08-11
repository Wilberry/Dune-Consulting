import { z } from "zod";

const emailEnvironmentSchema = z.object({
  RESEND_API_KEY: z.string().min(10),
  CONTACT_RECIPIENT_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
});

const newsletterProviderEnvironmentSchema = z.object({
  RESEND_API_KEY: z.string().min(10),
  NEWSLETTER_FROM_EMAIL: z.string().trim().min(5).max(320),
  NEWSLETTER_SEGMENT_ID: z.uuid(),
});

const turnstileEnvironmentSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().trim().min(5),
  TURNSTILE_SECRET_KEY: z.string().trim().min(10),
});

const resendWebhookSecretSchema = z.string().trim().min(10);

export type EmailEnvironment = z.infer<typeof emailEnvironmentSchema>;
export type NewsletterProviderEnvironment = z.infer<
  typeof newsletterProviderEnvironmentSchema
>;
export type TurnstileEnvironment = z.infer<typeof turnstileEnvironmentSchema>;

function previewDeliveryBlocked() {
  return (
    process.env.VERCEL_ENV === "preview" &&
    process.env.ENABLE_PREVIEW_EMAIL_DELIVERY !== "true"
  );
}

export function getEmailEnvironment():
  | { configured: true; values: EmailEnvironment }
  | { configured: false; missing: string[] } {
  if (previewDeliveryBlocked())
    return {
      configured: false,
      missing: ["ENABLE_PREVIEW_EMAIL_DELIVERY"],
    };
  const values = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  };
  const result = emailEnvironmentSchema.safeParse(values);
  if (result.success) return { configured: true, values: result.data };
  return {
    configured: false,
    missing: result.error.issues.map((issue) => String(issue.path[0])),
  };
}

export function getNewsletterProviderEnvironment():
  | { configured: true; values: NewsletterProviderEnvironment }
  | { configured: false; missing: string[] } {
  if (previewDeliveryBlocked()) {
    return {
      configured: false,
      missing: ["ENABLE_PREVIEW_EMAIL_DELIVERY"],
    };
  }

  const values = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
    NEWSLETTER_SEGMENT_ID: process.env.NEWSLETTER_SEGMENT_ID,
  };
  const result = newsletterProviderEnvironmentSchema.safeParse(values);
  if (result.success) return { configured: true, values: result.data };
  return {
    configured: false,
    missing: result.error.issues.map((issue) => String(issue.path[0])),
  };
}

export function getTurnstileEnvironment():
  | { status: "disabled" }
  | { status: "misconfigured"; missing: string[] }
  | { status: "configured"; values: TurnstileEnvironment } {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!siteKey && !secretKey) return { status: "disabled" };

  const result = turnstileEnvironmentSchema.safeParse({
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: siteKey,
    TURNSTILE_SECRET_KEY: secretKey,
  });
  if (result.success) return { status: "configured", values: result.data };

  return {
    status: "misconfigured",
    missing: result.error.issues.map((issue) => String(issue.path[0])),
  };
}

export function getResendWebhookSecret() {
  const result = resendWebhookSecretSchema.safeParse(
    process.env.RESEND_WEBHOOK_SECRET,
  );
  return result.success ? result.data : null;
}
