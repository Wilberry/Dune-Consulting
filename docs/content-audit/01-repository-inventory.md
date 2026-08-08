# Phase 1: Repository Reconnaissance & Inventory

## 1. Technical Stack

- **Framework**: Next.js 16.2.12 (App Router)
- **Runtime**: Node.js 20.9.0 (required; development uses 18.19.1)
- **Language**: TypeScript 5.9.3
- **Package Manager**: npm (package-lock.json present)
- **React Version**: React 19.2.8
- **Styling**: Tailwind CSS 4.3.3
- **Forms**: React Hook Form 7.84.0, Zod 4.4.3
- **Testing**: Playwright 1.55.1 (E2E), tsx --test (unit)
- **Linting**: ESLint 9.39.1, Prettier 3.6.2
- **Image Processing**: Sharp 0.35.3

## 2. Route Map

### Public Routes (Marketing & Service Routes)

**Collection & Index Routes (4):**

- `/` – Homepage (handled by `app/page.tsx`)
- `/services` – Services overview page (SEO metadata in `data/routes.ts`)
- `/portfolio` – Portfolio / Featured Projects page (SEO metadata in `data/routes.ts`)
- `/contact` – Contact page with consultation form (handled by `app/contact/page.tsx`)

**Detail Pages & Fully Audited Routes (14):**

- `/about` – About Dune Consulting
- `/insights` – Insights / Articles page
- `/mentorship` – HSE Mentorship Programme page
- `/privacy` – Privacy policy page
- `/terms` – Terms of service page
- `/services/event-safety-management` – Event safety detail page (fully audited)
- `/services/hse-training` – HSE training detail page (fully audited)
- `/services/personnel-outsourcing` – Personnel outsourcing detail page (fully audited)

**Portfolio Project Pages (6, inspected for consistency):**

- `/portfolio/jameson-distillery-on-tour`
- `/portfolio/moonshot-by-techcabal`
- `/portfolio/afc-staff-retreat`
- `/portfolio/aproko-nation-fiesta`
- `/portfolio/martell-davido-launch`
- `/portfolio/zedcrest-launchpad`

Note: All 6 projects display "Project details subject to client approval" disclaimer.

**System Routes:**

- `/[...slug]` – Catch-all for unknown routes (404 handling via `app/[...slug]/page.tsx`)

### API Routes

- `POST /api/contact` – Contact form submission endpoint
  - Validates enquiry data using Zod schema
  - Rate-limited (6 requests per IP per hour)
  - Sends email via Resend API (requires `RESEND_API_KEY`)

### Metadata & Discovery

- `/robots.txt` – Robots configuration
- `/sitemap.xml` – Dynamic XML sitemap
- `/manifest.webmanifest` – PWA manifest
- `/apple-icon` – iOS app icon
- `/icon.svg` – Favicon
- `/opengraph-image` – Default OG image

## 3. Page-to-File Map

| Route                               | Component File                                  | Data File(s)                                                                                                  | Purpose                                                                           |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `/`                                 | `app/page.tsx`                                  | `data/page-content.ts`, `data/services.ts`, `data/statistics.ts`, `data/portfolio.ts`, `data/testimonials.ts` | Homepage with hero, services overview, impact, mentorship spotlight, testimonials |
| `/about`                            | `components/pages/about-page.tsx`               | `data/page-content.ts`                                                                                        | Company story, mission, vision, values, approach, industries, leadership          |
| `/services`                         | `components/pages/services-page.tsx`            | `data/services.ts`, `data/page-content.ts`                                                                    | Services overview and navigation                                                  |
| `/services/event-safety-management` | `components/pages/services-page.tsx` (dynamic)  | `data/page-content.ts`                                                                                        | Detailed event safety service page                                                |
| `/services/hse-training`            | `components/pages/services-page.tsx` (dynamic)  | `data/page-content.ts`                                                                                        | Detailed HSE training service page                                                |
| `/services/personnel-outsourcing`   | `components/pages/services-page.tsx` (dynamic)  | `data/page-content.ts`                                                                                        | Detailed HSE outsourcing service page                                             |
| `/mentorship`                       | `components/pages/mentorship-page.tsx`          | `data/page-content.ts`                                                                                        | HSE Mentorship Programme overview, benefits, curriculum                           |
| `/portfolio`                        | `components/pages/portfolio-page.tsx`           | `data/portfolio.ts`                                                                                           | Portfolio / Featured projects overview                                            |
| `/portfolio/[slug]`                 | `components/pages/portfolio-page.tsx` (dynamic) | `data/portfolio.ts`                                                                                           | Individual project detail page                                                    |
| `/insights`                         | `components/pages/insights-page.tsx`            | `data/page-content.ts`                                                                                        | Articles and insights stub                                                        |
| `/contact`                          | `app/contact/page.tsx`                          | `data/company.ts`, `lib/validations.ts`                                                                       | Contact form and enquiry page                                                     |
| `/privacy`                          | `components/pages/legal-page.tsx`               | –                                                                                                             | Privacy policy                                                                    |
| `/terms`                            | `components/pages/legal-page.tsx`               | –                                                                                                             | Terms of service                                                                  |

