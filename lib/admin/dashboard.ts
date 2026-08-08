import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StaffUser } from "@/lib/admin/types";

export type DashboardStat = {
  label: string;
  value: number | null;
  href: string;
  restricted?: boolean;
};

export type AdminActivity = {
  id: string;
  type: string;
  title: string;
  status: string;
  createdAt: string;
  href: string;
};

async function checkedCount(
  query: PromiseLike<{
    count: number | null;
    error: { message: string } | null;
  }>,
) {
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getDashboardData(user: StaffUser) {
  const supabase = await createClient();

  const [publishedInsights, draftInsights] = await Promise.all([
    checkedCount(
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
    ),
    checkedCount(
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
    ),
  ]);

  let newEnquiries: number | null = null;
  let newQuotes: number | null = null;
  let newMentorship: number | null = null;
  let subscribers: number | null = null;

  if (user.role === "admin") {
    [newEnquiries, newQuotes, newMentorship, subscribers] = await Promise.all([
      checkedCount(
        supabase
          .from("contact_enquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
      ),
      checkedCount(
        supabase
          .from("quote_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
      ),
      checkedCount(
        supabase
          .from("mentorship_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
      ),
      checkedCount(
        supabase
          .from("newsletter_subscribers")
          .select("id", { count: "exact", head: true })
          .eq("status", "subscribed"),
      ),
    ]);
  }

  const stats: DashboardStat[] = [
    {
      label: "Published Insights",
      value: publishedInsights,
      href: "/admin/insights",
    },
    {
      label: "Draft Insights",
      value: draftInsights,
      href: "/admin/insights",
    },
    {
      label: "New Contact Enquiries",
      value: newEnquiries,
      href: "/admin/enquiries",
      restricted: user.role !== "admin",
    },
    {
      label: "New Quote Requests",
      value: newQuotes,
      href: "/admin/quotes",
      restricted: user.role !== "admin",
    },
    {
      label: "New Mentorship Applications",
      value: newMentorship,
      href: "/admin/mentorship",
      restricted: user.role !== "admin",
    },
    {
      label: "Newsletter Subscribers",
      value: subscribers,
      href: "/admin/newsletter",
      restricted: user.role !== "admin",
    },
  ];

  const activities: AdminActivity[] = [];

  const { data: articles, error: articleError } = await supabase
    .from("articles")
    .select("id,title,status,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (articleError) throw new Error(articleError.message);

  for (const article of articles ?? []) {
    activities.push({
      id: `article-${article.id}`,
      type: "Insight",
      title: article.title,
      status: article.status,
      createdAt: article.created_at,
      href: "/admin/insights",
    });
  }

  if (user.role === "admin") {
    const [enquiriesResult, quotesResult, mentorshipResult] = await Promise.all(
      [
        supabase
          .from("contact_enquiries")
          .select("id,name,service,status,created_at")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("quote_requests")
          .select("id,reference_number,name,status,created_at")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("mentorship_applications")
          .select("id,name,status,created_at")
          .order("created_at", { ascending: false })
          .limit(3),
      ],
    );

    if (enquiriesResult.error) throw new Error(enquiriesResult.error.message);
    if (quotesResult.error) throw new Error(quotesResult.error.message);
    if (mentorshipResult.error) throw new Error(mentorshipResult.error.message);

    for (const enquiry of enquiriesResult.data ?? []) {
      activities.push({
        id: `enquiry-${enquiry.id}`,
        type: "Enquiry",
        title: `${enquiry.name} · ${enquiry.service}`,
        status: enquiry.status,
        createdAt: enquiry.created_at,
        href: "/admin/enquiries",
      });
    }

    for (const quote of quotesResult.data ?? []) {
      activities.push({
        id: `quote-${quote.id}`,
        type: "Quote",
        title: `${quote.reference_number} · ${quote.name}`,
        status: quote.status,
        createdAt: quote.created_at,
        href: "/admin/quotes",
      });
    }

    for (const application of mentorshipResult.data ?? []) {
      activities.push({
        id: `mentorship-${application.id}`,
        type: "Mentorship",
        title: application.name,
        status: application.status,
        createdAt: application.created_at,
        href: "/admin/mentorship",
      });
    }
  }

  activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return { stats, activities: activities.slice(0, 8) };
}

export async function getSectionCount(
  table:
    | "articles"
    | "contact_enquiries"
    | "quote_requests"
    | "mentorship_applications"
    | "newsletter_subscribers",
) {
  const supabase = await createClient();
  return checkedCount(
    supabase.from(table).select("id", { count: "exact", head: true }),
  );
}
