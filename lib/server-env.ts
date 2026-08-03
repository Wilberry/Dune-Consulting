import { z } from "zod";

const emailEnvironmentSchema = z.object({
  RESEND_API_KEY: z.string().min(10),
  CONTACT_RECIPIENT_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
});

export type EmailEnvironment = z.infer<typeof emailEnvironmentSchema>;

export function getEmailEnvironment():
  | { configured: true; values: EmailEnvironment }
  | { configured: false; missing: string[] } {
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.ENABLE_PREVIEW_EMAIL_DELIVERY !== "true"
  )
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
