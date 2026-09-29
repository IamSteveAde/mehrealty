# MEH Realty — Digital Experience Platform

A Next.js 15 / Tailwind CSS luxury real-estate website with a private Prisma-powered CMS and optional AI concierge.

## Included
- Editorial homepage, intelligent visitor pathways, property catalogue, development detail pages, services, brand story, journal, media gallery and private enquiry form.
- Admin login, overview, CRUD for developments and journal posts, media gallery, enquiries and settings.
- Local image uploader for persistent-hosting environments; optional OpenAI concierge with a rules-based fallback.
- SEO metadata, dynamic sitemap, robots, responsive layouts.

## Quick start
1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env` and configure **strong** `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. Run `npm run setup` to create and seed the SQLite database.
4. Run `npm run dev` and open http://localhost:3000.
5. Admin: http://localhost:3000/admin/login, using the credentials set in `.env`.

## Development and build output

`npm run dev` writes to `.next-dev`; `npm run build` and `npm start` use `.next`. This keeps production builds from replacing manifests and webpack chunks used by a running development server. Both directories are generated and ignored by Git. Restart an already-running dev server if it still reports errors referencing the old `.next` directory after updating the configuration.

## Important launch checklist
- **All demo images are illustrative Unsplash placeholders, not MEH property photographs.** Replace with licensed/approved property images, and verify all development descriptions, specifications, status and availability before launch.
- This is a functional starter, not a finished audited production deployment. Use PostgreSQL and managed object storage (S3/Cloudinary) for horizontally scaled/serverless hosting. SQLite and local uploads are suited to a single persistent server.
- Add email/CRM notifications for enquiries; currently they are saved in the admin database.
- Protect the admin with stronger operational security: login rate limiting, MFA, audit logs, secure hosting, backups and monitoring. Use a strong session secret and HTTPS.
- OpenAI is optional. Set `OPENAI_API_KEY` to enable generated responses. The fallback assistant is deterministic. Validate knowledge and do not promise bookings or returns.
- Admin settings are stored, but public contact text is currently static and should be connected before launch.
- No checkout, real-time unit inventory, live booking calendar, external CRM, or payment gateway is included.
- `npm run setup` seeds demo projects and a demo article. Replace demo content before publishing.

## Structure
- `app/` public routes, API routes, admin pages and server actions.
- `components/` UI and CMS forms.
- `prisma/` SQLite schema and seed.
- `lib/` database, authentication and helpers.

## Deploy
Use a persistent Node.js host for the included SQLite/local upload implementation. Set `NEXT_PUBLIC_SITE_URL` to the production origin and configure backups. For Vercel, migrate the Prisma datasource to PostgreSQL and replace local uploads with object storage before deploying.
