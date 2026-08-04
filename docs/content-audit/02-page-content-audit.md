# Phase 2: Page-by-Page Content Audit

## Audit Methodology

Each page is rated 1–5 on these dimensions:
- **Positioning** (1–5): Does the page correctly position Dune as a HSE consultancy, not just a training centre?
- **Clarity** (1–5): Is the message clear to the target audience?
- **Credibility** (1–5): Does the content feel authoritative and professional?
- **Usefulness** (1–5): Does the page answer visitor questions and guide next steps?
- **Conversion Strength** (1–5): Does it motivate action (inquiry, booking, sign-up)?
- **SEO Readiness** (1–5): Is it optimized for search intent?
- **Consistency** (1–5): Does it align with brand voice and service naming?
- **Factual Confidence** (1–5): Are claims verifiable and supported?

**Severity scale:**
- **Critical**: Blocks functionality, exposes risk, violates compliance
- **High**: Damages credibility, confuses positioning, weakens conversion
- **Medium**: Minor inconsistency, suboptimal wording, incomplete information
- **Low**: Typographical, styling, or future-proofing considerations

---

## 1. HOMEPAGE (`/`)

**Route Purpose:** First impression; communicate value proposition, service overview, proof points, and call-to-action.

**Target Audience:** Events organisers, corporate safety managers, HR leaders, project teams.

### Current Content Structure

```
1. Hero section
   - Eyebrow: "HEALTH, SAFETY & ENVIRONMENT"
   - H1: "Protecting People. [Protecting Your Business.]"
   - Supporting copy: Multi-sentence about practical solutions
   - CTAs: "Request a Consultation" | "Explore Our Services"
   - Sub-bullets: 3 trust points

2. Clients section
   - "Trusted on Events and Projects Across Nigeria"
   - 6 client name placeholders (Jameson, TechCabal, AFC, Martell, Zedcrest, Aproko Nation)

3. Services section
   - Eyebrow: "What We Do"
   - H2: "Complete HSE Support, From Planning to Execution"
   - Copy: Multi-sentence about combining services
   - 4 service cards

4. About Preview
   - Eyebrow: "About Dune Consulting"
   - H2: "Practical Safety Systems That Work in the Real World"
   - 2-paragraph copy + 4 bullet points
   - Image + callout box

5. Why Choose Us
   - "Why Choose Dune"
   - 4-point feature list

6. Process section
   - Eyebrow: "How We Work"
   - H2: "A Clear Process for Safer Events"
   - 6-step visual timeline (Consult, Assess, Plan, Deploy, Monitor, Report)

7. Impact section
   - "Our Impact"
   - 4 statistics cards

8. Featured Projects
   - "Our Work: Selected Events and Projects"
   - 3 project cards + "View all" link
   - Link to `/portfolio`

9. Mentorship section
   - Image + callout
   - "HSE Mentorship Programme"
   - H2: "Build Practical Skills for a Career in HSE"
   - 3 benefit points
   - CTA: "Explore the Mentorship Programme"

10. Testimonials section
    - "Client Feedback: Trusted Partnerships, Measurable Care"
    - Placeholder: "Client testimonials will be added after approval"

11. CTA section
    - Final call-to-action (likely "Get in touch")
```

### Audit Findings

#### Positioning: **3/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Mixed positioning signals**
- File: `components/sections/hero.tsx`
- Current H1: "Protecting People. Protecting Your Business."
- Current intro copy: "...delivers practical Health, Safety and Environment solutions for events, workplaces and projects."
- Problem: Hero emphasizes compliance/protection but doesn't establish "consultancy" identity distinctly. Reads defensive rather than consultancy-led.
- Recommended direction: Lead with consultancy positioning; then detail capabilities.
- Proposed hero (optional reference):
  ```
  Eyebrow: HEALTH, SAFETY AND ENVIRONMENT CONSULTING
  H1: Safer Workplaces. Safer Events. Stronger HSE Teams.
  Copy: Dune Consulting helps organizations protect people, reduce risk and strengthen safety performance through practical HSE training, event safety management and competent outsourced professionals.
  ```
- Client verification required: Confirm if this positioning shift is acceptable.

**Issue 2: Services presented as equal rather than tiered**
- File: `components/sections/home-sections.tsx` (ServicesSection)
- Current copy: "Complete HSE Support, From Planning to Execution"
- Problem: Doesn't distinguish core services (4) from supporting capabilities. Mentorship appears as service #4, but should be distinct (professional development, not commercial).
- Recommended: Clarify that mentorship is a professional development programme, separate from commercial consulting.

**Issue 3: No business case or outcome-focused messaging**
- File: `components/sections/home-sections.tsx` (WhyChooseUs)
- Current "Why Choose Us" points focus on process/approach, not outcomes.
- Problem: Doesn't answer "Why should I hire Dune vs. an internal safety team or another consultancy?"
- Recommended: Add outcome-focused language (cost, time, risk reduction, compliance certainty).

#### Clarity: **3.5/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Vague opening paragraph**
- File: `components/sections/hero.tsx`
- Current: "Dune Consulting delivers practical Health, Safety and Environment solutions for events, workplaces and projects. From planning and training to personnel deployment and emergency coordination, we help organisations operate safely and confidently."
- Problem: Reads generic. "Solutions" and "operate safely" are clichés. Two long sentences; first 23 words before naming any service.
- Recommended: Lead with consultancy identity, follow with concise service list.

**Issue 2: Repeating intro text in multiple locations**
- File: `components/sections/home-sections.tsx` (AboutPreview)
- Current: "Dune Consulting is a Lagos-based Health, Safety and Environment consultancy supporting organisations, event producers and project teams with practical risk-management solutions."
- Problem: Variation of hero copy; doesn't add clarity, feels repetitive.
- Recommended: Use single, agreed company description across all pages.

**Issue 3: Process section language unclear for non-HSE audiences**
- File: `components/sections/home-sections.tsx` (Process)
- Current copy for each step is one short sentence (e.g., "We understand the event, venue, audience and operational requirements").
- Problem: For first-time visitors unfamiliar with HSE, steps may feel abstract.
- Recommended: Add one-line outcome for each step (e.g., "Consult → Understand → Clear plan").

#### Credibility: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Empty testimonials section weakens credibility**
- File: `components/sections/home-sections.tsx` (Testimonials)
- Current: "Client testimonials will be added after approval."
- Problem: Placeholder visible on production homepage. Signals incompleteness or lack of client confidence.
- Recommended: Either populate with approved testimonials or replace with proof points (e.g., "700+ professionals trained", "30+ organisations served").
- Note: Intentional per brief; but consider moving to secondary credibility signals.

**Issue 2: Statistics don't align with brief claims**
- File: `data/statistics.ts`
- Current: "1,000+ Training Hours Delivered", "3,500+ Delegates Trained", "100% Event Safety Regulatory Compliance Rate", "10 Active Projects"
- Brief claims: "700+ professionals trained", "30+ corporate training sessions", "320+ mentorship registrations", "18 countries", "4 continents", "3 ISO scholarships", "₦600,000 scholarship value"
- Problem: Complete mismatch. Website stats are old or incorrect. Brief stats are missing.
- Severity: **CRITICAL** – Must verify which figures are accurate before publication.
- Recommended: Replace with verified figures from brief (700+, 30+, 320+, 18 countries, 4 continents) or request current verified data.

**Issue 3: No founder/leader profile visible**
- File: `components/pages/about-page.tsx`
- Current: "Leadership profiles awaiting approval"
- Problem: Founder/lead consultant is missing. Reduces credibility (no face, name, or bio).
- Recommended: Add Anthony Igbinosun profile (Lead Consultant, HSE professional, trainer, mentor) with verified credentials only.

