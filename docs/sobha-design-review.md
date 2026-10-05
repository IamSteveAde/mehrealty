# Sobha Realty review and MEH implementation brief

Reviewed 5 October 2026. Reference: https://sobharealty.com/

## Scope and evidence

Inspected the live homepage in Chrome at 1440 × 1000 and 390 × 844, including the hero, introduction and brand pillars. Read the homepage navigation, a community page and the contact page. Checked computed typography and reviewed MEH's existing Next.js components, routes and project model.

The mobile capture used browser emulation, not a physical device. MEH comparisons are based on source inspection, not a rendered local-site audit. This is a design and implementation review; it does not establish conversion rates, accessibility compliance or measured performance. Forms were not submitted. No website implementation was changed.

## Design direction

Sobha presents property as a lifestyle experience. Architectural imagery occupies most of the hero; navigation and copy occupy comparatively little space. Its bright neutral sections, fine borders and restrained controls create a calm, established impression.

The desktop header places the logo centrally, with navigation on either side. On mobile, the menu sits left, the logo centrally and utility icons right. The scrolled desktop header uses a translucent, blurred background.

Typography combines Ringside sans-serif with Chronicle Display and Chronicle Display XLight serif faces, verified from computed styles. Small uppercase navigation and section titles contrast with lighter serif project and pillar headings. Some graphic headlines combine sans-serif lettering with an italic serif word. This is more varied than applying an oversized italic serif headline to every section.

Observed surfaces are primarily white, pale grey and dark text. Photography supplies most of the colour. Buttons use thin outlines, rounded pill shapes and widely spaced uppercase labels. Gold is not the main organizing feature of the captured sections.

The introduction pairs a brand statement with a large image. The pillars use three photographic columns with an offset middle image, serif titles and explanatory text. This gives the page an editorial rhythm rather than a repeated card grid.

## Structure and user journeys

The homepage moves from a featured project into the brand story, quality pillars, property exploration, news and a comprehensive footer. The primary navigation distinguishes communities from property types, then supports the brand with company and media content.

This serves two journeys: visitors choosing where to live, and visitors choosing what kind of home to buy. The MEH equivalent should reflect the actual portfolio. With only a few developments, one Developments menu with location and type filters is clearer than a large community hierarchy.

