import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Inbox,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Newspaper,
  PenLine,
  Plus,
  Users,
} from "lucide-react";
import { requireStaffUser } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/admin/dashboard";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statIcon(label: string): LucideIcon {
  if (label.includes("Published")) return Newspaper;
  if (label.includes("Draft")) return PenLine;
  if (label.includes("Contact")) return MessageSquareText;
  if (label.includes("Quote")) return FileText;
  if (label.includes("Mentorship")) return Users;
  return Mail;
}

function activityIcon(type: string): LucideIcon {
  if (type === "Insight") return BookOpen;
  if (type === "Quote") return FileText;
  if (type === "Mentorship") return Users;
  return Inbox;
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (["published", "accepted", "converted", "subscribed"].includes(normalized))
    return "bg-green-50 text-green-800 ring-green-700/10";
  if (["new", "draft", "reviewing", "sending"].includes(normalized))
    return "bg-amber/15 text-deep-navy ring-amber/30";
  if (["failed", "declined", "closed", "unsubscribed"].includes(normalized))
    return "bg-red-50 text-red-700 ring-red-600/10";
  return "bg-off-white text-navy ring-navy/10";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const user = await requireStaffUser();
  const params = await searchParams;

  let dashboard: Awaited<ReturnType<typeof getDashboardData>> | null = null;
  let loadError = false;

  try {
    dashboard = await getDashboardData(user);
  } catch (error) {
    loadError = true;
    console.error(
      "Admin dashboard data failed",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  const firstName = user.fullName?.trim().split(/\s+/)[0] || "there";
  const quickActions = [
    {
      label: "Create Insight",
      href: "/admin/insights/new",
      icon: Plus,
      adminOnly: false,
    },
    {
      label: "Review Enquiries",
      href: "/admin/enquiries",
      icon: MessageSquareText,
      adminOnly: true,
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      adminOnly: true,
    },
  ].filter((action) => !action.adminOnly || user.role === "admin");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="bg-deep-navy relative overflow-hidden rounded-2xl border border-white/10 p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div
          className="bg-amber/10 pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-16 -bottom-28 h-56 w-56 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-amber text-xs font-extrabold tracking-[0.18em] uppercase">
                Dune Administration
              </p>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/80 uppercase">
                {user.role}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Monitor enquiries, manage content and keep Dune Consulting&apos;s
              digital operations moving from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    index === 0
                      ? "bg-amber text-deep-navy hover:bg-amber-hover inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition"
                      : "inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                  }
                >
                  <Icon size={17} aria-hidden="true" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {params.access === "restricted" && (
        <div
          className="border-amber/50 bg-amber/10 text-navy rounded-xl border p-4 text-sm shadow-sm"
          role="status"
        >
          That section is restricted to administrators.
        </div>
      )}

      {loadError ? (
        <div className="border-line rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-navy text-lg font-bold">
            Dashboard data unavailable
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            The admin workspace is available, but Supabase data could not be
            loaded. Check the project environment variables and migration
            status.
          </p>
        </div>
      ) : (
        <>
          <section aria-labelledby="dashboard-stats-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
                  Live Overview
                </p>
                <h2
                  id="dashboard-stats-heading"
                  className="text-navy mt-2 text-2xl font-extrabold"
                >
                  What needs your attention
                </h2>
              </div>
              <p className="text-muted hidden text-sm sm:block">
                Current Supabase records
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dashboard?.stats.map((stat) => {
                const Icon = statIcon(stat.label);
                return (
                  <Link
                    key={stat.label}
                    href={stat.restricted ? "/admin" : stat.href}
                    className={`border-line group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 ${
                      stat.restricted
                        ? "cursor-default opacity-70"
                        : "hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-lg"
                    }`}
                    aria-disabled={stat.restricted}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="bg-off-white text-navy flex size-11 items-center justify-center rounded-xl border border-line">
                        {stat.restricted ? (
                          <LockKeyhole size={19} aria-hidden="true" />
                        ) : (
                          <Icon size={19} aria-hidden="true" />
                        )}
                      </div>
                      {!stat.restricted && (
                        <ArrowRight
                          className="text-muted transition group-hover:translate-x-1 group-hover:text-amber-hover"
                          size={18}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="text-navy mt-6 text-3xl font-extrabold tracking-tight">
                      {stat.restricted ? "Restricted" : (stat.value ?? 0)}
                    </p>
                    <p className="text-muted mt-1 text-sm font-semibold">
                      {stat.label}
                    </p>
                    <div className="bg-amber absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-5 sm:px-6">
                <div>
                  <p className="text-amber-text text-xs font-extrabold tracking-[0.14em] uppercase">
                    Activity
                  </p>
                  <h2 className="text-navy mt-1 text-xl font-extrabold">
                    Recent activity
                  </h2>
                </div>
                <span className="bg-off-white text-muted rounded-full px-3 py-1 text-xs font-bold">
                  Latest {dashboard?.activities.length ?? 0}
                </span>
              </div>

              {dashboard?.activities.length ? (
                <div className="divide-line divide-y">
                  {dashboard.activities.map((activity) => {
                    const Icon = activityIcon(activity.type);
                    return (
                      <Link
                        href={activity.href}
                        key={activity.id}
                        className="group hover:bg-off-white/70 flex items-center gap-4 px-5 py-4 transition sm:px-6"
                      >
                        <div className="bg-off-white text-navy flex size-10 shrink-0 items-center justify-center rounded-xl border border-line transition group-hover:bg-white">
                          <Icon size={17} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-navy truncate text-sm font-bold">
                            {activity.title}
                          </p>
                          <p className="text-muted mt-1 text-xs">
                            {activity.type} · {formatDate(activity.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`hidden w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset sm:inline-flex ${statusClass(activity.status)}`}
                        >
                          {activity.status}
                        </span>
                        <ArrowRight
                          className="text-muted shrink-0 transition group-hover:translate-x-1 group-hover:text-navy"
                          size={17}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-12 text-center sm:px-6">
                  <div className="bg-off-white text-navy mx-auto flex size-12 items-center justify-center rounded-xl border border-line">
                    <Inbox size={20} aria-hidden="true" />
                  </div>
                  <p className="text-navy mt-4 font-bold">No activity yet</p>
                  <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-6">
                    New Insights and public submissions will appear here once
                    records exist.
                  </p>
                </div>
              )}
            </div>

            <aside className="border-line h-fit rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <p className="text-amber-text text-xs font-extrabold tracking-[0.14em] uppercase">
                Workspace
              </p>
              <h2 className="text-navy mt-2 text-xl font-extrabold">
                Common tasks
              </h2>
              <p className="text-muted mt-2 text-sm leading-6">
                Jump straight to the areas you use most often.
              </p>
              <div className="mt-5 space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={`workspace-${action.href}`}
                      href={action.href}
                      className="border-line hover:border-amber/60 hover:bg-off-white group flex items-center gap-3 rounded-xl border px-4 py-3 transition"
                    >
                      <div className="bg-off-white text-navy group-hover:bg-white flex size-9 items-center justify-center rounded-lg">
                        <Icon size={16} aria-hidden="true" />
                      </div>
                      <span className="text-navy flex-1 text-sm font-bold">
                        {action.label}
                      </span>
                      <ArrowRight
                        className="text-muted transition group-hover:translate-x-1 group-hover:text-navy"
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
