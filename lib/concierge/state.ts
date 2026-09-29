import { createHash, randomUUID } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { z } from "zod";

export const draftSchema = z.object({
  name: z.string().max(120).nullable(), email: z.string().max(200).nullable(),
  phone: z.string().max(40).nullable(), development: z.string().max(200).nullable(),
  request: z.string().max(2000).nullable(), summary: z.string().max(2000),
  enquiryType: z.enum(["general", "development", "viewing", "callback", "investment"]),
  wantsFollowUp: z.boolean(),
});
export type Draft = z.infer<typeof draftSchema>;
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).transform(v => v.toLowerCase()),
  phone: z.string().trim().max(40).regex(/^\+?[\d\s().-]+$/).refine(v => {
    const digits = v.replace(/\D/g, ""); return digits.length >= 7 && digits.length <= 15;
  }, "Enter a valid phone number"),
  development: z.string().trim().min(2).max(200),
  request: z.string().trim().min(2).max(2000), summary: z.string().max(2000),
  enquiryType: draftSchema.shape.enquiryType,
});
const stateSchema = z.object({
  id: z.string().uuid(), draft: draftSchema.nullable(), pending: z.boolean(), submitted: z.boolean(),
  history: z.array(z.object({role: z.enum(["user", "assistant"]), content: z.string().max(5000)})).max(16),
});
export type State = z.infer<typeof stateSchema>;
function key() {
  const secret = process.env.CONCIERGE_SECRET;
  if (!secret || secret.length < 32) throw new Error("Concierge secret is not configured");
  return createHash("sha256").update(secret).digest();
}
export function newState(): State { return {id: randomUUID(), draft: null, pending: false, submitted: false, history: []}; }
export async function sealState(state: State) {
  return new EncryptJWT(state).setProtectedHeader({alg: "dir", enc: "A256GCM"})
    .setIssuer("meh-concierge").setAudience("concierge-chat").setIssuedAt().setExpirationTime("2h").encrypt(key());
}
export async function openState(token: string) {
  const {payload} = await jwtDecrypt(token, key(), {issuer: "meh-concierge", audience: "concierge-chat"});
  return stateSchema.parse(payload);
}
// Only an unambiguous reply to the server's own summary can submit. Other wording goes back to conversation.
export function confirms(message: string) {
  return /^(yes[,.]?\s*(please)?|i confirm|i agree|please submit|yes,? you may contact me)[.!]?$/i.test(message.trim());
}
export function confirmation(draft: Draft) {
  const lead = leadSchema.parse(draft);
  return `Please review your enquiry:\n\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nProperty or preference: ${lead.development}\nRequest: ${lead.request}\nSummary: ${lead.summary || lead.request}\n\nMay MEH Realty contact you using these details about this enquiry? Reply “Yes, please” to confirm, or tell me what to change. Nothing has been submitted yet.`;
}
export function missingDetail(draft: Draft) {
  const labels = {name: "May I have your full name?", email: "What is the best email address to reach you?", phone: "Which phone number should our team use, including the country code?", development: "Which development interests you, or what kind of property are you looking for?", request: "What would you like our team to help you with?"};
  for (const field of ["name", "email", "phone", "development", "request"] as const) {
    if (!leadSchema.shape[field].safeParse(draft[field]).success) return labels[field];
  }
  return null;
}