## 4. Shared Content Components

### Layout Components

- `components/layout/header.tsx` – Navigation, logo, CTA buttons
- `components/layout/footer.tsx` – Footer navigation, contact, social links
- `components/layout/brand.tsx` – Logo and brand assets
- `components/layout/review-banner.tsx` – Preview mode banner

### Page Shells

- `components/ui/page-hero.tsx` – Reusable page hero section
- `components/ui/section.tsx` – Reusable section wrapper
- `components/ui/container.tsx` – Max-width container

### Feature & Content Blocks

- `components/ui/section-heading.tsx` – Eyebrow + title + copy pattern
- `components/ui/feature-grid.tsx` – Grid of feature cards
- `components/ui/feature-item.tsx` – Single feature card
- `components/ui/service-card.tsx` – Service card (4-per-row)
- `components/ui/project-card.tsx` – Project/portfolio card
- `components/ui/stat-card.tsx` – Statistics display card
- `components/ui/process-step.tsx` – Process timeline step
- `components/ui/timeline.tsx` – Process timeline container
- `components/ui/article-card.tsx` – Article/insight card

### Forms & Controls

- `components/forms/consultation-form.tsx` – Main contact/enquiry form
- `components/ui/button.tsx` – CTA button (primary/secondary variants)
- `components/ui/primitives.tsx` – `<Callout>`, `<Quote>`, `<Badge>` components

### Other

- `components/ui/reveal.tsx` – Scroll-triggered reveal animation
- `components/ui/image-placeholder.tsx` – Responsive image container
- `components/ui/breadcrumb.tsx` – Breadcrumb navigation
- `components/ui/accordion.tsx` – Accordion component

### Sections (Homepage-Specific)

- `components/sections/hero.tsx` – Homepage hero
- `components/sections/cta-section.tsx` – Global CTA section
- `components/sections/home-sections.tsx` – All homepage sections:
  - `Clients()` – Trusted organizations
  - `ServicesSection()` – 4-service overview
  - `AboutPreview()` – Company intro
  - `WhyChooseUs()` – Value propositions
  - `Process()` – 6-step process
  - `Impact()` – Statistics
  - `FeaturedProjects()` – Portfolio preview
  - `Mentorship()` – Mentorship CTA section
  - `Testimonials()` – Testimonial section (currently empty)

## 5. Content Data Sources

### Core Data Files

**`data/company.ts`**

- Company name: "Dune Consulting"
- Location: "Lagos, Nigeria"
- Contact phone: `publicEnv.companyPhone`
- Contact email: `publicEnv.companyEmail`
- Website URL: `publicEnv.siteUrl`
- LinkedIn & Instagram URLs

**`data/page-content.ts`** (Primary content source)

- `serviceDetails` – Full service descriptions for:
  - Event Safety Management
  - Tailored HSE Training
  - HSE Personnel Outsourcing
- Service structure includes: overview, audiences, benefits, features, process, FAQs
- `values` – 4 core company values (People first, Practical judgement, Accountability, Partnership)
- `industries` – 4 industry categories served
- `mentorshipBenefits` – 3 mentorship programme benefits
- `articles` – 5 article stubs for Insights page (all with "Publication date pending")
- `aboutApproach` – 3 approach points

**`data/services.ts`**

- `services[]` – 4 core services with descriptions and route links

**`data/routes.ts`**

- Full route definitions with metadata
- 16 supported dynamic routes with SEO metadata
- Note: This represents 16 defined route paths. The full public site includes 18 routes total:
  - 4 collection/index routes: `/` (homepage), `/services`, `/portfolio`, `/contact`
  - 14 detail routes: `/about`, `/insights`, `/mentorship`, `/privacy`, `/terms`, and 3 service detail pages + 6 portfolio project pages
- All routes verified and currently documented in `data/routes.ts`

