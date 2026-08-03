import { PageHero } from "@/components/ui/page-hero";
import { Callout } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  const title = privacy ? "Privacy Policy" : "Website Terms";
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Website Information"
        title={title}
        copy={`${title} content is awaiting client and legal approval before publication.`}
        breadcrumbs={[{ label: title }]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Callout title="Approved legal copy required">
            <p>
              This page is intentionally reserved for final legal text. No
              policy, commitment or legal term has been invented on behalf of
              Dune Consulting.
            </p>
          </Callout>
          <div className="text-muted mt-10 space-y-8 leading-7">
            <section>
              <h2 className="text-navy text-2xl font-extrabold">
                Content status
              </h2>
              <p className="mt-3">
                Provide reviewed{" "}
                {privacy
                  ? "privacy and data-processing information"
                  : "website usage terms"}{" "}
                before the site is launched publicly.
              </p>
            </section>
            <section>
              <h2 className="text-navy text-2xl font-extrabold">
                Last updated
              </h2>
              <p className="mt-3">
                To be confirmed with the approved legal copy.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
