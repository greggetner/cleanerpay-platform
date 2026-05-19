import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase/server";
import { extractPropertyId, extractReview, truncate } from "@/lib/hospitable/payload";
import { classifyComplaint } from "@/lib/cleaner-bonus/classifier";
import { calcPropertyStats } from "@/lib/cleaner-bonus/stats";
import { tierFor } from "@/lib/cleaner-bonus/tiers";
import { quarterForDate } from "@/lib/cleaner-bonus/quarter";
import { writeEmail } from "@/lib/cleaner-bonus/email-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let payload: import("@/lib/hospitable/payload").HospitableReviewPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload?.action !== "review.created") {
    return NextResponse.json({ skipped: "non-review action", action: payload?.action });
  }

  const propertyId = extractPropertyId(payload);
  if (!propertyId) {
    return NextResponse.json({ skipped: "no property id", payload }, { status: 200 });
  }

  const sb = getServiceSupabase();

  const { data: property, error: propErr } = await sb
    .from("properties")
    .select("id, host_id, name")
    .eq("hospitable_property_id", propertyId)
    .maybeSingle();
  if (propErr) {
    console.error("property lookup failed", propErr);
    return NextResponse.json({ error: "property lookup failed" }, { status: 500 });
  }
  if (!property) {
    return NextResponse.json({ skipped: "unknown property", propertyId });
  }

  const r = extractReview(payload);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const classification = await classifyComplaint(anthropic, r.publicReview, r.privateFeedback);

  const { error: upErr } = await sb
    .from("reviews")
    .upsert(
      {
        host_id: property.host_id,
        property_id: property.id,
        hospitable_review_id: r.reviewId || null,
        hospitable_reservation_id: r.reservationId || null,
        guest_name: r.guestName,
        reviewed_at: r.reviewedAt,
        cleanliness_score: r.cleanliness,
        public_review: truncate(r.publicReview, 4000),
        private_feedback: truncate(r.privateFeedback, 4000),
        classification: classification.flag,
        classification_type: classification.type,
        raw_payload: payload,
      },
      { onConflict: "hospitable_review_id" },
    );
  if (upErr) {
    console.error("review upsert failed", upErr);
    return NextResponse.json({ error: "review upsert failed" }, { status: 500 });
  }

  const quarter = quarterForDate(r.reviewedAt);
  const { data: qReviews } = await sb
    .from("reviews")
    .select("reviewed_at, cleanliness_score, classification")
    .eq("property_id", property.id)
    .gte("reviewed_at", quarter.start)
    .lte("reviewed_at", `${quarter.end}T23:59:59Z`);

  const stats = calcPropertyStats(qReviews || [], quarter.start, quarter.end);
  const propertyTier = tierFor(stats);

  const { data: allProps } = await sb
    .from("properties")
    .select("id, name")
    .eq("host_id", property.host_id)
    .eq("active", true);

  let projectedTotal = 0;
  for (const p of allProps || []) {
    const { data: pRev } = await sb
      .from("reviews")
      .select("reviewed_at, cleanliness_score, classification")
      .eq("property_id", p.id)
      .gte("reviewed_at", quarter.start)
      .lte("reviewed_at", `${quarter.end}T23:59:59Z`);
    projectedTotal += tierFor(calcPropertyStats(pRev || [], quarter.start, quarter.end)).payout;
  }

  let emailResult: { id?: string } | null = null;
  if (process.env.RESEND_API_KEY) {
    const email = await writeEmail(anthropic, {
      propertyName: property.name,
      guestName: r.guestName,
      cleanliness: r.cleanliness,
      publicReview: r.publicReview,
      privateFeedback: r.privateFeedback,
      classification,
      propertyStats: stats,
      propertyTier,
      projectedTotal,
      quarterLabel: quarter.label,
    });
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data: sendData, error: sendErr } = await resend.emails.send({
      from: "CleanerPay <notifications@cleanerpay.ai>",
      to: ["johnrichichi5858@gmail.com", "top2bottom88@aol.com", "greg.getner@gmail.com"],
      subject: email.subject,
      text: email.body,
    });
    if (sendErr) {
      console.error("resend send failed", sendErr);
    } else {
      emailResult = sendData;
    }
  }

  return NextResponse.json({
    ok: true,
    property: property.name,
    cleanliness: r.cleanliness,
    classification,
    tier: propertyTier.label,
    projectedTotal,
    emailId: emailResult?.id || null,
  });
}
