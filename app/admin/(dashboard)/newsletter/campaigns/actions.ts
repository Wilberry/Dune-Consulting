"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createAndSendNewsletterBroadcast } from "@/lib/newsletter/provider";
import { createClient } from "@/lib/supabase/server";
import { newsletterCampaignSchema } from "@/lib/validations";

export type NewsletterCampaignActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const campaignIdSchema = z.uuid();

function nullable(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseCampaign(formData: FormData) {
  return newsletterCampaignSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    previewText: formData.get("previewText") || undefined,
    contentHtml: formData.get("contentHtml"),
    contentText: formData.get("contentText") || undefined,
  });
}

export async function saveNewsletterCampaign(
  _previousState: NewsletterCampaignActionState,
  formData: FormData,
): Promise<NewsletterCampaignActionState> {
  const admin = await requireAdminUser();
  const parsed = parseCampaign(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted campaign fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const suppliedId = formData.get("id");
  const parsedId = suppliedId ? campaignIdSchema.safeParse(suppliedId) : null;
  if (suppliedId && !parsedId?.success) {
    return { status: "error", message: "Invalid campaign identifier." };
  }

  const supabase = await createClient();
  const existingId = parsedId?.success ? parsedId.data : null;
  if (existingId) {
    const { data: existing, error: loadError } = await supabase
      .from("newsletter_campaigns")
      .select("status")
      .eq("id", existingId)
      .maybeSingle();

    if (loadError || !existing) {
      return { status: "error", message: "The campaign could not be loaded." };
    }
    if (existing.status === "sending" || existing.status === "sent") {
      return {
        status: "error",
        message: "A sending or sent campaign is locked from editing.",
      };
    }
  }

  const values = parsed.data;
  const payload = {
    name: values.name,
    subject: values.subject,
    preview_text: nullable(values.previewText),
    content_html: values.contentHtml,
    content_text: nullable(values.contentText),
    status: "draft" as const,
    last_error: null,
  };

  let savedId: string;
  if (existingId) {
    const { error } = await supabase
      .from("newsletter_campaigns")
      .update(payload)
      .eq("id", existingId);
    if (error) {
      return { status: "error", message: "The campaign could not be saved." };
    }
    savedId = existingId;
  } else {
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .insert({ ...payload, created_by: admin.id })
      .select("id")
      .single();
    if (error || !data) {
      return {
        status: "error",
        message: "The campaign could not be created.",
      };
    }
    savedId = data.id;
  }

  revalidatePath("/admin/newsletter");
  revalidatePath("/admin/newsletter/campaigns");
  redirect(`/admin/newsletter/campaigns/${savedId}?saved=1`);
}

export async function deleteNewsletterCampaign(formData: FormData) {
  await requireAdminUser();
  const parsedId = campaignIdSchema.safeParse(formData.get("id"));
  if (!parsedId.success) throw new Error("Invalid campaign identifier.");

  const supabase = await createClient();
  const { data: campaign, error: loadError } = await supabase
    .from("newsletter_campaigns")
    .select("status")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (loadError || !campaign) throw new Error("Campaign could not be loaded.");
  if (campaign.status === "sending" || campaign.status === "sent") {
    throw new Error("Sending or sent campaigns cannot be deleted.");
  }

  const { error } = await supabase
    .from("newsletter_campaigns")
    .delete()
    .eq("id", parsedId.data);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/newsletter");
  revalidatePath("/admin/newsletter/campaigns");
}

export async function sendNewsletterCampaign(formData: FormData) {
  await requireAdminUser();
  if (formData.get("confirm") !== "yes") {
    throw new Error("Campaign send confirmation is required.");
  }

  const parsedId = campaignIdSchema.safeParse(formData.get("id"));
  if (!parsedId.success) throw new Error("Invalid campaign identifier.");

  const supabase = await createClient();
  const { data: campaign, error: campaignError } = await supabase
    .from("newsletter_campaigns")
    .select("id,name,subject,preview_text,content_html,content_text,status")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (campaignError || !campaign) throw new Error("Campaign could not be loaded.");
  if (campaign.status !== "draft" && campaign.status !== "failed") return;

  const { data: audience, error: audienceError } = await supabase
    .from("newsletter_subscribers")
    .select("status,external_contact_id,provider_sync_error,deliverability_status");

  if (audienceError) throw new Error("Newsletter audience could not be loaded.");
  const all = audience ?? [];
  const active = all.filter((subscriber) => subscriber.status === "subscribed");
  const eligible = active.filter(
    (subscriber) => subscriber.deliverability_status === "ok",
  );
  const providerPending = all.filter((subscriber) => {
    if (subscriber.provider_sync_error) return true;
    return (
      subscriber.status === "subscribed" &&
      subscriber.deliverability_status === "ok" &&
      !subscriber.external_contact_id
    );
  });

  if (eligible.length === 0) {
    await supabase
      .from("newsletter_campaigns")
      .update({ last_error: "No eligible subscribed recipients are available." })
      .eq("id", campaign.id);
    revalidatePath(`/admin/newsletter/campaigns/${campaign.id}`);
    return;
  }

  if (providerPending.length > 0) {
    await supabase
      .from("newsletter_campaigns")
      .update({
        last_error: `${providerPending.length} subscriber record(s) must finish provider synchronization before sending.`,
      })
      .eq("id", campaign.id);
    revalidatePath(`/admin/newsletter/campaigns/${campaign.id}`);
    return;
  }

  const { data: locked, error: lockError } = await supabase
    .from("newsletter_campaigns")
    .update({
      status: "sending",
      recipient_count: eligible.length,
      last_error: null,
    })
    .eq("id", campaign.id)
    .in("status", ["draft", "failed"])
    .select("id")
    .maybeSingle();

  if (lockError) throw new Error("Campaign send lock could not be acquired.");
  if (!locked) return;

  try {
    const result = await createAndSendNewsletterBroadcast({
      name: campaign.name,
      subject: campaign.subject,
      previewText: campaign.preview_text,
      contentHtml: campaign.content_html,
      contentText: campaign.content_text,
    });

    if (result.status === "unconfigured") {
      await supabase
        .from("newsletter_campaigns")
        .update({
          status: "failed",
          provider_status: "unconfigured",
          last_error: "Newsletter provider configuration is incomplete.",
        })
        .eq("id", campaign.id);
    } else {
      await supabase
        .from("newsletter_campaigns")
        .update({
          status: "sent",
          provider_broadcast_id: result.broadcastId,
          provider_status: "accepted",
          sent_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", campaign.id);
    }
  } catch (error) {
    const providerStatus =
      error && typeof error === "object" && "status" in error
        ? String((error as { status?: unknown }).status || "failed")
        : "failed";
    await supabase
      .from("newsletter_campaigns")
      .update({
        status: "failed",
        provider_status: providerStatus,
        last_error:
          "The email provider did not accept the campaign. Review provider configuration and try again.",
      })
      .eq("id", campaign.id);
  }

  revalidatePath("/admin/newsletter");
  revalidatePath("/admin/newsletter/campaigns");
  revalidatePath(`/admin/newsletter/campaigns/${campaign.id}`);
}
