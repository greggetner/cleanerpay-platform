import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  property_count: z.string().min(1).max(50),
});

export async function POST(req: Request) {
  let parsed;
  try {
    const json = await req.json();
    parsed = Body.parse(json);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("signups")
    .insert({
      name: parsed.name,
      email: parsed.email,
      property_count: parsed.property_count,
      source: "marketing_site",
    })
    .select("id")
    .single();

  if (error) {
    console.error("signup insert failed", error);
    return NextResponse.json({ error: "Could not save signup" }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "CleanerPay <notifications@cleanerpay.ai>",
        to: ["greg@cleanerpay.ai"],
        replyTo: parsed.email,
        subject: `CleanerPay signup: ${parsed.name} (${parsed.property_count})`,
        text: [
          `New signup on cleanerpay.ai`,
          ``,
          `Name: ${parsed.name}`,
          `Email: ${parsed.email}`,
          `Properties: ${parsed.property_count}`,
          ``,
          `Signup id: ${data.id}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("signup notify failed", err);
    }
  }

  return NextResponse.json({ ok: true, id: data.id });
}