**`data/statistics.ts`** ⚠️ **DISCREPANCY ALERT**

- Current data: "1,000+ Training Hours", "3,500+ Delegates Trained", "100% Event Safety Regulatory Compliance Rate", "10 Active Projects"
- **Conflicts with brief claims**: 700+ professionals trained, 30+ corporate training sessions, 320+ mentorship registrations
- **Action required**: Verify which figures are correct

**`data/testimonials.ts`**

- Currently empty array
- Note in app: "Client testimonials will be added after approval"

**`data/portfolio.ts`**

- 6 featured event projects with images and descriptions

**`data/navigation.ts`**

- Main navigation: Home, About, Services, Portfolio, HSE Mentorship, Insights, Contact
- Service sub-navigation: Event Safety Management, Tailored HSE Training, HSE Personnel Outsourcing

**`data/images.ts`**

- Image metadata and URLs (not inspected in detail)

## 6. Forms and Conversion Points

### Consultation Form (`components/forms/consultation-form.tsx`)

**Primary form locations:**

- `/contact` page (full form)
- Linked from CTAs throughout site via `#consultation` anchor

**Current fields:**

- `name` (required) – min 2, max 100 chars
- `email` (required) – valid email format
- `phone` (required) – 7–30 chars, alphanumeric + formatting
- `organisation` (optional) – max 150 chars
- `service` (required) – dropdown/select field
- `projectDate` (optional) – max 30 chars
- `location` (optional) – max 200 chars
- `message` (required) – min 10, max 4000 chars
- `consent` (required) – boolean checkbox
- `website` (honeypot) – hidden field for spam detection
- `formStartedAt` – timestamp for rate limiting
- `originPage` – page URL where form was submitted

**Submission:**

- POST to `/api/contact`
- Validated by Zod schema (`lib/validations.ts`)
- Rate limited: 6 requests per IP per hour
- Sends email via Resend API (requires `RESEND_API_KEY` environment variable)
- Success/error messages shown inline
- Form reset on successful submission

**Issues identified:**

- Field labels need review (form text reading "Tell us what support you need. All fields marked * are required.")
- `service` dropdown options unclear (not visible in form component)
- No clear CTA text variation ("Request a consultation" vs other CTAs)

### Button/CTA Locations

| Location            | Text                                  | Link                    | Context              |
| ------------------- | ------------------------------------- | ----------------------- | -------------------- |
| Homepage Hero       | "Request a Consultation"              | `/contact#consultation` | Primary CTA          |
| Homepage Hero       | "Explore Our Services"                | `/services`             | Secondary CTA        |
| Homepage Mentorship | "Explore the Mentorship Programme"    | `/mentorship`           | Service CTA          |
| About Hero          | "Talk to our team"                    | `/contact#consultation` | Page CTA             |
| About Services      | "Explore our services"                | `/services`             | Link CTA             |
| Mentorship Hero     | "Express your interest"               | `/contact#consultation` | Conversion CTA       |
| Throughout          | Various "Learn More", "Explore" links | Various                 | Secondary navigation |

**Observations:**

- CTAs are inconsistent: "Request a Consultation", "Talk to our team", "Express your interest"
- Some buttons use service-specific language, others generic
- No "Request HSE Personnel", "Request Training Proposal", "Plan a Safer Event" variations

## 7. Metadata Implementation

### Root Metadata (`app/layout.tsx`)

**Default title template:**

```
Dune Consulting | HSE Training and Event Safety Management
```

**Default description:**

```
Dune Consulting provides event safety management, tailored HSE training, safety personnel outsourcing and professional HSE mentorship in Nigeria.
```

**Meta configuration:**

- Base URL from `company.websiteUrl`
- Title template: `%s | ${company.name}`
- Robots: Indexed for production, blocked for Vercel previews
- Manifest, icons configured
- OpenGraph: Website type, locale: en_NG
- Twitter card: summary_large_image

### Page-Specific Metadata

**Homepage** (`app/page.tsx`)

- Custom title: "Dune Consulting | HSE Training and Event Safety Management"
- Custom description
- Canonical: `/`
- Structured data: Organization schema with company details

**Other pages** (`data/routes.ts`)
Each route has `title` and `description`, but need to verify if they're being used in page metadata.

**Issues identified:**

- Page titles are descriptive but not optimized for search intent (no LSI keywords)
- Meta descriptions repeat "Dune Consulting" at start
- No structured data observed on service pages, portfolio pages
- No schema for breadcrumbs, FAQ, events

## 8. Content-Related Technical Risks