**Issue 4: Client logos are text placeholders**
- File: `components/sections/home-sections.tsx` (Clients)
- Current: 6 text names (Jameson, TechCabal, AFC, Martell, Zedcrest, Aproko Nation)
- Problem: No logo images; feels less credible than actual client logos.
- Recommended: Source actual client logos or use actual client names only if logos unavailable.

#### Usefulness: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No clear next step for different visitor types**
- File: Entire homepage
- Problem: All CTAs default to "Request a Consultation". No differentiation for visitor intent (e.g., "Browse our training courses", "See event safety examples", "Learn about mentorship").
- Recommended: Provide multiple CTAs: "Discuss Your HSE Needs", "Explore Event Safety", "Learn About Mentorship Programme", "Explore Training Options".

**Issue 2: About preview doesn't answer who Dune is**
- File: `components/sections/home-sections.tsx` (AboutPreview)
- Current copy: Talks about approach but doesn't answer "What experience do they have?"
- Problem: Visitors don't learn about company age, team size, or track record.
- Recommended: Add brief credibility statement (e.g., "For [X] years, Dune has..." or "Dune has supported...").

**Issue 3: Industries served not visible on homepage**
- File: `components/pages/about-page.tsx` only
- Current: Industries listed only on About page
- Problem: Visitor may not know if Dune serves their industry.
- Recommended: Add small "Industries" section to homepage (4 industries) or show in services cards.

#### Conversion Strength: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Primary CTA is generic**
- File: `components/sections/hero.tsx`
- Current CTA: "Request a Consultation"
- Problem: "Consultation" is vague. Doesn't specify outcome.
- Recommended: "Discuss Your HSE Needs" or "Plan Your Project's Safety"

**Issue 2: Secondary CTA doesn't convert**
- File: `components/sections/hero.tsx`
- Current: "Explore Our Services"
- Problem: Exploration doesn't convert. Better to offer immediate value.
- Recommended: "See How We Help" or "Explore Solutions"

**Issue 3: Mentorship CTA unclear**
- File: `components/sections/home-sections.tsx` (Mentorship)
- Current: "Explore the Mentorship Programme"
- Problem: Doesn't specify action (Apply? Register? Learn more?).
- Recommended: "Express Your Interest" (as mentioned in brief) or "Join the Next Cohort"

**Issue 4: No urgency or scarcity messaging**
- File: Entire homepage
- Current: No time-sensitive elements (e.g., "Cohort opens in [month]", "Limited spots", "Next intake: [date]")
- Problem: Reduces conversion pressure.
- Recommended: Add programme dates and application windows where known.

#### SEO Readiness: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Meta description is generic**
- File: `app/layout.tsx`
- Current: "Dune Consulting provides event safety management, tailored HSE training, safety personnel outsourcing and professional HSE mentorship in Nigeria."
- Problem: 157 chars; includes company name and all services, but lacks search intent alignment. No call-to-action in description.
- Recommended: Focus on primary search intent (e.g., "HSE Training and Event Safety Management in Lagos, Nigeria. Practical solutions for workplace and event safety.")

**Issue 2: H1 is brand claim, not keyword-focused**
- File: `components/sections/hero.tsx`
- Current H1: "Protecting People. Protecting Your Business."
- Problem: Brand positioning, not search-optimized. Missing primary keywords (HSE, training, safety, consulting).
- Recommended: "Safer Workplaces. Safer Events. Stronger HSE Teams." (includes HSE, workplaces, events)

**Issue 3: No LSI keywords in copy**
- File: Entire homepage
- Problem: Copy mentions "solutions", "support", "services" but rarely includes related terms (HSE training, workplace safety, event risk assessment, consulting, personnel).
- Recommended: Naturally weave in LSI variants (safety management, risk management, HSE professionals, training courses, events).

**Issue 4: No breadcrumb or internal linking strategy visible**
- File: Homepage sections
- Problem: No clear internal link hierarchy (e.g., "HSE Training" → training page → specific course).
- Recommended: Add contextual internal links in each service preview card.

**Issue 5: Open Graph image not customized**
- File: `app/opengraph-image.tsx`
- Current: Default OG image
- Problem: When shared on social media, no Dune branding/positioning visible.
- Recommended: Create branded OG image with logo, key message, imagery.

#### Consistency: **4/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service names vary slightly**
- File: Multiple
- Current: "Tailored HSE Training" (services.ts) vs "HSE Training" (navigation)
- Problem: Minor inconsistency.
- Recommended: Use "HSE Training" or "Tailored HSE Training" consistently.

**Issue 2: Font/styling inconsistency in copy blocks**
- File: Various sections
- Current: Eyebrows (amber, caps, small font) are consistent, but body copy sizing varies.
- Problem: Minor visual inconsistency.
- Recommended: Audit and standardize body font sizes.

#### Factual Confidence: **2/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: Statistics unverified**
- File: `data/statistics.ts`
- Current: "1,000+ Training Hours", "3,500+ Delegates", "100% Compliance Rate", "10 Active Projects"
- Problem: No source or verification visible. Conflicts with brief.
- Severity: **CRITICAL** – Must verify before publishing.
- Recommended: Replace with verified figures from brief or request current data.

**Issue 2: Client names not verified**
- File: `components/sections/home-sections.tsx`
- Current: 6 client names listed (Jameson, TechCabal, AFC, Martell, Zedcrest, Aproko Nation)
- Problem: No logos; unclear if clients approved inclusion.
- Severity: **HIGH** – Must verify client approval before publication.
- Recommended: Confirm each client's permission to be listed.

**Issue 3: No founder credentials visible**
- File: Homepage (missing)
- Problem: Founder/leader identity not established.
- Recommended: Add Anthony Igbinosun profile with verified credentials (Lead Consultant, HSE professional, trainer, mentor).

**Issue 4: Mentorship programme details placeholder**
- File: Mentorship section
- Current: No dates, application status, fees, or cohort info
- Problem: CTA points to form for unconfirmed programme.
- Severity: **HIGH** – Needs client confirmation before conversion.
- Recommended: Mark section "Cohort details coming soon" or move CTA to "Register interest" only.

---

## 2. ABOUT PAGE (`/about`)

**Route Purpose:** Establish company credibility, story, values, approach, and expertise.

**Target Audience:** Prospect evaluators; organizations vetting Dune as partner.

### Current Content Structure

```
1. Page Hero
   - Eyebrow: "About Dune Consulting"
   - H1: "Safety expertise grounded in the realities of your operation."
   - Copy: Multi-sentence about HSE support
   - CTA: "Talk to our team" → `/contact#consultation`

2. Our Story section
   - Eyebrow: "Our Story"
   - H2: "Built to make safety useful, visible and workable"
   - 3-paragraph copy about gap between documentation and delivery
   - Quote: "Protecting People. Protecting Your Business."

3. Mission & Vision (Callout boxes)
   - Mission: "To provide practical HSE solutions that protect people, support compliance and help organisations deliver work and experiences confidently."
   - Vision: "To be a trusted reference for dependable, human-centred safety delivery across Nigeria and beyond."

4. What Guides Us (Values)
   - 4 values: People first, Practical judgement, Accountability, Partnership

5. Our Approach (6-step timeline)
   - Consult → Assess → Plan → Deploy → Monitor → Report
   - Each step includes copy

6. Why Dune Consulting
   - H2: "Professional standards. Practical delivery. Human awareness."
   - 5 bullet points about approach

7. Industries We Serve
   - 4 industry categories: Events & entertainment, Corporate workplaces, Projects & field operations, Professional development

8. Leadership section
   - H2: "Responsible leadership, demonstrated through delivery"
   - Copy: "Approved leadership profiles, portraits and professional biographies will be added after client confirmation."
   - Callout: "Leadership profiles awaiting approval"