The [Sobha Central page](https://sobharealty.com/sobha-communities/sobha-central) extends the experience with project scale, visual storytelling, lifestyle sections, location information, a map link and FAQs. A development page acts as a destination in its own right.

The [contact page](https://sobharealty.com/contact-us) separates sales, customer service, investor and partner needs. Its enquiry flow offers callback or video-call preferences and includes privacy agreement and optional marketing preferences. MEH should use the contact options its team can actually fulfil.

## Strengths and tradeoffs

- Strong photography communicates architecture, setting and lifestyle quickly.
- Clear hierarchy makes a large portfolio browsable through multiple entry points.
- Brand and construction content support buyer confidence before an enquiry.
- Repeated enquiry opportunities connect browsing with a next step.
- Consistent typography and controls create coherence across different content types.

The observed cookie notice occupies roughly a quarter of the desktop capture and obscures the lower hero. Use a more compact notice if MEH needs one. A large menu can also add effort for a small portfolio. Large media assets need careful loading, and automatic hero changes need pause controls. These are design risks, not measured failures of Sobha's conversion or performance.

## MEH: existing foundation and gaps

| Area | Existing MEH implementation | Recommended change |
| --- | --- | --- |
| Header | Left-aligned logo, fixed navigation, enquiry CTA, animated light rail | Centre the logo on desktop; simplify borders and decoration; provide an accessible developments dropdown |
| Hero | Five service-oriented slides over one video, large two-line headings, strong dark overlay | Lead with a featured development; use corresponding imagery for each slide; reduce headline dominance and darkening |
| Homepage sequence | Hero → journey selector → welcome film → philosophy → two developments → journal → CTA | Bring developments earlier; use a shorter brand introduction and a photographic three-pillar section |
| Typography | Fraunces, imported Cormorant Garamond and DM Sans, plus Arial/Georgia configuration | Establish one serif and one sans family with consistent sizes, weights and spacing |
| Visual language | Multiple gold tones, cream surfaces, shadows and ornamental motion | Define shared tokens; favour white/pale grey surfaces, thin rules and restrained gold accents |
| Development listing | Two-column cards without browsing controls | Add location, residence type and status filters with result counts and a clear empty state |
| Development detail | Hero, description, facts, gallery, amenity list, contact link | Add useful residence specifications, image-led amenities, location context, FAQs and related projects |
| Enquiry | General form with project-interest prefill | Offer a shorter project-specific flow, clear pending/error/success states and supported contact preferences |

MEH already has an admin system, published project content, a journal, galleries, enquiry storage and a concierge. These provide a workable foundation for the redesign.

## Proposed homepage

1. Compact header: About, Developments, Services, Journal, Contact, with the MEH logo centrally placed on desktop.
2. Featured-development hero: approved image/video, project name, one short statement, Discover Development and a discreet enquiry action.
3. Concise MEH introduction: one clear proposition alongside an architectural or team image.
4. Three photographic pillars: design, delivery quality and lasting value, supported by specific evidence.
5. Development collection: large project images with location, type and status; clear links to full details.
6. Services: a compact route selector for investment, management and hospitality.
7. Trust content: approved delivery milestones, team credentials or attributable testimonials.
8. Journal: a small selection of current content.
9. Consultation CTA and practical footer: contact details, main routes and privacy information.

Do not invent delivery numbers, investment returns, testimonials or availability to fill the layout. The design should accommodate missing optional content gracefully.

## Proposed development page

Use this sequence: project hero → key facts → overview → residence options → gallery → amenities → location → FAQs → related developments → enquiry.

The current Project model already includes category, status, location, price, bedrooms, size, gallery and amenities. Display those fields where populated before adding schema complexity. Brochure files, floor plans, coordinates, payment plans and project FAQs need additional structured content if MEH has approved materials for them.

Preserve the selected project in every enquiry entry point. On mobile, a compact bottom enquiry bar can keep the next step available without covering content or the concierge. Avoid simultaneous floating controls competing for the same corner.

## Implementation sequence

### 1. Shared visual system and homepage

Define typography, surfaces, spacing, borders and button styles in shared CSS/Tailwind tokens. Update SiteHeader, HeroSection and LandingPage. Replace the text-only philosophy section with photographic pillars using approved MEH assets. Reorder existing homepage sections and simplify ornamental motion.

Use appropriately licensed fonts or accessible alternatives; the reference's font declarations do not provide a font licence. Retain MEH's name, content and approved photography.

### 2. Property discovery and detail

Add listing filters using the existing project fields. Make filter state shareable in the URL. Expand development pages with available specifications, better gallery navigation, location content and FAQs where supplied. Scale the navigation to the portfolio.

### 3. Enquiry experience

Keep project context, prevent duplicate submissions, handle network exceptions and show actionable validation. Separate any marketing preference from the enquiry itself. Confirm operational support before offering appointment slots or promising response times.

### 4. Verification

Check 390px mobile, tablet and desktop layouts; keyboard navigation, menu focus and Escape behaviour; readable text over every hero image; reduced-motion behaviour; video pause and fallback states; and real enquiry handling. Check image payloads and layout stability using a rendered site before making performance claims.

## Specific source-level fixes to include

- app/page.tsx selects the newest two published projects rather than using the existing featured flag. Make editorial featuring explicit, with an intentional fallback.
- app/globals.css, app/layout.tsx and tailwind.config.ts contain overlapping font choices. Consolidate them to prevent inconsistent typography and unnecessary font loading.
- HeroSection's pause control currently pauses slideshow timing while video playback follows separate visibility/reduced-motion logic. Ensure the intended motion control covers the relevant moving media.
- WelcomeSection's video-error message exposes a public filesystem path. Replace it with visitor-facing fallback content.
- EnquiryForm should handle fetch exceptions and disable repeated submission while pending.

The recommended result is a closely aligned visual experience built around MEH's actual developments and services. The largest gains will come from imagery, hierarchy, content depth and consistent controls.
