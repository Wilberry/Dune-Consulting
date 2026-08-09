import { updateEnquiryStatus } from "@/app/admin/(dashboard)/enquiries/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getContactEnquiries,
  type ContactEnquiryStatus,
} from "@/lib/admin/enquiries";

const statuses: { value: ContactEnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatProjectDate(value: string | null) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

export default async function AdminEnquiriesPage() {
  await requireAdminUser();

  let enquiries: Awaited<ReturnType<typeof getContactEnquiries>> = [];
  let loadError = false;

  try {
    enquiries = await getContactEnquiries();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Client Requests
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">
            Contact Enquiries
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Review consultation requests stored from the public website and keep
            each enquiry&apos;s response status current.
          </p>
        </div>
        <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
          <span className="text-muted">Stored enquiries</span>{" "}
          <strong className="text-navy">{enquiries.length}</strong>
        </div>
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Contact enquiries could not be loaded. Check the Supabase connection
          and try again.
        </div>
      ) : enquiries.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No enquiries yet</h2>
          <p className="text-muted mt-2 text-sm">
            New consultation requests will appear here after the public contact
            form records them in Supabase.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {enquiries.map((enquiry) => (
            <article
              key={enquiry.id}
              className="border-line rounded-xl border bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-navy text-xl font-extrabold">
                      {enquiry.name}
                    </h2>
                    <span className="bg-off-white text-navy rounded-full px-3 py-1 text-xs font-bold capitalize">
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-muted mt-1 text-sm">
                    {enquiry.service} · Received {formatDate(enquiry.createdAt)}
                  </p>

                  <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <dt className="text-muted font-semibold">Email</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="text-navy decoration-amber font-semibold underline decoration-2 underline-offset-4"
                        >
                          {enquiry.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Phone</dt>
                      <dd className="text-navy mt-1 font-semibold">
                        {enquiry.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Organisation</dt>
                      <dd className="text-navy mt-1">
                        {enquiry.organisation || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Project date</dt>
                      <dd className="text-navy mt-1">
                        {formatProjectDate(enquiry.projectDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Location</dt>
                      <dd className="text-navy mt-1">
                        {enquiry.location || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Last updated</dt>
                      <dd className="text-navy mt-1">
                        {formatDate(enquiry.updatedAt)}
                      </dd>
                    </div>
                  </dl>

                  <div className="bg-off-white mt-5 rounded-lg p-4">
                    <h3 className="text-navy text-sm font-bold">Enquiry</h3>
                    <p className="text-ink mt-2 whitespace-pre-wrap text-sm leading-6">
                      {enquiry.message}
                    </p>
                  </div>

                  {enquiry.originPage && (
                    <p className="text-muted mt-4 break-all text-xs">
                      Origin: {enquiry.originPage}
                    </p>
                  )}
                </div>

                <form
                  action={updateEnquiryStatus}
                  className="border-line w-full rounded-lg border bg-off-white p-4 xl:w-60"
                >
                  <input type="hidden" name="id" value={enquiry.id} />
                  <label
                    htmlFor={`status-${enquiry.id}`}
                    className="text-navy text-sm font-bold"
                  >
                    Response status
                  </label>
                  <select
                    id={`status-${enquiry.id}`}
                    name="status"
                    defaultValue={enquiry.status}
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
                    className="bg-navy mt-3 w-full rounded-md px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy"
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