9. CTA section (global)
```

### Audit Findings

#### Positioning: **3/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Story emphasizes problem (gap) over solution (consultancy)**
- File: `components/pages/about-page.tsx`
- Current: "...created to close the gap between safety documentation and safe delivery."
- Problem: Opening positions Dune as fixing a broken process, not as a proactive consultancy.
- Recommended: Lead with what Dune does, then position as solving the documentation-delivery gap.

**Issue 2: Company age, team size, experience not stated**
- File: About page (missing)
- Current: No founding date, team size, years in operation, or track record mentioned.
- Problem: Visitor can't assess company maturity or credibility quickly.
- Recommended: Add "Founded [year]", "Team of [X] professionals", or "Supporting organizations since [year]".

**Issue 3: HSE training emphasized in values/approach, not as secondary to consulting**
- File: `data/page-content.ts` (values, industries, approach)
- Current: Training and professional development listed equally with event safety and outsourcing.
- Problem: Doesn't distinguish core consultancy from training delivery.
- Recommended: Reorder services by strategic importance; position training as capability, not identity.

#### Clarity: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Mission statement is long and abstract**
- File: `components/pages/about-page.tsx`
- Current: "To provide practical HSE solutions that protect people, support compliance and help organisations deliver work and experiences confidently."
- Problem: 27 words; "solutions" is vague; "work and experiences" is abstract.
- Recommended: Shorter, clearer: "To help organizations protect people, reduce risk and strengthen safety performance through practical HSE expertise."

**Issue 2: Vision statement is vague ("trusted reference")**
- File: `components/pages/about-page.tsx`
- Current: "To be a trusted reference for dependable, human-centred safety delivery across Nigeria and beyond."
- Problem: "Trusted reference" is abstract; "human-centred" is marketing-speak.
- Recommended: More concrete: "To be the go-to HSE consultancy for practical, people-focused safety delivery in Nigeria and across Africa."

**Issue 3: Industries listed but not explained**
- File: `components/pages/about-page.tsx`
- Current: 4 industry categories with one-line copy each.
- Problem: No explanation of why Dune serves each or what specific challenges are solved.
- Recommended: Add context (e.g., "Events & Entertainment → Crowd safety, emergency coordination, on-site supervision").

#### Credibility: **2.5/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: No leadership profile visible**
- File: `components/pages/about-page.tsx`
- Current: "Leadership profiles awaiting approval"
- Problem: Founder/lead consultant missing entirely. Reduces credibility significantly.
- Severity: **CRITICAL** – Founder name, photo, credentials essential for credibility.
- Recommended: Add Anthony Igbinosun profile with verified credentials (Lead Consultant, HSE professional, trainer, mentor).

**Issue 2: No company age or track record stated**
- File: About page (missing)
- Current: No founding date, years in operation, or "supported X organizations" statement.
- Problem: Credibility gap; visitor can't assess company maturity.
- Recommended: Add founding context and experience statement (e.g., "Since [year]", "Supported [X] events").

**Issue 3: No certifications or accreditations visible**
- File: About page (missing)
- Current: No ISO certifications, industry memberships, or regulatory recognition mentioned.
- Problem: Professional services require credibility signals.
- Recommended: If accredited (ISO, professional memberships, etc.), add them. If not, don't fabricate; instead highlight proven track record.

**Issue 4: No client case studies or testimonials**
- File: About page
- Current: No real examples of impact or client outcomes.
- Problem: Without proof, claims feel unsupported.
- Recommended: Add 1–2 brief case study callouts (e.g., "Supported [Event Name] with [Outcome]") or pull testimonials from empty testimonials section.

#### Usefulness: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page doesn't explain what Dune does**
- File: Entire About page
- Current: Focuses on approach and values; doesn't list core services.
- Problem: First-time visitor still doesn't know exactly what Dune offers.
- Recommended: Add "Our Services" section (brief preview) to About page, or link prominently to `/services`.

**Issue 2: Industries section doesn't guide next step**
- File: `components/pages/about-page.tsx`
- Current: Lists 4 industries with no CTA or "learn more" links.
- Problem: Visitor in that industry doesn't know where to go next.
- Recommended: Add inline links (e.g., "Events → Event Safety Management page").

#### Conversion Strength: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: CTA is weak ("Talk to our team")**
- File: `components/pages/about-page.tsx` (hero CTA)
- Current: "Talk to our team"
- Problem: Vague; doesn't specify outcome.
- Recommended: "Discuss Your HSE Needs" or "Request a Consultation"

**Issue 2: No urgency or conversion path in body copy**
- File: Entire About page
- Current: No CTAs within sections; single CTA at top and bottom.
- Problem: Visitor reads about values but has no clear "next step".
- Recommended: Add multiple CTAs: one to explore services, one to contact.

#### SEO Readiness: **2.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page title is brand-focused, not keyword-focused**
- File: `data/routes.ts`
- Current: "About Dune Consulting"
- Problem: No search intent keywords (HSE, consulting, safety, experience).
- Recommended: "About Dune Consulting | HSE Consulting Company in Lagos"

**Issue 2: Meta description is generic**
- File: `data/routes.ts`
- Current: "Learn about Dune Consulting and our practical approach to Health, Safety and Environment risk management."
- Problem: Generic; doesn't lead with differentiator or expertise.
- Recommended: "Dune Consulting is a Lagos-based HSE consultancy helping organizations protect people, reduce risk and strengthen safety performance through practical consulting and training."

**Issue 3: No schema for Organization or Person**
- File: About page
- Current: No structured data beyond homepage organization schema.
- Problem: No rich snippets for company info or founder bio.
- Recommended: Add Organization schema with full details; add Person schema for founder/lead consultant.

**Issue 4: No breadcrumb or internal linking in body**
- File: About page
- Current: No inline links to services or portfolio.
- Problem: Missed SEO opportunity (internal links); poor user navigation.
- Recommended: Add contextual links ("See our event safety management service", "View our portfolio").

#### Consistency: **4/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service names not consistent with other pages**
- File: `components/pages/about-page.tsx` (Industries section)
- Current: Lists "Events & entertainment", "Corporate workplaces", "Projects", "Professional development"
- Problem: Industry categories don't map exactly to service names ("Event Safety Management", "HSE Training", "Personnel Outsourcing", "Mentorship Programme").
- Recommended: Align language.

#### Factual Confidence: **2/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: Company age not stated**
- File: About page
- Current: No founding date or years in operation.
- Problem: Credibility gap.
- Recommended: Add verified founding year and company age.

**Issue 2: Founder/lead consultant missing**
- File: About page
- Current: "Leadership profiles awaiting approval"
- Problem: Critical credibility element missing.
- Severity: **CRITICAL**
- Recommended: Add Anthony Igbinosun (Lead Consultant) with verified credentials only.

**Issue 3: No verified track record**
- File: About page
- Current: No statement like "Supported [X] organizations" or "Delivered [X] projects".
- Problem: Without proof, claims feel unsupported.
- Recommended: Add verified figures (700+ professionals trained, 30+ organizations served, etc.).

---

## 3. SERVICES OVERVIEW PAGE (`/services`)

**Route Purpose:** Showcase core services; guide to individual service pages.

**Target Audience:** Organizations evaluating HSE support options.

### Current Content Structure

```
1. Services overview
   - 4 service cards: Event Safety Management, HSE Training, Personnel Outsourcing, HSE Mentorship
   - Each card has title, description, icon, link
