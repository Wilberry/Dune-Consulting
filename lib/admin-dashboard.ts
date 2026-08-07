import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/lib/admin-auth";

export type DashboardStats = {
  publishedArticles: number;
  draftArticles: number;
  newEnquiries: number | null;
  newQuotes: number | null;
  newMentorshipApplications: number | null;
  newsletterSubscribers: number | null;
};

export type ActivityItem = {
  id: string;
  type: "article" | "enquiry" | "quote" | "mentorship" | "newsletter";
  title: string;
  meta: string;
  createdAt: string;
};

async function exactCount(
  table: "articles" | "contact_enquiries" | "quote_requests" | "mentorship_applications" | "newsletter_subscribers",
  filters: Record<string, string> = {},
) {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getDashboardStats(role: StaffRole): Promise<DashboardStats> {
  const [publishedArticles, draftArticles] = await Promise.all([
    exactCount("articles", { status: "published" }),
    exactCount("articles", { status: "draft" }),
  ]);

  if (role !== "admin") {
    return {
      publishedArticles,
      draftArticles,
      newEnquiries: null,
      newQuotes: null,
      newMentorshipApplications: null,
      newsletterSubscribers: null,
    };
  }

  const [newEnquiries, newQuotes, newMentorshipApplications, newsletterSubscribers] =
    await Promise.all([
      exactCount("contact_enquiries", { status: "new" }),
      exactCount("quote_requests", { status: "new" }),
      exactCount("mentorship_applications", { status: "new" }),
      exactCount("newsletter_subscribers", { status: "subscribed" }),
    ]);

  return {
    publishedArticles,
    draftArticles,
    newEnquiries,
    newQuotes,
    newMentorshipApplications,
    newsletterSubscribers,
  };
}

export async function getRecentActivity(role: StaffRole): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const articlePromise = supabase
    .from("articles")
    .select("id,title,status,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (role !== "admin") {
    const { data, error } = await articlePromise;
    if (error) throw error;
    return (data ?? []).map((item) => ({
      id: item.id,
      type: "article" as const,
      title: item.title,
      meta: `Insight · ${item.status}`,
      createdAt: item.created_at,
    }));
  }

  const [articles, enquiries, quotes, mentorship, newsletter] = await Promise.all([
    articlePromise,
    supabase
      .from("contact_enquiries")
      .select("id,name,service,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("quote_requests")
      .select("id,reference_number,name,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("mentorship_applications")
      .select("id,name,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("newsletter_subscribers")
      .select("id,email,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const firstError = [articles, enquiries, quotes, mentorship, newsletter].find(
    (result) => result.error,
  )?.error;
  if (firstError) throw firstError;

  const activity: ActivityItem[] = [
    ...(articles.data ?? []).map((item) => ({
      id: item.id,
      type: "article" as const,
      title: item.title,
      meta: `Insight · ${item.status}`,
      createdAt: item.created_at,
    })),
    ...(enquiries.data ?? []).map((item) => ({
      id: item.id,
      type: "enquiry" as const,
      title: item.name,
      meta: `Contact enquiry · ${item.service}`,
      createdAt: item.created_at,
    })),
    ...(quotes.data ?? []).map((item) => ({
      id: item.id,
      type: "quote" as const,
      title: item.reference_number,
      meta: `Quote request · ${item.name}`,
      createdAt: item.created_at,
    })),
    ...(mentorship.data ?? []).map((item) => ({
      id: item.id,
      type: "mentorship" as const,
      title: item.name,
      meta: `Mentorship application · ${item.status}`,
      createdAt: item.created_at,
    })),
    ...(newsletter.data ?? []).map((item) => ({
      id: item.id,
      type: "newsletter" as const,
      title: item.email,
      meta: `Newsletter · ${item.status}`,
      createdAt: item.created_at,
    })),
  ];

  return activity
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 8);
}
