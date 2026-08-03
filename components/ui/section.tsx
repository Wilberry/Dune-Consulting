import { Container } from "./container";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-18 sm:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
