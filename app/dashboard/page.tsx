import type { Metadata } from "next";
import { logoutMentee } from "@/app/dashboard/actions";
import { MenteeClaimForm } from "@/components/mentee/mentee-claim-form";
import { MenteeProfileForm } from "@/components/mentee/mentee-profile-form";
import { getMenteeDashboardData } from "@/lib/mentorship/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mentee dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const dashboard = await getMenteeDashboardData();
  const displayName =
    dashboard.user?.fullName || dashboard.user?.email || "Mentee";
  const currentStatus = dashboard.enrolment?.status || "Not enrolled";

  return (
    <main id="main-content" className="bg-off-white min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
              Mentee dashboard
            </p>
            <h1 className="text-navy mt-2 text-3xl font-extrabold">
              Welcome back, {displayName}
            </h1>
          </div>
          <form action={logoutMentee}>
            <button
              type="submit"
              className="bg-navy hover:bg-deep-navy rounded-lg px-4 py-2.5 text-sm font-bold text-white"
            >
              Logout
            </button>
          </form>
        </div>

        {!dashboard.linkedApplication || !dashboard.enrolment ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <h2 className="text-navy text-xl font-bold">
              No linked enrolment yet
            </h2>
            <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
              Your account does not have a linked enrolment. Once the team
              accepts your application, a staff member can provide you with
              a private invitation code to link it securely. Matching an email
              address alone never grants access.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Current account</p>
              <p className="mt-2">
                {dashboard.user?.email || "No email on file"}
              </p>
            </div>
            <MenteeClaimForm />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-muted text-xs font-bold tracking-[0.12em] uppercase">
                    Package
                  </p>
                  <p className="text-navy mt-3 text-xl font-extrabold">
                    {dashboard.linkedApplication.selectedPackage ||
                      "Package not recorded"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-muted text-xs font-bold tracking-[0.12em] uppercase">
                    Status
                  </p>
                  <p className="text-navy mt-3 text-xl font-extrabold capitalize">
                    {currentStatus}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-muted text-xs font-bold tracking-[0.12em] uppercase">
                    Cohort
                  </p>
                  <p className="text-navy mt-3 text-base font-extrabold">
                    {dashboard.enrolment.cohortName || "Not assigned"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-muted text-xs font-bold tracking-[0.12em] uppercase">
                    Progress
                  </p>
                  <p className="text-navy mt-3 text-xl font-extrabold">
                    Not tracked yet
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-navy text-xl font-extrabold">
                  Programme overview
                </h2>
                <p className="text-muted mt-2 text-sm leading-6">
                  {dashboard.enrolment.cohortName
                    ? `${dashboard.enrolment.cohortName}. Session dates and schedule have not been published yet.`
                    : "Schedule not published yet."}
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-navy text-lg font-extrabold">Profile</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-muted font-semibold">Name</dt>
                    <dd className="text-navy mt-1 font-medium">
                      {displayName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted font-semibold">Account email</dt>
                    <dd className="text-navy mt-1 font-medium">
                      {dashboard.user?.email || "Not available"}
                      {dashboard.user?.emailVerified
                        ? " (verified)"
                        : " (not verified)"}
                    </dd>
                  </div>
                </dl>
                <MenteeProfileForm name={dashboard.user?.fullName ?? null} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
