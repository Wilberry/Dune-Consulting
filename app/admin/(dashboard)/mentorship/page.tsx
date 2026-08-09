import { updateMentorshipStatus } from "@/app/admin/(dashboard)/mentorship/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getMentorshipApplications,
  type MentorshipApplicationStatus,
} from "@/lib/admin/mentorship";

const statuses: { value: MentorshipApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminMentorshipPage() {
  await requireAdminUser();

  let applications: Awaited<ReturnType<typeof getMentorshipApplications>> = [];
  let loadError = false;

  try {
    applications = await getMentorshipApplications();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Programme Applications
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">
            Mentorship Applications
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Review HSE Mentorship Program applications and keep each candidate&apos;s
            progress status current.
          </p>
        </div>
        <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
          <span className="text-muted">Stored applications</span>{" "}
          <strong className="text-navy">{applications.length}</strong>
        </div>
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Mentorship applications could not be loaded. Check the Supabase
          connection and try again.
        </div>
      ) : applications.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No applications yet</h2>
          <p className="text-muted mt-2 text-sm">
            New mentorship applications will appear here after they are recorded
            from the public programme page.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {applications.map((application) => (
            <article
              key={application.id}
              className="border-line rounded-xl border bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-navy text-xl font-extrabold">
                      {application.name}
                    </h2>
                    <span className="bg-off-white text-navy rounded-full px-3 py-1 text-xs font-bold capitalize">
                      {application.status}
                    </span>
                  </div>
                  <p className="text-muted mt-1 text-sm">
                    Received {formatDate(application.createdAt)}
                  </p>

                  <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <dt className="text-muted font-semibold">Email</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${application.email}`}
                          className="text-navy decoration-amber font-semibold underline decoration-2 underline-offset-4"
                        >
                          {application.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Phone</dt>
                      <dd className="text-navy mt-1 font-semibold">
                        {application.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Current role</dt>
                      <dd className="text-navy mt-1">
                        {application.professionalRole || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">
                        Experience level
                      </dt>
                      <dd className="text-navy mt-1">
                        {application.experienceLevel || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">
                        Education / qualifications
                      </dt>
                      <dd className="text-navy mt-1">
                        {application.education || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Last updated</dt>
                      <dd className="text-navy mt-1">
                        {formatDate(application.updatedAt)}
                      </dd>
                    </div>
                  </dl>

                  <div className="bg-off-white mt-5 rounded-lg p-4">
                    <h3 className="text-navy text-sm font-bold">
                      Reason for applying
                    </h3>
                    <p className="text-ink mt-2 text-sm leading-6 whitespace-pre-wrap">
                      {application.reasonForApplying || "Not provided"}
                    </p>
                  </div>

                  <div className="border-line mt-4 rounded-lg border p-4">
                    <h3 className="text-navy text-sm font-bold">Career goals</h3>
                    <p className="text-ink mt-2 text-sm leading-6 whitespace-pre-wrap">
                      {application.careerGoals || "Not provided"}
                    </p>
                  </div>

                  {application.additionalInformation && (
                    <div className="border-line mt-4 rounded-lg border p-4">
                      <h3 className="text-navy text-sm font-bold">
                        Additional information
                      </h3>
                      <p className="text-ink mt-2 text-sm leading-6 whitespace-pre-wrap">
                        {application.additionalInformation}
                      </p>
                    </div>
                  )}
                </div>

                <form
                  action={updateMentorshipStatus}
                  className="border-line bg-off-white w-full rounded-lg border p-4 xl:w-60"
                >
                  <input type="hidden" name="id" value={application.id} />
                  <label
                    htmlFor={`mentorship-status-${application.id}`}
                    className="text-navy text-sm font-bold"
                  >
                    Application status
                  </label>
                  <select
                    id={`mentorship-status-${application.id}`}
                    name="status"
                    defaultValue={application.status}
                    className="border-line text-ink mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-navy hover:bg-deep-navy mt-3 w-full rounded-md px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Save status
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