```

### Audit Findings

#### Positioning: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Mentorship Programme presented as equal to consulting services**
- File: `data/services.ts`
- Current: Mentorship listed as 4th service alongside commercial consulting services.
- Problem: Mentorship is professional development, not commercial consulting; different audience and monetization.
- Recommended: Separate mentorship from "Services" section. Create "Mentorship Programme" as distinct pathway.

**Issue 2: Service descriptions are generic and vague**
- File: `data/services.ts`
- Current: "Practical, industry-relevant training", "Qualified safety professionals deployed", etc.
- Problem: Doesn't differentiate Dune's approach from competitors.
- Recommended: Add client outcome or unique angle (e.g., "Event Safety Management: Proven coordination from pre-event to post-event close-out", "HSE Training: Designed around your specific operational risks").

#### Clarity: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Service page structure unclear**
- File: `components/pages/services-page.tsx`
- Current: Dynamic routing used but actual page structure not reviewed.
- Problem: Unclear if service page has clear sections (overview, scope, approach, pricing, CTA).
- Recommended: Audit actual service detail pages (event-safety-management, hse-training, personnel-outsourcing).

**Issue 2: No secondary capabilities mentioned**
- File: Services page
- Current: Only 4 core services listed.
- Problem: Visitor may not know about "First aid", "Fire safety", "Risk assessment" capabilities.
- Recommended: Add supporting capabilities under each service or in separate section.

#### Credibility: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Service cards lack proof points**
- File: `data/services.ts`
- Current: No statistics or examples in service descriptions.
- Problem: Claims feel unsupported.
- Recommended: Add brief proof (e.g., "Event Safety Management: Supported 50+ events across Nigeria").

#### Usefulness: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No explanation of when to use each service**
- File: Services page
- Current: Service titles and descriptions, but no guidance on when to choose each.
- Problem: Visitor doesn't know which service fits their need.
- Recommended: Add guidance ("Choose HSE Training if..." or "Event Safety is right if...").

**Issue 2: No pricing or engagement model visible**
- File: Services page
- Current: No indication of engagement scope, duration, or pricing model.
- Problem: Visitor doesn't know how to budget or timeline.
- Recommended: Add brief note ("Custom proposals based on scope") or high-level pricing guidance.

#### Conversion Strength: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Service cards direct to detail pages, not contact forms**
- File: `data/services.ts`
- Current: Each service card links to `/services/[slug]` detail page.
- Problem: Extra step before conversion.
- Recommended: Add "Learn More" link to detail page AND "Request [Service]" link to contact form.

#### SEO Readiness: **2.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page title doesn't include primary keywords**
- File: `data/routes.ts`
- Current: "HSE Services"
- Problem: No "consulting", "training", "event safety", etc.
- Recommended: "HSE Services | Event Safety, Training & Consulting | Dune Consulting"

**Issue 2: Meta description doesn't include service names**
- File: `data/routes.ts`
- Current: "Explore event safety management, tailored HSE training and safety personnel outsourcing from Dune Consulting."
- Problem: Misses "consulting" keyword and mentorship.
- Recommended: "Explore HSE training, event safety management, HSE personnel outsourcing and professional mentorship from Dune Consulting in Lagos."

**Issue 3: No schema for services (LocalBusiness, Service)**
- File: Services page
- Current: No structured data for service offerings.
- Problem: Missed rich snippet opportunity.
- Recommended: Add Service schema for each offering.

#### Consistency: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service naming inconsistency across pages**
- File: Multiple
- Current: "Tailored HSE Training" vs "HSE Training" vs "Training"
- Problem: Inconsistent labeling.
- Recommended: Pick one name per service and use consistently across all pages, navigation, and data files.

#### Factual Confidence: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service descriptions lack specificity**
- File: `data/services.ts`
- Current: General statements without concrete examples.
- Problem: Unclear what exactly each service includes.
- Recommended: Add specific deliverables (e.g., "Event Safety includes: safety planning, risk assessment, vendor coordination, on-site supervision, incident documentation").

---

## 4–6. SERVICE DETAIL PAGES (`/services/event-safety-management`, `/services/hse-training`, `/services/personnel-outsourcing`)

**Route Purpose:** Educate on service scope; convert to inquiry.

**Target Audience:** Organizations with specific HSE needs; event organizers; HR teams; operations managers.

### Common Structure (all 3 pages)

```
1. Page Hero
   - Eyebrow: Service category
   - H1: Service title
   - Copy: Service summary
   - CTA: "Request [Service]" or similar

2. Overview
   - Multi-paragraph copy explaining service philosophy

3. Audiences
   - List of target customer types

4. Benefits
   - 3-card feature grid highlighting key benefits

5. Features / What's Included
   - Bulleted list of deliverables

6. Process
   - 6-step timeline (Consult, Assess, Plan, Deploy, Monitor, Report)

7. FAQs
   - 3–4 Q&A pairs addressing common questions

8. Related Services
   - Links to complementary services

