import "server-only";

import { createClient } from "@/lib/supabase/server";

export type NewsletterSubscriberStatus = "subscribed" | "unsubscribed";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  firstName: string | null;
  status: NewsletterSubscriberStatus;
  externalContactId: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getNewsletterSubscribers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "id,email,first_name,status,external_contact_id,subscribed_at,unsubscribed_at,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  return (data ?? []).map(
    (subscriber): NewsletterSubscriber => ({
      id: subscriber.id,
      email: subscriber.email,
      firstName: subscriber.first_name,
      status: subscriber.status as NewsletterSubscriberStatus,
      externalContactId: subscriber.external_contact_id,
      subscribedAt: subscriber.subscribed_at,
      unsubscribedAt: subscriber.unsubscribed_at,
      createdAt: subscriber.created_at,
      updatedAt: subscriber.updated_at,
    }),
  );
}
