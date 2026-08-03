# Dune Consulting website

Production-ready corporate website foundation for Dune Consulting, a Lagos-based Health, Safety and Environment consultancy. Built with Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide and Framer Motion-ready dependencies.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Editing content

- Navigation and service menu: `data/navigation.ts`
- Company contact, domain and social details: `data/company.ts`
- Approved supporting routes and their metadata: `data/routes.ts`
- Service cards: `data/services.ts`
- Impact figures: `data/statistics.ts`
- Project cards: `data/portfolio.ts`
- Approved testimonials: `data/testimonials.ts`
- Homepage section copy: `components/sections/`
- Contact details: utility bar, footer, contact page and organisation schema in `app/page.tsx`
- Brand colours and global styles: `app/globals.css`

Business content not yet approved is deliberately identified as placeholder content. Replace all `.example` email/domain values and the placeholder telephone number before launch.

## Images required

Supply authorised, web-optimised JPG images using these exact paths. Until supplied, accessible aspect-ratio placeholders preserve the final layout.

- `public/images/hero-event-safety.jpg`
- `public/images/hse-training-session.jpg`
- `public/images/hse-mentorship.jpg`
- `public/images/projects/project-01.jpg`
- `public/images/projects/project-02.jpg`
- `public/images/projects/project-03.jpg`
- `public/images/projects/project-04.jpg`
- `public/images/projects/project-05.jpg`
- `public/images/projects/project-06.jpg`

Approved client logos are also required for Jameson, TechCabal, Africa Finance Corporation, Martell, Zedcrest and Aproko Nation. The current logo strip contains labelled text placeholders and does not reproduce protected artwork.

## Client details required before launch

- Approved website domain and canonical URL
- Telephone number and enquiry email address
- Approved LinkedIn and Instagram profile URLs
- Form delivery endpoint or inbox
- Confirmed project locations and project page copy
- Approved client testimonials
- Privacy policy and terms copy
- Long-form content for supporting pages

No environment variables are currently required, so `.env.example` is intentionally omitted.

Pull requests and pushes to `main` run linting, TypeScript checks, Prettier verification and the production build through `.github/workflows/quality.yml`.