1. **Statistics Mismatch**
   - Data source conflicts between `data/statistics.ts` and brief claims
   - Risk: Publishing incorrect metrics

2. **Environment Variable Dependency**
   - Contact form requires `RESEND_API_KEY` to send emails
   - Risk: Form silently fails if API key not configured
   - Mitigation: API currently handles unconfigured state gracefully

3. **Empty Testimonials Section**
   - Placeholder shown ("Client testimonials will be added after approval")
   - Risk: Placeholder text visible on production site
   - Note: Intentional per brief (awaiting client approval)

4. **Mentorship Programme Placeholder**
   - Key details marked "awaiting confirmation": dates, format, fees, eligibility, cohort size
   - Risk: CTAs point to form for unconfirmed programme
   - Note: Intentional, marked clearly as awaiting approval

5. **Leadership Profiles Section**
   - "Leadership profiles awaiting approval" visible on About page
   - No founder/lead consultant biography or photo
   - Risk: About page incomplete
   - Note: Intentional placeholder per brief

6. **Article Stubs**
   - Insights page has 5 article titles but all show "Publication date pending"
   - Risk: Page appears incomplete
   - Note: Articles created but not published

7. **Image Placeholders**
   - Multiple images point to `/images/` paths that are placeholders
   - Risk: Broken images on production
   - Mitigation: ImagePlaceholder component handles missing images gracefully

8. **Portfolio Project Descriptions**
   - All include disclaimer: "Project details are subject to client approval"
   - Risk: Legal/confidentiality issue if client objects
   - Note: Intentional protection

## 9. Missing or Inaccessible Content

1. **Detailed Form Service Options**
   - The `service` dropdown in the consultation form doesn't show which options are available
   - Need to determine: Is it free-text or a fixed list?

2. **Form Success/Error Messaging**
   - Error messages shown, but unclear if they're user-friendly or technical

3. **404 Page Copy**
   - Route catches unknown paths but error copy not reviewed

4. **Individual Service Page Structure**
   - Services page uses dynamic routing but page structure for individual services unclear
   - Need to verify all service pages render correctly

5. **Analytics Implementation**
   - No analytics code observed (Google Analytics, Segment, etc.)
   - Risk: No conversion tracking visible
   - Note: May be intentional for privacy

## 10. Recommended Implementation Sequence

### Phase 1 (Reconnaissance) ✓

- [x] Explore repository structure
- [x] Map all routes and pages
- [x] Identify content sources
- [x] Note placeholders and gaps
- [x] Document technical risks

### Phase 2 (Page-by-Page Audit)

- [ ] Audit homepage copy and structure
- [ ] Audit About page positioning
- [ ] Audit Services overview page
- [ ] Audit each service detail page (3 pages)
- [ ] Audit Mentorship programme page
- [ ] Audit Portfolio page and project pages
- [ ] Audit Insights/Articles page
- [ ] Audit Contact page and form
- [ ] Audit footer and shared navigation copy
- [ ] Audit metadata and SEO readiness
- [ ] Check all CTAs and link targets

### Phase 3 (Brand Messaging)

- [ ] Define core brand position
- [ ] Establish messaging pillars
- [ ] Standardize service naming
- [ ] Create approved terminology guide
- [ ] Document CTA hierarchy
- [ ] Establish proof-point rules
- [ ] Define HSE mentorship positioning
- [ ] Define event safety positioning

### Phase 4–14 (Implementation)

- [ ] Update homepage
- [ ] Update About page
- [ ] Restructure Services pages
- [ ] Strengthen HSE Training page
- [ ] Expand Event Safety page
- [ ] Improve Personnel Outsourcing page
- [ ] Update Mentorship content
- [ ] Standardize CTAs and forms
- [ ] Improve metadata and SEO
- [ ] Centralize content where appropriate
- [ ] QA and testing
- [ ] Final report and recommendations

---

## Summary

The Dune Consulting website uses a modern, maintainable Next.js architecture with clear separation of content (data files), components, and pages. Content is centralized in `data/page-content.ts`, making bulk updates feasible. However, several placeholders and gaps are intentional (awaiting client approval) and require verification before publication.

**Key findings for Phase 2:**

1. Statistics discrepancy must be resolved before claiming metrics
2. Mentorship and leadership content requires client confirmation before positioning
3. CTA language and form fields need standardization
4. Service names are consistent across navigation and data, but positioning as consultancy (not training centre) needs reinforcement
5. No significant technical blockers; most issues are content/messaging gaps
