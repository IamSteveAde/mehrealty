import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {z} from "zod";
import {rateLimit, readPublicJson, RequestError} from "@/lib/public-request";
const schema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(), interest: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(4000),
});
export async function POST(req: Request) {
  try {
    const data = schema.parse(await readPublicJson(req, 12000));
    await rateLimit(req, "enquiry", 10);
    // Source and workflow fields are server-owned; public callers cannot impersonate AI consent.
    await db.enquiry.create({data: {...data, email: data.email.toLowerCase(), phone: data.phone || null, source: "Website", status: "New", enquiryType: "general"}});
    return NextResponse.json({ok: true}, {headers: {"Cache-Control": "no-store"}});
  } catch (error) {
    const status = error instanceof RequestError ? error.status : error instanceof z.ZodError ? 400 : 503;
    return NextResponse.json({error: error instanceof RequestError ? error.message : status === 400 ? "Invalid enquiry" : "Unable to save your enquiry. Please try again."}, {status});
  }
}
