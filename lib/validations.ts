import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number.")
  .max(30)
  .regex(/^[+()\d\s.-]+$/, "Please enter a valid phone number.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email address.").max(254));

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: emailSchema,
  phone: phoneSchema,
  organisation: z.string().trim().max(150).optional(),
  service: z.string().trim().min(1, "Please select a service.").max(100),
  projectDate: z.string().max(30).optional(),
  location: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please provide a little more detail.")
    .max(4000),
  consent: z.boolean().refine((value) => value, {
    message: "Please confirm that we may respond to your enquiry.",
  }),
  website: z.string().max(0, "Submission rejected."),
  formStartedAt: z.number().int().positive(),
  originPage: z.string().trim().max(500),
});

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  company: z.string().trim().max(150).optional(),
  email: emailSchema,
  phone: phoneSchema,
  service: z.string().trim().min(1, "Please select a service.").max(100),
  location: z.string().trim().max(200).optional(),
  expectedStartDate: z.string().max(30).optional(),
  participantCount: z
    .union([
      z.number().int().min(0).max(1000000),
      z.literal("").transform(() => undefined),
      z.undefined(),
    ])
    .optional(),
  projectDescription: z
    .string()
    .trim()
    .min(20, "Please provide a little more detail about the work required.")
    .max(5000),
  additionalRequirements: z.string().trim().max(3000).optional(),
  consent: z.boolean().refine((value) => value, {
    message: "Please confirm that we may respond to your quote request.",
  }),
  website: z.string().max(0, "Submission rejected."),
  formStartedAt: z.number().int().positive(),
  originPage: z.string().trim().max(500),
});

export const mentorshipApplicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: emailSchema,
  phone: phoneSchema,
  professionalRole: z.string().trim().max(150).optional(),
  experienceLevel: z
    .string()
    .trim()
    .min(1, "Please select your current experience level.")
    .max(100),
  education: z.string().trim().max(300).optional(),
  reasonForApplying: z
    .string()
    .trim()
    .min(20, "Please tell us a little more about why you want to join.")
    .max(4000),
  careerGoals: z
    .string()
    .trim()
    .min(20, "Please tell us a little more about your career goals.")
    .max(4000),
  additionalInformation: z.string().trim().max(3000).optional(),
  consent: z.boolean().refine((value) => value, {
    message:
      "Please confirm that we may review your application and contact you.",
  }),
  website: z.string().max(0, "Submission rejected."),
  formStartedAt: z.number().int().positive(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ConsultationFormInput = z.input<typeof consultationSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type QuoteRequestFormInput = z.input<typeof quoteRequestSchema>;
export type MentorshipApplicationInput = z.infer<
  typeof mentorshipApplicationSchema
>;
export type MentorshipApplicationFormInput = z.input<
  typeof mentorshipApplicationSchema
>;
