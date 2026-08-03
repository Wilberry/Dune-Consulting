import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
export function CTASection() {
  return (
    <section className="bg-navy relative overflow-hidden py-16 sm:py-20">
      <div className="bg-amber absolute inset-y-0 left-0 w-2" />
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <h2 className="max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            Planning an Event, Training or HSE Project?
          </h2>
          <p className="mt-4 max-w-2xl text-white/70">
            Speak with our team about the safety support, personnel or training
            your organisation requires.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact#consultation">Request a Consultation</Button>
          <Button href="/contact" variant="light">
            Contact Our Team
          </Button>
        </div>
      </Container>
    </section>
  );
}
