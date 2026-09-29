-- Additive upgrade for existing PostgreSQL databases managed with prisma db push.
BEGIN;
ALTER TABLE "Enquiry" ADD COLUMN IF NOT EXISTS "submissionKey" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN IF NOT EXISTS "consentAt" TIMESTAMP(3);
ALTER TABLE "Enquiry" ADD COLUMN IF NOT EXISTS "consentText" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Enquiry_submissionKey_key" ON "Enquiry"("submissionKey");
CREATE TABLE IF NOT EXISTS "PublicRateLimit" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 1,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "PublicRateLimit_expiresAt_idx" ON "PublicRateLimit"("expiresAt");
-- Prisma uses the server-side database role. Do not expose these tables via Supabase's public API.
ALTER TABLE "PublicRateLimit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "Enquiry", "PublicRateLimit" FROM anon, authenticated;
COMMIT;
