# Concierge upgrade and deployment

## Audit and implementation

The previous route inferred names and consent using broad regular expressions (including “I am”), interrupted visitors with a request for three contact fields, and overwrote any lead sharing an email or phone. It trusted client-supplied assistant history, lacked abuse limits, and returned HTTP 200 for failures. Project context excluded descriptions, prices and amenities. Admin pages already read the same Enquiry model; no email/notification integration exists. The admin session had a public development-secret fallback. The WhatsApp shortcut pointed to a placeholder.

The new route uses OpenAI structured extraction with server-side Zod validation, published project fields and an explicit allowlist of public settings. It supports full descriptions, published prices, amenities, bedroom/size data and company FAQs entered by an administrator. Project status is explicitly not a unit availability guarantee. Model replies do not control database writes. Prompt rules isolate instructions from user/database content; there are no AI-accessible database or admin tools. Generated links are restricted to public site paths.

Conversation history and accumulated lead details travel in an authenticated encrypted token with a two-hour expiry. The client holds it in memory, not localStorage, cookies or a URL. The last eight exchanges are retained within a character budget, with a cumulative structured draft for earlier needs. Closing/reopening preserves the chat; refreshing or starting a new chat clears it. Messages are sent to OpenAI with `store: false`; this is not a claim of zero provider retention. The widget discloses AI processing. No raw chat/PII is logged by application error handling.

A follow-up displays an embedded form for full name, email, phone, property/preference and enquiry details, prefilled from volunteered information. Form values are validated server-side and stored in the encrypted draft without AI reinterpretation. “Review enquiry” displays the summary; the separate confirmation authorises contact and saves the lead. General questions and refusals remain possible. A complete draft produces a server-rendered summary and a contact-consent question. A narrow explicit confirmation (or the confirmation button) is accepted only with a valid pending token. Corrections or intervening questions return to conversation and require a fresh review. Unrecognised affirmative wording does not silently submit. Successful persistence alone produces a receipt. Database uniqueness on the conversation identifier prevents double submissions and preserves existing unrelated leads and follow-up status. A new enquiry after submission requires a new chat. An administrator can see contact data, request, summary, source, timestamp, consent evidence and status in `/admin/enquiries` and `/admin/leads`.

## Changed files

- `components/Concierge.tsx`, `components/ConciergeLeadForm.tsx`: embedded lead form and conversation protocol, confirmation/retry/reset controls, AI disclosure, viewport tracking, focus trap, public internal links, optional valid WhatsApp number. Existing visual styling retained.
- `app/api/concierge/route.ts`, `lib/concierge/{ai,state}.ts`: grounding, structured extraction, encrypted context, review and consent, idempotent persistence.
- `lib/public-request.ts`, `app/api/enquiries/route.ts`: size/origin validation, distributed database rate limits, server-owned source/status fields.
- `lib/auth.ts`: require a configured signing secret and an existing admin user.
- `components/EnquiryFollowUp.tsx`, admin enquiries/leads/actions/settings: follow-up controls, consent evidence, approved public company knowledge.
- `prisma/schema.prisma`, `prisma/upgrades/20260929_concierge.sql`: additive database changes.
- `.env.example`, `package.json`, `tests/concierge.test.ts`: PostgreSQL configuration and verification commands.

## Database upgrade

This repository uses `prisma db push` and has no migration baseline/history. Do not introduce `prisma migrate deploy` against the existing database without baselining it first.

Before deploying application code, back up the target Supabase database and apply `prisma/upgrades/20260929_concierge.sql` through the Supabase SQL editor or an authorised PostgreSQL connection. This adds nullable `submissionKey`, `consentAt`, `consentText` columns, a unique index and the shared rate-limit table. Existing leads are preserved. It enables RLS and removes anon/authenticated access to enquiries and rate-limit data. Use the server-side Prisma database role with the necessary privileges; do not use a Supabase browser/anon client for these tables.

For a new empty database, create the schema using `npx prisma db push`, then apply the SQL file for RLS and grants. Applying the SQL to an existing PostgreSQL database requires that its pre-existing schema already matches the project's prior Prisma schema. The SQL includes Supabase roles (`anon`, `authenticated`). No database changes were applied as part of this code edit.

