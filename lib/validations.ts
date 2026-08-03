import { z } from "zod";

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  organisation: z.string().trim().optional(),
  service: z.string().min(1, "Please select a service."),
  message: z.string().trim().min(10, "Please provide a little more detail."),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
