import { createHmac } from "node:crypto";
import { db } from "./db";
export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function readPublicJson(req: Request, maxBytes = 64000): Promise<unknown> {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) throw new RequestError(403, "Please use the form on this website.");
  if (!req.headers.get("content-type")?.includes("application/json")) throw new RequestError(415, "JSON required.");
  const reader = req.body?.getReader();
  if (!reader) throw new RequestError(400, "Missing request.");
  let size = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const {done, value} = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new RequestError(413, "Message too large."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new RequestError(400, "Invalid request."); }
}
// Shared PostgreSQL counter: works across Netlify instances. Never trust public x-forwarded-for.
export async function rateLimit(req: Request, scope: string, limit: number) {
  const secret = process.env.CONCIERGE_SECRET;
  if (!secret || secret.length < 32) throw new Error("Rate limit secret missing");
  const ip = process.env.NETLIFY === "true" ? req.headers.get("x-nf-client-connection-ip") || "unknown" : "local";
  const identity = createHmac("sha256", secret).update(`${scope}:${ip}`).digest("hex");
  const window = Math.floor(Date.now() / 600000);
  const key = `${identity}:${window}`;
  const bucket = await db.publicRateLimit.upsert({where: {key},
    create: {key, count: 1, expiresAt: new Date((window + 1) * 600000)}, update: {count: {increment: 1}},
  });
  if (bucket.count > limit) throw new RequestError(429, "Please wait a few minutes before trying again.");
  // Bounded lifetime for hashed identifiers; no raw IP or chat content is stored here.
  await db.publicRateLimit.deleteMany({where: {expiresAt: {lt: new Date(Date.now() - 3600000)}}});
}
