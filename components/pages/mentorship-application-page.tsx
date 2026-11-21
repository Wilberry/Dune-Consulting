import { MentorshipApplicationForm } from "@/components/forms/mentorship-application-form";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";

export function MentorshipApplicationPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="HSE Mentorship Programme"
        title="Apply for mentorship"
        copy="Share your details and preferred package to apply for the Dune Consulting HSE Mentorship Programme."
        image="/images/site_safety_briefing.webp"
        imageAlt="Participants taking part in a Dune Consulting HSE mentorship session"
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <MentorshipApplicationForm />
        </div>
      </Section>
    </main>
  );
}
