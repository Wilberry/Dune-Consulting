# Mobile Alignment and Main Release Report

**Approval date:** 4 August 2026
**Source:** Direct client instruction

## 1. Asset paths verified
- Header and mobile navigation logo: /images/mainlogo.png
- Footer logo: /images/logo2.png
- Portfolio images:
  - /images/portfolio/jameson-distillery-tour.jpg
  - /images/portfolio/moonshot-techcabal.jpg
  - /images/portfolio/afc-staff-retreat-2026.jpg
  - /images/portfolio/aproko-nation-fiesta.jpg
  - /images/portfolio/martell-davido-launch.jpg
  - /images/portfolio/zedcrest-launchpad-2.jpg

## 2. Portfolio image mapping
- Jameson Distillery on Tour Lagos → /images/portfolio/jameson-distillery-tour.jpg
- Moonshot by TechCabal → /images/portfolio/moonshot-techcabal.jpg
- Africa Finance Corporation Annual Staff Retreat 2026 → /images/portfolio/afc-staff-retreat-2026.jpg
- Aproko Nation Fiesta → /images/portfolio/aproko-nation-fiesta.jpg
- Martell x Davido Launch → /images/portfolio/martell-davido-launch.jpg
- Zedcrest Launchpad 2.0 → /images/portfolio/zedcrest-launchpad-2.jpg

## 3. Logo implementation
- Header and mobile navigation use /images/mainlogo.png through the shared Brand component.
- Footer uses /images/logo2.png through the same component with a footer-specific variant.
- Both logos render as Next.js Image assets with descriptive alt text and preserve transparency.

## 4. Favicon implementation
- Metadata icons use /images/mainlogo.png for icon, shortcut, and Apple touch icon entries.
- The manifest uses /images/mainlogo.png for the app icon.
- No old placeholder or non-approved icon path remains active.

## 5. Service naming updates
- Standardised public content to the four approved service names:
  - HSE Training
  - Event Safety Management
  - HSE Personnel Outsourcing
  - HSE Mentorship Program

## 6. Mobile alignment strategy
- Applied a mobile-first centre-led layout approach for short-form marketing content and hero/page-hero content.
- Retained left alignment for long-form editorial content, form fields, privacy/legal content and complex lists where readability is more important.
- Shared components now default to more balanced mobile alignment while preserving desktop presentation.

## 7. Components changed
- components/layout/brand.tsx
- components/layout/footer.tsx
- components/layout/header.tsx
- components/pages/portfolio-page.tsx
- components/pages/mentorship-page.tsx
- components/sections/home-sections.tsx
- components/ui/image-placeholder.tsx
- components/ui/page-hero.tsx
- components/ui/project-card.tsx
- components/ui/section-heading.tsx
- components/ui/service-card.tsx
- components/ui/feature-item.tsx
- components/ui/stat-card.tsx
- data/portfolio.ts
- data/images.ts
- data/routes.ts
- data/services.ts
- app/layout.tsx
- app/manifest.ts

## 8. Pages inspected
- Homepage
- About page
- Services overview and service detail pages
- Portfolio index and project detail pages
- Mentorship page
- Contact page
- Footer and navigation components

## 9. Mobile exceptions retained
- Form labels, validation messages and consent text remain left-aligned for usability.
- Long editorial copy, timelines, legal content and detailed lists remain left-aligned.

## 10. Placeholder content removed
- Removed active placeholder-style portfolio image fallback behaviour for the approved portfolio entries.
- Removed old service/title variations from active public UI copy.

## 11. Accessibility review
- Logo alt text uses “Dune Consulting”.
- Portfolio artwork alt text uses descriptive event names and avoids generic placeholder language.
- Shared components preserve semantic headings and accessible link labelling.

## 12. QA commands
- npx --yes node@20.9.0 ./node_modules/.bin/eslint .
- npx --yes node@20.9.0 ./node_modules/.bin/tsc --noEmit
- npx --yes node@20.9.0 ./node_modules/.bin/tsx --test tests/*.test.ts
- npx --yes node@20.9.0 ./node_modules/.bin/next build

## 13. Test results
- ESLint: passed
- TypeScript: passed
- Unit tests: 16 passed, 0 failed
- Production build: passed

## 14. Production-build result
- Next.js production build completed successfully under Node 20.9.0.

## 15. Main-branch release details
- Release work was prepared on content/production-positioning-audit and is ready for merge to main.

## 16. Remaining unverified claims
- Unverified portfolio outcomes, attendance figures, testimonials and detailed event narratives remain intentionally excluded from the public site.
