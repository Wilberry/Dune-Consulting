import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireStaffUser } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/admin/dashboard";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Dune Administration
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
            Dashboard
          </h1>
          <p className="text-muted mt-2">
            Operational overview for website content and incoming requests.
          </p>
        </div>
        <p className="text-muted text-sm">Signed in as {user.role}</p>
      </div>

      {params.access === "restricted" && (
        <div
          className="border-amber/50 bg-amber/10 text-navy mt-6 rounded-lg border p-4 text-sm"
          role="status"
        >
          That section is restricted to administrators.
        </div>
      )}

      {loadError ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-6">
          <h2 className="text-navy text-lg font-bold">
            Dashboard data unavailable
          </h2>
          <p className="text-muted mt-2 text-sm leading-6">
            The admin shell is working, but Supabase data could not be loaded.
            Check the project environment variables and migration status.
          </p>
        </div>
      ) : (
        <>
          <section
            className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Dashboard statistics"
          >
            {dashboard?.stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.restricted ? "/admin" : stat.href}
                className="border-line group rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
                aria-disabled={stat.restricted}
              >
                <p className="text-muted text-sm font-semibold">{stat.label}</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-navy text-3xl font-extrabold">
                    {stat.restricted ? "Restricted" : (stat.value ?? 0)}
                  </p>
                  {!stat.restricted && (
                    <ArrowRight
                      className="text-amber-hover transition-transform group-hover:translate-x-1"
                      size={19}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Link>
            ))}
          </section>

          <section className="border-line mt-8 overflow-hidden rounded-xl border bg-white">
            <div className="border-line border-b px-5 py-4 sm:px-6">
              <h2 className="text-navy text-xl font-bold">Recent activity</h2>
              <p className="text-muted mt-1 text-sm">
                Newest records available to your role.
              </p>
            </div>
            {dashboard?.activities.length ? (
              <div className="divide-line divide-y">
                {dashboard.activities.map((activity) => (
                  <Link
                    href={activity.href}
                    key={activity.id}
                    className="hover:bg-off-white flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div>
                      <p className="text-navy text-sm font-bold">
                        {activity.title}
                      </p>
                      <p className="text-muted mt-1 text-xs">
                        {activity.type} · {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    <span className="bg-off-white text-navy w-fit rounded-full px-3 py-1 text-xs font-bold capitalize">
                      {activity.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-navy font-bold">No activity yet</p>
                <p className="text-muted mt-2 text-sm">
                  New articles and submissions will appear here once records
                  exist.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
