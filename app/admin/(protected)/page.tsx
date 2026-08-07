import { StatCard } from "@/components/admin/stat-card";
import { requireStaffUser } from "@/lib/admin-auth";
import { getDashboardStats, getRecentActivity } from "@/lib/admin-dashboard";

export default async function AdminDashboardPage() {
  const staff = await requireStaffUser();
  const [stats, activity] = await Promise.all([
    getDashboardStats(staff.role),
    getRecentActivity(staff.role),
  ]);
  const restricted = staff.role !== "admin";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[.18em] uppercase">
            Administration
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">Dashboard</h1>
          <p className="text-muted mt-2 text-sm">
            Live website and operational information from Supabase.
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Dashboard statistics">
        <StatCard label="Published Insights" value={stats.publishedArticles} href="/admin/insights" />
        <StatCard label="Draft Insights" value={stats.draftArticles} href="/admin/insights" />
        <StatCard label="New Contact Enquiries" value={stats.newEnquiries} href="/admin/enquiries" restricted={restricted} />
        <StatCard label="New Quote Requests" value={stats.newQuotes} href="/admin/quotes" restricted={restricted} />
        <StatCard label="New Mentorship Applications" value={stats.newMentorshipApplications} href="/admin/mentorship" restricted={restricted} />
        <StatCard label="Newsletter Subscribers" value={stats.newsletterSubscribers} href="/admin/newsletter" restricted={restricted} />
      </section>

      <section className="border-line mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-line border-b px-5 py-4">
          <h2 className="text-navy text-lg font-extrabold">Recent activity</h2>
          <p className="text-muted mt-1 text-sm">Newest records available to your role.</p>
        </div>
        {activity.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-navy font-bold">No activity yet</p>
            <p className="text-muted mt-1 text-sm">New submissions and Insights will appear here.</p>
          </div>
        ) : (
          <ul className="divide-line divide-y">
            {activity.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-navy text-sm font-bold">{item.title}</p>
                  <p className="text-muted mt-1 text-xs">{item.meta}</p>
                </div>
                <time className="text-muted text-xs" dateTime={item.createdAt}>
                  {new Intl.DateTimeFormat("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Africa/Lagos",
                  }).format(new Date(item.createdAt))}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