9. CTA section (global)
```

### Audit Findings (Aggregated for 3 Service Pages)

#### Positioning: **4/5** ⚠️ **LOW PRIORITY**

**Strength:** Service detail pages are well-structured and distinguish each service clearly (event-safety-management vs training vs outsourcing).

**Issue 1: Outsourcing service called "Personnel Outsourcing" rather than "HSE Personnel Outsourcing"**
- File: `data/page-content.ts`
- Current: Navigation: "HSE Personnel Outsourcing" | Page title: "HSE Personnel Outsourcing"
- Problem: Inconsistent with other services (which are prefixed "HSE").
- Recommended: Standardize to "HSE Personnel Outsourcing" throughout.

#### Clarity: **4/5** ⚠️ **LOW PRIORITY**

**Strength:** Each page clearly explains scope and approach; audience and benefit statements are specific.

**Issue 1: FAQs don't address objection handling**
- File: `data/page-content.ts` (serviceDetails.faqs)
- Current: FAQs address "When should planning begin?" but not "How much does this cost?" or "How quickly can you deploy?"
- Problem: Visitor with budget/timeline concerns doesn't get answers.
- Recommended: Add cost and timeline FAQs (or note "Custom proposals available").

#### Credibility: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No case studies or examples within service pages**
- File: Service detail pages
- Current: Features and benefits described, but no "We delivered X event safely" examples.
- Problem: Visitor doesn't see proof Dune has done this before.
- Recommended: Add 1–2 brief case study callouts (e.g., "Supported Jameson Distillery on Tour with [X] attendees, [X] safety protocols").

**Issue 2: Process timeline uses generic copy**
- File: `data/page-content.ts` (sharedProcess)
- Current: "We clarify your objectives", "We identify hazards", etc. (uses "we")
- Problem: Passive voice; doesn't specify who does what or timeline.
- Recommended: Add specific outcomes ("Consult → Define scope and identify key risks → 1 week").

#### Usefulness: **4/5** ⚠️ **LOW PRIORITY**

**Strength:** Pages answer key questions (what's included, who's it for, what's the approach).

**Issue 1: No pricing or proposal process documented**
- File: Service pages
- Current: No note on how pricing works or proposal timeline.
- Problem: Visitor doesn't know how to budget or when to expect a response.
- Recommended: Add "Custom proposals within 48 hours" or "Pricing based on scope".

#### Conversion Strength: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: CTA language is generic**
- File: Service page heroes
- Current: CTA text not visible in component review (likely "Request a Consultation" or "Discuss Your Needs")
- Problem: Not service-specific.
- Recommended: Service-specific CTAs:
  - Event Safety: "Plan a Safer Event"
  - HSE Training: "Request a Training Proposal"
  - Personnel Outsourcing: "Request HSE Personnel"

**Issue 2: No mid-page conversion opportunities**
- File: Service pages
- Current: CTA only at top (hero) and bottom (global CTA section).
- Problem: Reader converts interest to inquiry only if scrolling to bottom.
- Recommended: Add secondary CTA after "Features" or "Benefits" section.

#### SEO Readiness: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page titles don't include target keywords**
- File: `data/routes.ts`
- Current: "Event Safety Management", "Tailored HSE Training", etc.
- Problem: No search intent keywords (e.g., "Event Safety Planning", "Corporate HSE Training", "HSE Consultants").
- Recommended:
  - Event: "Event Safety Management | Safety Planning & Coordination"
  - Training: "HSE Training | Practical Corporate Safety Training in Lagos"
  - Outsourcing: "HSE Personnel Outsourcing | Safety Professionals on Demand"

**Issue 2: Meta descriptions don't include search intent**
- File: `data/routes.ts`
- Current: "Practical event safety planning, personnel coordination, supervision and reporting from Dune Consulting."
- Problem: Generic; no call-to-action or urgency.
- Recommended: "End-to-end event safety planning, risk assessment and on-site coordination from Dune Consulting. Safer events start here."

**Issue 3: No Service or LocalBusiness schema**
- File: Service pages
- Current: No structured data for service offerings.
- Recommended: Add Service schema with description, price range (if known), areaServed.

**Issue 4: Missing LSI keywords**
- File: Service pages
- Current: "Event Safety" but rarely mentions "risk assessment", "crowd safety", "emergency planning", etc.
- Recommended: Naturally weave in related terms.

#### Consistency: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service names have different prefixes**
- File: Multiple
- Current: "Tailored HSE Training" vs "Event Safety Management" vs "HSE Personnel Outsourcing"
- Problem: Inconsistent naming convention.
- Recommended: Standardize:
  - "HSE Training" (drop "Tailored" or make consistent)
  - "Event Safety Management" ✓
  - "HSE Personnel Outsourcing" ✓

**Issue 2: Audiences list varies in depth**
- File: `data/page-content.ts` (serviceDetails.audiences)
- Current: Event safety lists 6 audiences; training lists 6; outsourcing lists 6.
- Problem: No consistency issue, but note for reference.

#### Factual Confidence: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Features list includes speculative services**
- File: `data/page-content.ts` (serviceDetails.features)
- Example (Event Safety): "Paramedic and ambulance coordination", "Fire equipment and personnel coordination"
- Problem: Brief states "Do not state that Dune directly supplies ambulances, paramedics or firefighting equipment unless repository content or client confirmation supports that claim."
- Severity: **HIGH** – Needs client verification.
- Current wording: "Paramedic and ambulance coordination" (not supply, but coordination)
- Recommended: Clarify "Dune coordinates third-party providers" vs "Dune provides paramedic services".

**Issue 2: Personnel Outsourcing doesn't specify deployment timelines**
- File: Service page
- Current: No statement like "Deploy within 48 hours" or "Flexible scheduling".
- Problem: Visitor doesn't know turnaround time.
- Recommended: Add typical deployment timeline.

**Issue 3: Training page doesn't specify certification outcomes**
- File: Service page
- Current: FAQ notes "Certificate arrangements depend on approved course scope".
- Problem: Visitor doesn't know if they'll receive a certificate.
- Recommended: Clarify: "Certificates available for accredited courses; custom courses customizable".

---

## 7. HSE MENTORSHIP PROGRAMME PAGE (`/mentorship`)

**Route Purpose:** Recruit early-career HSE professionals; educate on programme value.

**Target Audience:** Students, recent graduates, early-career HSE professionals.

### Current Content Structure

```
1. Page Hero
   - Eyebrow: "Dune HSE Mentorship Programme"
   - H1: "Build practical judgement for a meaningful career in safety."
   - Copy: Multi-paragraph about learning focus
   - CTA: "Express your interest" → `/contact#consultation`

2. Programme Overview
   - Copy: "...designed to help emerging professionals connect foundational safety knowledge..."
   - Callout: "Programme details awaiting confirmation"
   - Note: "No unconfirmed certification or placement outcome is implied."

3. Who Should Apply
   - 4 bullet points about ideal candidates

4. Programme Benefits
   - 3 benefit cards: Professional guidance, Practical perspective, Career direction

5. Learning Areas
   - Eyebrow: "Learning Areas"
   - H2: "A practical curriculum for stronger foundations"
   - 6 learning area bullet points

6. Outcomes (implied)
   - 4 outcome bullet points (confidence, understanding, approach, awareness)

7. Application Process (inferred)
   - Details "awaiting confirmation"

8. CTA section (global)
```

### Audit Findings

#### Positioning: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Mentorship positioned as professional development, but CTAs direct to commercial enquiry form**
- File: `components/pages/mentorship-page.tsx`
- Current: CTA "Express your interest" → `/contact#consultation`
- Problem: Form is designed for commercial service enquiries (organization name, project date, service type), not mentorship programme applications.
- Recommended: Create separate mentorship application form OR update consultation form to support different enquiry types (commercial vs mentorship).

**Issue 2: Programme differentiation from training service unclear**
- File: Mentorship page
- Current: Mentorship called "professional development", but described with learning outcomes similar to training.
- Problem: Visitor may confuse mentorship with "HSE Training" service.
- Recommended: Clearly state "Mentorship is for emerging professionals seeking career guidance; Training is for workplace teams needing skills development".

#### Clarity: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Application process and timeline unclear**
- File: `components/pages/mentorship-page.tsx`
- Current: Callout states "Final programme format, schedule and application cycle will be published after approval."
- Problem: No clear next step. When do applications open? When does the programme run?
- Recommended: Add target dates or "Applications open [month]".

**Issue 2: Learning areas are listed but context is missing**
- File: `components/pages/mentorship-page.tsx`
- Current: "The role and mindset of an HSE professional", "Hazard identification", etc.
- Problem: No explanation of how long, format (online, in-person, hybrid), or intensity.
- Recommended: Add programme format note ("5-week cohort", "Weekly 2-hour sessions", etc.).

**Issue 3: Outcomes are listed but success measures are vague**
- File: `components/pages/mentorship-page.tsx`
- Current: "Greater confidence", "Clearer understanding", etc.
- Problem: Soft outcomes; no concrete deliverable.
- Recommended: Add concrete outcome (e.g., "Completion of practical HSE project portfolio" or "Mentorship certificate upon completion").

#### Credibility: **2/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: No mentor profiles visible**
- File: Mentorship page
- Current: No photos, names, or credentials of mentors.
- Problem: Critical for credibility. Early-career professionals need to know who they're learning from.
- Severity: **CRITICAL** – Must include mentor bios before conversion.
- Recommended: Add Anthony Igbinosun profile or other mentor names with credentials.