## Environment and Netlify

Required server-side variables:

- `DATABASE_URL`: Supabase pooled PostgreSQL connection; use `pgbouncer=true` for the transaction pooler.
- `DIRECT_URL`: Supabase direct or session-pooler PostgreSQL URL for schema operations.
- `SESSION_SECRET`: independent random secret, at least 32 characters. There is no insecure fallback.
- **New:** `CONCIERGE_SECRET`: independent cryptographically random secret, at least 32 characters. Used for encrypted conversation state and hashed abuse counters. Rotation invalidates in-progress chats.
- `OPENAI_API_KEY`: server-side OpenAI key.
- `OPENAI_MODEL`: default `gpt-4o-mini`; must support Chat Completions strict JSON Schema and `max_completion_tokens`.

Optional new public variable: `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, international format). Empty/invalid values hide the shortcut. Public variables are baked into the client at build time.

Set these in the appropriate Netlify deployment context. Never prefix secrets with `NEXT_PUBLIC_`. Use the existing Next.js deployment adapter and `npm run build`. Publish only after the database upgrade. Configure runtime functions to finish after the provider's 25-second timeout plus database work. Verify `NETLIFY=true` and Netlify's trusted `x-nf-client-connection-ip` header are available at runtime. Outside Netlify the limiter intentionally uses a shared `local` bucket; configure a trusted-proxy integration before deploying on another host. Limits are 40 chat requests and 10 public enquiries per ten minutes per IP. Counters are atomic across instances; old hashed buckets are cleaned by successful requests. Origin checks complement, rather than replace, rate limits. Set provider project budgets and Netlify edge abuse protection for attacks distributed across IPs.

The dashboard is the reliable primary notification destination. There is no existing notification service to reuse. Optional future email notifications should be delivered by a durable outbox/worker after persistence so mail failure never loses or duplicates an enquiry.

## Validation and release checklist

`npm test` runs route integration tests with mocked Prisma/provider boundaries and real request validation/encryption. It covers general exploration, volunteered details, validation, confirmation, correction/refusal, failed saves, duplicate confirmations, forged state/history, abuse, origin validation, public-form spoofing and provider failure. `npm run typecheck` checks the full project. `npm run build` generates Prisma and builds Next.js.

Before release on staging with the database upgrade and real provider credentials:

1. Ask about a published development's price/features, an unpublished property, missing availability, and company services. Confirm answers against the database. Try requesting private admin data and overriding system instructions.
2. Request a viewing, volunteer multiple details, correct an email/phone, interrupt with a property question, decline, then resume. Review and confirm. Verify one new row in both admin sections, including consent and the specific request. Repeat confirmation/retry and verify no duplicate. Test with a contact already present in an unrelated enquiry.
3. Change follow-up status; sign out and verify admin pages/actions cannot be used. Verify Supabase anon/authenticated roles cannot read Enquiry.
4. Simulate provider and database failure. Ensure the widget offers retry and never displays a success receipt until persistence succeeds.
5. On physical iOS Safari and Android Chrome, open the keyboard at narrow widths, scroll messages, rotate the phone, close/reopen, use suggestions and keyboard navigation. Confirm the header/close button and input remain within the visual viewport.

Mocked tests do not validate actual OpenAI conversational quality, PostgreSQL concurrency, Netlify proxy configuration or physical mobile keyboards. Those require the staging smoke tests above.

OpenAI API format reference: https://developers.openai.com/api/docs/guides/structured-outputs

## Verification results for this change

- Integration suite: 13 scenarios passed (Node reports 14 tests including the parent test), no failures. Provider and database boundaries were mocked.
- TypeScript: passed, including a final check with incremental output disabled.
- Production build: passed from an isolated copy of the final source. Shared-workspace builds intermittently lost generated `.next` modules; isolated output removed that interference. The uncached build needed network permission to download the existing Fraunces Google Font.
- `git diff --check`: passed.
- Live database migration, real-provider lead submission, authenticated browser review and physical-device keyboard tests: not executed.

The form flow was verified against the live local API: HTTP 200 with all five form fields and no submission before confirmation. The 13 integration scenarios and TypeScript checks pass.
