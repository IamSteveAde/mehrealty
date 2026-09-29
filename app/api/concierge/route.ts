import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { readPublicJson, rateLimit, RequestError } from "@/lib/public-request";
import { confirms, confirmation, leadSchema, newState, openState, sealState } from "@/lib/concierge/state";
import { converse } from "@/lib/concierge/ai";
export const runtime = "nodejs";
const detailsSchema = leadSchema.pick({name: true, email: true, phone: true, development: true, request: true}).strict();
const requestSchema = z.object({details: detailsSchema.optional(), message: z.string().trim().min(1).max(2000), state: z.string().max(60000).optional()}).strict();
const json = (body: unknown, status = 200) => NextResponse.json(body, {status, headers: {"Cache-Control": "no-store", ...(status === 429 ? {"Retry-After": "600"} : {})}});
export async function POST(req: Request) {
  let stage = "request_validation";
  try {
    const input = requestSchema.parse(await readPublicJson(req));
    stage = "rate_limit";
    await rateLimit(req, "concierge", 40);
    stage = "conversation_state";
    let state;
    try { state = input.state ? await openState(input.state) : newState(); }
    catch { throw new RequestError(409, "This chat has expired. Please start a new chat."); }
    let reply: string;
    let leadForm = null;
    if (input.details) {
      if (!input.state || !state.draft?.wantsFollowUp || state.submitted) {
        throw new RequestError(409, "Please request a follow-up in the chat first.");
      }
      // Form values are authoritative; never ask the model to reinterpret contact information.
      state.draft = {...state.draft, ...input.details,
        summary: `${input.details.development}: ${input.details.request}`.slice(0, 2000)};
      state.pending = true;
      reply = confirmation(state.draft);
    } else if (state.pending && !state.submitted && confirms(input.message)) {
      const lead = leadSchema.parse(state.draft);
      // Unique conversation key prevents retries/concurrent confirmations from duplicating or overwriting leads.
      stage = "save_enquiry";
      await db.enquiry.upsert({where: {submissionKey: state.id}, update: {}, create: {
        submissionKey: state.id, name: lead.name, email: lead.email, phone: lead.phone,
        interest: lead.development, developmentOfInterest: lead.development, message: lead.request,
        conversationSummary: lead.summary || lead.request, enquiryType: lead.enquiryType,
        source: "AI Concierge", status: "New", consentAt: new Date(),
        consentText: `${confirmation(state.draft!)}\nVisitor confirmation: ${input.message}`,
      }});
      state.pending = false; state.submitted = true;
      reply = "Thank you. Your enquiry has been submitted to the MEH Realty team. They’ll follow up using the contact details you confirmed.";
    } else {
      stage = "knowledge_lookup";
      const [projects, settings] = await Promise.all([
        db.project.findMany({where: {published: true}, orderBy: {title: "asc"}, select: {
          title: true, slug: true, location: true, category: true, status: true, excerpt: true,
          description: true, amenities: true, price: true, bedrooms: true, size: true,
        }}),
        db.setting.findMany({where: {key: {in: ["phone", "email", "address", "conciergeKnowledge"]}}, select: {key: true, value: true}}),
      ]);
      stage = "ai_response";
      const result = await converse(state, input.message, {
        projects: projects.map(p => ({...p, url: `/developments/${p.slug}`})), settings,
      });
      state.draft = result.draft; state.pending = false;
      reply = result.reply;
      if (!state.submitted && result.draft.wantsFollowUp && result.collectNow) {
        leadForm = Object.fromEntries(["name", "email", "phone", "development", "request"].map(field =>
          [field, result.draft[field as keyof typeof result.draft] || ""]));
        reply = "Please enter or check your details in the form below. You can review everything before allowing our team to contact you.";
      }
    }
    state.history = [...state.history, {role: "user" as const, content: input.message}, {role: "assistant" as const, content: reply}].slice(-16);
    while (Buffer.byteLength(JSON.stringify(state.history), "utf8") > 22000 && state.history.length > 2) state.history.splice(0, 2);
    stage = "encrypt_response";
    return json({reply, leadForm, state: await sealState(state), confirmationRequired: state.pending, submitted: state.submitted});
  } catch (error) {
    if (error instanceof RequestError) return json({error: error.message}, error.status);
    if (error instanceof z.ZodError) return json({error: "Please check your details and try again.", fieldErrors: error.flatten().fieldErrors}, 400);
    // Never log prompts, personal details, provider response bodies or database connection strings.
    console.error("Concierge request failed", {stage, kind: error instanceof Error ? error.name : "unknown"});
    return json({error: "I couldn’t complete that request. Please retry, or contact our team through /contact. I haven’t confirmed a submission."}, 503);
  }
}