**Issue 2: No alumni outcomes or testimonials**
- File: Mentorship page
- Current: No feedback from past participants.
- Problem: Prospective mentees can't evaluate programme value.
- Recommended: Add testimonials from previous cohort members (e.g., "I felt more confident in my HSE responsibilities" – [Name, [Company]).

**Issue 3: Programme fees and commitment not stated**
- File: Mentorship page
- Current: No cost, time commitment, or eligibility criteria.
- Problem: Visitor doesn't know if they can afford or commit.
- Recommended: Add fee range ("₦50,000–100,000 per cohort") and time commitment ("5 weeks, 2 hours/week").

**Issue 4: Partner organizations not mentioned**
- File: Mentorship page
- Current: No mention of ISO scholarship partnership or other collaborations.
- Problem: Misses credibility opportunity.
- Recommended: Add note like "Proud partner in the [ISO/Partner] scholarship programme" (if verified).

#### Usefulness: **2.5/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Application process missing**
- File: Mentorship page
- Current: "Express your interest" button, but no application form shown.
- Problem: Interested visitor doesn't know how to apply.
- Recommended: Add clear application steps (e.g., "1. Submit interest form. 2. Schedule conversation. 3. Receive cohort details. 4. Submit formal application").

**Issue 2: Eligibility criteria unclear**
- File: Mentorship page
- Current: "Who Should Apply" lists 4 categories (students, early-career, transitioners, etc.) but no minimum experience or education required.
- Problem: Visitor doesn't know if they qualify.
- Recommended: Add specific criteria (e.g., "1–5 years HSE experience recommended", "No formal HSE background required").

**Issue 3: Next cohort details missing**
- File: Mentorship page
- Current: "Details awaiting confirmation"
- Problem: Visitor doesn't know when to apply.
- Recommended: Add target launch date or "Register interest for next cohort".

**Issue 4: Outcomes don't specify career impact**
- File: Mentorship page
- Current: "Greater confidence", "Stronger awareness", etc.
- Problem: Early-career professionals want to know: "Will this help me get a better job?" or "Will I get a certification?"
- Recommended: Clarify post-programme opportunities (e.g., "Alumni network access", "Job board for HSE roles", "Mentorship certificate").

#### Conversion Strength: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: CTA is weak ("Express your interest")**
- File: `components/pages/mentorship-page.tsx`
- Current: "Express your interest" → contact form
- Problem: Vague; doesn't specify outcome (Apply? Join waitlist? Register interest?).
- Recommended: "Apply for Next Cohort" or "Register Interest" with clear form flow.

**Issue 2: No scarcity or urgency messaging**
- File: Mentorship page
- Current: No "Limited spots", "Cohort opens [date]", etc.
- Problem: No conversion pressure.
- Recommended: Add "Next cohort opens [month] | Limited to 20 participants".

**Issue 3: Mid-page conversion opportunity missing**
- File: Mentorship page
- Current: Single CTA at top; possible CTA at bottom.
- Problem: Reader interested in specific benefit (e.g., "Career direction") doesn't have immediate path to apply.
- Recommended: Add inline CTA after each major section ("Learn more about career mentorship" → form).

**Issue 4: No clear application deadline**
- File: Mentorship page
- Current: No application closing date.
- Problem: Visitor delays decision without deadline.
- Recommended: Add application deadline (e.g., "Applications close [date]").

#### SEO Readiness: **2.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page title doesn't include search intent**
- File: `data/routes.ts`
- Current: "HSE Mentorship Programme"
- Problem: No keywords like "mentorship", "career", "professional development", "HSE professionals".
- Recommended: "HSE Mentorship Programme | Professional Development for Safety Professionals"

**Issue 2: Meta description is generic**
- File: `data/routes.ts`
- Current: "Build practical safety skills through structured guidance, industry insight and career development support."
- Problem: Generic; no call-to-action or unique angle.
- Recommended: "Join the Dune HSE Mentorship Programme for emerging safety professionals. Practical guidance, career development and professional networking."

**Issue 3: No schema for Event or Programme**
- File: Mentorship page
- Current: No structured data for programme details, dates, or pricing.
- Recommended: Add Event schema (if running cohorts) or Course schema with programme details.

**Issue 4: Search intent for "HSE mentorship Nigeria" not addressed**
- File: Mentorship page
- Current: Page mentions Nigeria only in general context.
- Recommended: Add note "Serving HSE professionals across Nigeria and beyond" or "Open to participants from [X] countries".

#### Consistency: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Mentorship referred to as both "programme" and "program"**
- File: Multiple files
- Current: Brief specifies "programme"; content files use "programme"; no instances of "program" found (but check).
- Problem: Consistency check needed.
- Recommended: Use "programme" consistently (British English).

#### Factual Confidence: **1.5/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: Programme details incomplete**
- File: Mentorship page
- Current: "Details awaiting confirmation": dates, format, fees, eligibility, cohort size.
- Severity: **CRITICAL** – Cannot properly audit or convert without these details.
- Recommended: Verify all details with client before publishing; add to page.

**Issue 2: Learning areas topics don't match brief-supplied content**
- File: Mentorship page
- Brief supplied week-by-week topics:
  ```
  Week 1: Who You Are as an HSE Professional
  Week 2: Showing Up (Confidence, Presence, Voice)
  Week 3: Office Politics (Influence, Relationships, Power)
  Week 4: Emotional Intelligence, Negotiation, Conflict Resolution
  Week 5: Career Positioning and Core HSE Competencies
  ```
- Current page lists: "The role and mindset", "Hazard identification", "Reporting and documentation", "Communication", "Event and workplace safety", "Career planning"
- Problem: Mismatch. Brief topics are more interpersonal/career-focused; current page lists more technical topics.
- Recommended: Replace with brief-supplied topics and add weekly structure.

**Issue 3: Proof points not stated**
- File: Mentorship page
- Brief mentions: 320+ registrations, 18 countries, 4 continents, ISO scholarship partnership, ₦600,000 scholarship value.
- Current page: No proof points visible.
- Recommended: Add "320+ emerging professionals mentored" or similar if verified.

**Issue 4: Mentor credentials not stated**
- File: Mentorship page
- Current: No mentor bios or credentials visible.
- Problem: Credibility gap.
- Recommended: Add Anthony Igbinosun and any other mentors' profiles with verified credentials.

---

## 8. PORTFOLIO PAGE (`/portfolio`) & PROJECT PAGES (`/portfolio/[slug]`)

**Route Purpose:** Showcase past event and project work; establish credibility through examples.

**Target Audience:** Prospect evaluators; potential event organizers; organizations vetting Dune's track record.

### Current Content Structure

```
Portfolio Overview:
1. Section title: "Our Work: Selected Events and Projects"
2. 6 project cards with images and brief descriptions
3. Each project has disclaimer: "Project details are subject to client approval."

Individual Project Pages:
1. Page Hero with project title and image
2. Brief description and outcome statements
3. Same disclaimer
```

### Audit Findings (Aggregated)

#### Positioning: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Portfolio limited to event safety projects**
- File: Portfolio content
- Current: All 6 projects are events (Jameson, TechCabal, AFC, Martell, Zedcrest, Aproko).
- Problem: Doesn't showcase HSE training, personnel outsourcing, or consultancy work.
- Recommended: If Dune has delivered training or consulting, add project examples (e.g., "Implemented HSE training for [Organization], trained [X] employees in [X] hours").

#### Clarity: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Project descriptions are minimal**
- File: Portfolio cards
- Current: One-line description per project.
- Problem: Visitor doesn't understand scope, outcomes, or Dune's role.
- Recommended: Add brief case study format ("Client: [X] | Challenge: [X] | Solution: [X] | Outcome: [X]").

**Issue 2: Outcomes not specified**
- File: Project pages
- Current: No statement like "0 incidents", "100% compliance", "15,000 attendees", etc.
- Problem: Visitor can't assess Dune's impact.
- Recommended: Add quantified outcomes (e.g., "Coordinated safety for 5,000 attendees with zero incidents").

#### Credibility: **2.5/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Client names and logos not linked**
- File: Portfolio
- Current: Project titles reference client names (Jameson, Martell, etc.) but no logos or formal client verification.
- Problem: Can't verify client approval visually.
- Recommended: Add actual client logos or formal attribution (e.g., "Client: Jameson").

**Issue 2: Dates missing from projects**
- File: Portfolio
- Current: No event dates (e.g., "June 2023").
- Problem: Visitor can't assess recency.
- Recommended: Add event dates (or "Recent", "2024" if sensitive).

**Issue 3: Disclaimer suggests client sensitivity**
- File: Portfolio pages
- Current: "Project details are subject to client approval."
- Problem: Implies uncertainty or confidentiality; reduces credibility.
- Recommended: Remove disclaimer if details are approved; replace with "Delivered for [Client] with confidentiality agreement" if needed.

#### Usefulness: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No clear navigation from portfolio to services**
- File: Portfolio pages
- Current: Project pages don't link back to related services (e.g., "Learn more about Event Safety Management").
- Problem: Visitor sees example but doesn't know how to engage.
- Recommended: Add "This is an example of our [Service]" with link to service page.

**Issue 2: No information on how to request similar work**
- File: Portfolio pages
- Current: No CTA (likely only global footer CTA available).
- Problem: Visitor interested in similar project doesn't have clear path.
- Recommended: Add inline CTA ("Need similar support for your event? Discuss your project").

#### Conversion Strength: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No project-specific CTA**
- File: Portfolio pages
- Current: Likely only global "Request a Consultation" available.
- Problem: Not event/project-specific.
- Recommended: "Plan a Safer Event Like This" or "Discuss Your Event Safety Needs".

#### SEO Readiness: **2.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page titles don't include location or event type**
- File: `data/routes.ts`
- Current: "Jameson Distillery on Tour"
- Problem: No keywords like "event", "safety", "Lagos", "Nigeria".
- Recommended: "Jameson Distillery on Tour | Event Safety Management | Lagos, Nigeria"

**Issue 2: Meta descriptions are generic**
- File: `data/routes.ts`
- Current: "Selected event safety project from Dune Consulting. Project details are subject to client approval."
- Problem: Doesn't explain what was delivered.
- Recommended: "Dune Consulting provided comprehensive event safety coordination for Jameson Distillery on Tour, managing crowd safety, emergency response and vendor coordination."

**Issue 3: No schema for Event or Project**
- File: Portfolio pages
- Current: No structured data for event details, dates, or outcomes.
- Recommended: Add Event schema with event name, date, location, attendee count (if public).

#### Consistency: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Project card styling may be inconsistent**
- File: Portfolio component
- Note: Not reviewed in detail; check if all cards same height/layout.

#### Factual Confidence: **3/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Client approval status unclear**
- File: Portfolio pages
- Current: Disclaimer "Project details are subject to client approval."
- Problem: Implies projects may not be approved; reduces credibility.
- Severity: **HIGH** – Must verify each project has explicit client approval before publishing.
- Recommended: Remove disclaimer or confirm all clients have approved inclusion and details.

**Issue 2: No outcomes documented**
- File: Portfolio pages
- Current: No statistics (attendees, safety incidents, compliance rating, etc.).
- Problem: Visitor can't assess Dune's track record.
- Recommended: Add quantified outcomes (e.g., "Coordinated 5,000+ attendees", "Zero safety incidents", "100% regulatory compliance").

**Issue 3: Dates missing**
- File: Portfolio pages
- Current: No project dates or "When" context.
- Problem: Can't verify recency.
- Recommended: Add dates or relative timeline ("2024", "Recent").

---

## 9. INSIGHTS/ARTICLES PAGE (`/insights`)

**Route Purpose:** Establish thought leadership; provide SEO content; nurture leads.

**Target Audience:** Organizations seeking HSE guidance; job seekers; industry professionals.

### Current Content Structure

```
1. Article overview
   - 5 article cards (stubs) with images, titles, excerpts, categories, dates
   - All articles show "Publication date pending"
```

### Audit Findings

#### Positioning: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Articles are stubs with no published content**
- File: `data/page-content.ts`
- Current: 5 article titles but all show "Publication date pending".
- Problem: Page is incomplete; doesn't position Dune as thought leader.
- Recommended: Publish articles or hide page until articles are ready.

**Issue 2: Article topics are generic**
- File: `data/page-content.ts`
- Current: "Planning Safer Events", "Building Practical Safety Culture", "Choosing HSE Training", "Event Emergency Coordination", "Getting the Best From Deployed Safety Personnel"
- Problem: Titles are generic; no unique angle visible.
- Recommended: Add Dune's perspective (e.g., "Why Generic Event Safety Checklists Fail: A Lagos Perspective").

#### Clarity: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: No article content visible**
- File: Insights page
- Current: Stubs only; full articles not inspected.
- Problem: Can't audit copy quality or messaging clarity.
- Recommended: Publish or draft articles before audit.

#### Credibility: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: No author attribution**
- File: Article cards
- Current: No author name, credentials, or profile link.
- Problem: Reduces credibility; readers don't know who wrote the content.
- Recommended: Add author name and title (e.g., "By Anthony Igbinosun, Lead Consultant").

**Issue 2: Publication status blocks credibility**
- File: All articles
- Current: "Publication date pending"
- Problem: Incomplete content; signals low priority.
- Recommended: Remove pending articles or publish with dates.

#### Usefulness: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: Article excerpts don't convey value**
- File: `data/page-content.ts`
- Current: Excerpts are generic (e.g., "A practical look at early decisions...").
- Problem: Doesn't compel reading.
- Recommended: Add specific insight (e.g., "Why 60% of event safety plans fail and how to fix yours").

#### Conversion Strength: **1.5/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: No CTA within articles**
- File: Insights page
- Current: Article stubs only; no read full article link or related content.
- Problem: No conversion path from article to service or inquiry.
- Recommended: Add CTA in article (e.g., "Ready to strengthen your event safety plan? Contact us").

#### SEO Readiness: **2/5** ⚠️ **HIGH PRIORITY**

**Issue 1: No article content for SEO**
- File: Insights page
- Current: Stubs only; no full article text to optimize.
- Problem: No search visibility.
- Recommended: Publish full articles with target keywords before expecting organic traffic.

**Issue 2: Page title doesn't include search intent**
- File: `data/routes.ts`
- Current: "HSE Insights"
- Problem: No keywords like "blog", "articles", "guides", "tips".
- Recommended: "HSE Insights & Articles | Practical Safety Guidance | Dune Consulting"

**Issue 3: Meta description doesn't lead with article value**
- File: `data/routes.ts`
- Current: "Practical Health, Safety and Environment guidance from Dune Consulting."
- Problem: Generic.
- Recommended: "Read practical HSE guides, event safety tips and professional development insights from Dune Consulting."

#### Factual Confidence: **1/5** ⚠️ **CRITICAL PRIORITY**

**Issue 1: Articles not published; no content to audit**
- File: Insights page
- Current: All 5 articles show "Publication date pending".
- Problem: Can't verify accuracy or factual basis.
- Recommended: Publish articles with research/sources or remove section.

---

## 10. CONTACT PAGE (`/contact`)

**Route Purpose:** Capture inquiries; facilitate conversion.

**Target Audience:** Organizations with HSE needs; mentorship applicants; partnership inquiries.

### Current Content Structure

```
1. Contact Page Hero
   - H1: (likely "Get in Touch" or similar)
   - CTA: (likely contact form)

2. Consultation Form
   - Fields: name, email, phone, organisation, service, projectDate, location, message, consent
   - Submit: "Request a Consultation"
   - Success/error messaging

3. Footer: Company contact details
```

### Audit Findings

#### Positioning: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Form positioning unclear**
- File: Consultation form
- Current: "Request a consultation" (generic).
- Problem: Doesn't specify what type of consultation or expected outcome.
- Recommended: Update heading based on visitor intent (e.g., "Plan Your HSE Needs" or "Apply for HSE Mentorship").

#### Clarity: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Service dropdown options unclear**
- File: `components/forms/consultation-form.tsx`
- Current: Form includes `service` field (required) but options not visible in component review.
- Problem: Can't verify if options match published services.
- Recommended: Ensure dropdown includes: Event Safety Management, HSE Training, Personnel Outsourcing, HSE Mentorship, Other.

**Issue 2: Field labels need review**
- File: Consultation form
- Current: Form text: "Tell us what support you need. All fields marked * are required."
- Problem: Generic; doesn't specify what happens next or response timeline.
- Recommended: Add clarity: "Tell us about your HSE needs. We'll respond within 48 hours."

**Issue 3: Message field has no hints**
- File: `lib/validations.ts`
- Current: message field requires 10–4000 chars but no helper text in form.
- Problem: Visitor may not write enough detail.
- Recommended: Add helper: "Tell us more about your project, timeline and specific challenges (minimum 10 characters)."

#### Credibility: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: No response time guarantee**
- File: Contact page
- Current: No statement like "We'll respond within 24 hours".
- Problem: Visitor doesn't know when to expect reply.
- Recommended: Add "Expect a response within 48 hours" or similar.

**Issue 2: No privacy statement visible**
- File: Consultation form
- Current: Consent checkbox but no clear privacy link.
- Problem: GDPR/compliance concern.
- Recommended: Add link to privacy policy in consent text.

#### Usefulness: **3/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Form doesn't guide visitor based on need**
- File: Consultation form
- Current: Generic form for all enquiry types.
- Problem: Mentorship applicant, service buyer, and partnership inquiries all use same form.
- Recommended: Add enquiry type selector (Commercial Service, Mentorship Programme, Partnership, Other) to route appropriately.

**Issue 2: No phone or WhatsApp contact alternative visible**
- File: Contact page (not reviewed in detail)
- Current: Company phone and WhatsApp number in footer, but not prominently on contact page.
- Problem: Visitor may prefer phone over form.
- Recommended: Add "Quick contact: +234 906 685 3199 (WhatsApp)" near form.

#### Conversion Strength: **3.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: CTA text is generic**
- File: Consultation form
- Current: "Request a Consultation" or similar.
- Problem: Not outcome-specific.
- Recommended: Context-specific buttons:
  - Event organisers: "Plan a Safer Event"
  - Training: "Request a Training Proposal"
  - Mentorship: "Apply for the Mentorship Programme"

**Issue 2: Success messaging doesn't set expectations**
- File: Consultation form
- Current: Success message likely generic (e.g., "Thanks for your enquiry").
- Problem: Visitor doesn't know next step or timeline.
- Recommended: "Thanks! We'll review your enquiry and contact you within 48 hours."

**Issue 3: No urgency or scarcity**
- File: Contact page
- Current: No deadline or limited availability messaging.
- Problem: Visitor may deprioritize submission.
- Recommended: Add scarcity for mentorship ("Only 20 spots available for next cohort").

#### SEO Readiness: **2.5/5** ⚠️ **MEDIUM PRIORITY**

**Issue 1: Page title doesn't include search intent**
- File: `data/routes.ts`
- Current: Not in routes.ts (likely default "Contact")
- Problem: No keywords like "contact", "enquire", "consult", "HSE".
- Recommended: "Contact Dune Consulting | HSE Consulting Enquiry Form"

**Issue 2: Meta description missing**
- File: Meta config
- Current: Likely generic or default.
- Recommended: "Get in touch with Dune Consulting. Request HSE training, event safety support, personnel outsourcing or mentorship programme enquiries."

#### Consistency: **4/5** ⚠️ **LOW PRIORITY**

**Issue 1: Form CTA text varies across site**
- File: Multiple
- Current: "Request a Consultation" (hero), "Talk to our team" (about), "Express your interest" (mentorship).
- Problem: Inconsistent conversion language.
- Recommended: Standardize to one primary CTA ("Discuss Your HSE Needs") with service-specific variations.

#### Factual Confidence: **4/5** ⚠️ **LOW PRIORITY**

**Issue 1: Contact details are dynamic**
- File: `data/company.ts`
- Current: Phone and email pulled from environment variables (`publicEnv`).
- Problem: Need to verify `.env.example` includes these variables with safe defaults.
- Recommended: Confirm `.env.example` includes `NEXT_PUBLIC_COMPANY_PHONE` and `NEXT_PUBLIC_COMPANY_EMAIL`.

---

## 11. FOOTER & SHARED NAVIGATION

**Purpose:** Provide consistent navigation, contact details, and brand messaging across all pages.

### Audit Findings

#### Positioning: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Footer description is generic**
- File: `components/layout/footer.tsx`
- Current: "Practical Health, Safety and Environment solutions for events, workplaces and projects."
- Problem: Doesn't distinguish as consultancy.
- Recommended: "Dune Consulting helps organisations protect people, reduce risk and strengthen safety performance through practical HSE expertise."

#### Clarity: **4/5** ⚠️ **LOW PRIORITY**

**Strength:** Footer sections (Company, Services, Contact) are clearly organized.

#### Consistency: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Service names inconsistent in footer**
- File: `components/layout/footer.tsx`
- Current: Footer uses "Tailored HSE Training" but navigation may use "HSE Training".
- Problem: Minor inconsistency.
- Recommended: Standardize across all pages.

#### Credibility: **3.5/5** ⚠️ **LOW PRIORITY**

**Issue 1: Social links (LinkedIn, Instagram) present**
- File: `components/layout/footer.tsx`
- Current: Links to social profiles.
- Problem: Need to verify profiles exist and are active.
- Recommended: Audit LinkedIn and Instagram pages for current content and follower count.

---

## Summary of Findings by Severity

### CRITICAL Issues (Must fix before publication)

1. **Homepage statistics mismatch** – Data doesn't match brief; must verify figures before publishing.
2. **Mentorship programme details incomplete** – Dates, fees, eligibility missing; can't convert without them.
3. **Founder/leader missing from About page** – No profile, photo, or credentials for Anthony Igbinosun.
4. **HSE Mentorship mentor bios missing** – No mentor profiles visible; credibility gap.
5. **Portfolio project approval status unclear** – Disclaimer suggests projects not approved; must verify.

### HIGH Issues (Should fix before publication)

1. **Homepage positioning signals** – Mixed messaging; needs clarity on consultancy vs training.
2. **CTA language inconsistency** – "Request Consultation" vs "Talk to our team" vs "Express interest"; needs standardization.
3. **Contact form routing** – Generic form for all enquiry types; mentorship applications mixed with commercial inquiries.
4. **Article stubs without content** – "Publication date pending" reduces credibility; publish or hide.
5. **Paramedic/ambulance language** – "Coordination" vs "Provision" needs clarification; must verify claims.
6. **Form service dropdown options** – Can't audit which services are selectable; need clarification.

### MEDIUM Issues (Should address in content rewrite)

1. **Homepage meta description** – Generic; lacks search intent alignment.
2. **Service page titles and descriptions** – Not keyword-optimized; weak SEO positioning.
3. **About page mission/vision** – Vague language; could be clearer.
4. **Testimonials section** – Empty placeholder weakens credibility; either populate or replace.
5. **Industries served** – Only on About page; should appear on homepage or services.
6. **No case studies in service pages** – Claims lack proof; add brief examples.
7. **Process timeline language** – Generic "we clarify" without specifics; needs outcomes.
8. **Mentorship programme positioning** – Form routing unclear; separate application process needed.

### LOW Issues (Future improvements)

1. **Service naming consistency** – "Tailored HSE Training" vs "HSE Training"; pick one.
2. **OG images** – Not customized with Dune branding.
3. **Footer description** – Generic; could be more specific.
4. **Breadcrumbs missing** – No breadcrumb navigation on detail pages.

---

## Recommendations for Phase 3 (Brand Messaging)

Based on this audit, Phase 3 should establish:

1. **Single approved company description** (one version for all pages)
2. **Standardized service names** (decide on naming convention and enforce across navigation, data, pages)
3. **CTA hierarchy** (primary, secondary, service-specific variants)
4. **Statistics policy** (which verified figures to use, where, how to avoid conflicts)
5. **Mentor/founder profile guidelines** (what credentials to include, how to verify, where to display)
6. **Mentorship positioning** (distinct from commercial services; separate form flow)
7. **Proof point rules** (how to cite client projects, statistics, outcomes; approval process)
8. **SEO messaging strategy** (primary keywords per page, LSI variants, local search optimization)
9. **Testimony/case study template** (how to present client outcomes, approval, confidentiality)
10. **Article/thought leadership policy** (publication standards, author attribution, sourcing)

