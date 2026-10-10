import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClaimForm } from "@/components/mentee/claim-form";
import { MenteeProfileForm } from "@/components/mentee/profile-form";
import { MenteeSignOutButton } from "@/components/mentee/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentee dashboard",
  robots: { index: false, follow: false },
};

const benefits = {
  Foundation: [
    "Five live group sessions and group Q&A",
    "Weekly assignments when published",
    "Scholarship eligibility (not a guaranteed award)",
  ],
  Momentum: [
    "All Foundation benefits",
    "Session recordings when published",
    "Private coaching community when configured",
  ],
  Elevation: [
    "All Momentum benefits",
    "One-to-one mentoring when scheduled",
    "CV and LinkedIn review when available",
    "Follow-up mentoring when scheduled",
  ],
} as const;

type Package = keyof typeof benefits;

function isPackage(value: string | null): value is Package {
  return value === "Foundation" || value === "Momentum" || value === "Elevation";
}

export default async function MenteeDashboardPage() {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return <DashboardError />;
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) redirect("/mentee/login");

  const user = auth.user;
  const [profileResult, enrolmentResult] = await Promise.all([
    supabase.from("profiles").select("full_name,email").eq("id", user.id).maybeSingle(),
    supabase
      .from("mentorship_enrolments")
      .select("id,application_id,cohort_name,created_at")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (profileResult.error || enrolmentResult.error) {
    return <DashboardError />;
  }

  const profile = profileResult.data;
  const enrolment = enrolmentResult.data;
  const fullName = profile?.full_name || user.user_metadata?.full_name || "Mentee";
  let application: { status: string; selected_package: string | null } | null = null;

  if (enrolment) {
    const result = await supabase
      .from("mentorship_applications")
      .select("status,selected_package")
      .eq("id", enrolment.application_id)
      .maybeSingle();
    if (result.error || !result.data) return <DashboardError />;
    application = result.data;
  }

  const accepted = application?.status === "accepted";
  const packageName = application?.selected_package ?? null;

  return (
    <main id="main-content" className="bg-off-white min-h-screen pb-14">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-lg font-extrabold">Dune Consulting</Link>
          <MenteeSignOutButton />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-amber-text text-xs font-extrabold tracking-widest uppercase">
          HSE Mentorship
        </p>
        <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
          Welcome, {fullName}
        </h1>
        <p className="text-muted mt-3 text-sm">
          Signed in as {user.email}. Enrolment information is private to your account.
        </p>

        {!enrolment ? (
          <>
            <div className="border-line mt-8 rounded-xl border bg-white p-6">
              <h2 className="text-navy text-xl font-bold">No linked enrolment yet</h2>
              <p className="text-muted mt-2 leading-7">
                Submitting an application is separate from enrolment. If you have
                applied, staff will review it and contact you. An approved
                application requires a private invitation code to link it here.
                Application details are not exposed through email lookups.
              </p>
              <Link href="/mentorship#apply" className="text-navy mt-4 inline-block font-semibold underline">
                View mentorship application
              </Link>
            </div>
            <ClaimForm />
          </>
        ) : (
          <>
            <section aria-label="Enrolment summary" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Summary title="Application status" value={application?.status ?? "Unavailable"} />
              <Summary title="Selected package" value={packageName ?? "Not recorded"} />
              <Summary title="Assigned cohort" value={enrolment.cohort_name ?? "Not yet assigned"} />
            </section>
            {!accepted && (
              <div className="mt-6 rounded-xl border border-amber-300 bg-white p-5 text-sm">
                Your application is not currently accepted. Programme access is
                unavailable while staff review or update your status.
              </div>
            )}
            {accepted && (
              <section className="mt-7 grid gap-6 lg:grid-cols-2">
                <div className="border-line rounded-xl border bg-white p-6">
                  <h2 className="text-navy text-xl font-bold">Your programme</h2>
                  <p className="text-muted mt-3 leading-7">
                    The mentorship programme is structured over five weeks.
                    Dates, session joining details, resources, and assignments
                    will appear when officially published.
                  </p>
                  <p className="text-muted mt-4 text-sm">
                    No upcoming sessions or resource links have been published in this dashboard.
                  </p>
                </div>
                <div className="border-line rounded-xl border bg-white p-6">
                  <h2 className="text-navy text-xl font-bold">Package benefits</h2>
                  {isPackage(packageName) ? (
                    <>
                      <p className="text-muted mt-2 text-sm">
                        Included in {packageName}; availability depends on official scheduling and publication.
                      </p>
                      <ul className="text-ink mt-4 list-inside list-disc space-y-3 text-sm leading-6">
                        {benefits[packageName].map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-muted mt-3 text-sm">
                      Your historical application has no recorded package.
                      Contact staff to resolve it.
                    </p>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        <section className="border-line mt-7 rounded-xl border bg-white p-6">
          <h2 className="text-navy text-xl font-bold">Your profile</h2>
          <p className="text-muted mt-2 text-sm">
            Email: {profile?.email || user.email}. Your account email, access
            role, package and application status cannot be edited here.
          </p>
          {enrolment ? (
            <MenteeProfileForm fullName={profile?.full_name ?? null} />
          ) : (
            <p className="text-muted mt-4 text-sm">
              Profile editing becomes available after you securely link your enrolment.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function Summary({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-muted text-xs font-bold uppercase">{title}</p>
      <p className="text-navy mt-2 text-lg font-extrabold capitalize">{value}</p>
    </div>
  );
}

function DashboardError() {
  return (
    <main id="main-content" className="bg-off-white flex min-h-screen items-center justify-center p-6">
      <div role="alert" className="border-line max-w-lg rounded-xl border bg-white p-8">
        <h1 className="text-navy text-2xl font-bold">Dashboard unavailable</h1>
        <p className="text-muted mt-3">
          Your account information could not be loaded. Please try again or
          contact Dune Consulting if the issue continues.
        </p>
        <Link href="/mentee/login" className="text-navy mt-5 inline-block font-bold underline">
          Return to sign in
        </Link>
      </div>
    </main>
  );
}
