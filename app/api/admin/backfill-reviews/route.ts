import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceSupabase } from "@/lib/supabase/server";
import { listAllPropertyReviews } from "@/lib/hospitable/client";
import { classifyComplaint } from "@/lib/cleaner-bonus/classifier";
import { truncate } from "@/lib/hospitable/payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return NextResponse.json({ error: "ADMIN_TOKEN not configured" }, { status: 500 });
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${adminToken}`) return unauthorized();

  const url = new URL(req.url);
  const hostEmail = (url.searchParams.get("host_email") || "greg@cleanerpay.ai").toLowerCase();
  const classifyParam = url.searchParams.get("classify");
  const classify = classifyParam == null ? true : classifyParam === "1" || classifyParam === "true";
  const since = url.searchParams.get("since");

  const sb = getServiceSupabase();
  const { data: host } = await sb.from("hosts").select("id").ilike("email", hostEmail).maybeSingle();
  if (!host) return NextResponse.json({ error: `host not found for email=${hostEmail}` }, { status: 404 });

  const { data: properties } = await sb
    .from("properties")
    .select("id, name, hospitable_property_id")
    .eq("host_id", host.id)
    .not("hospitable_property_id", "is", null);

  const anthropic = classify && process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  const summary: Array<Record<string, unknown>> = [];
  for (const p of properties || []) {
    let reviews;
    try {
      reviews = await listAllPropertyReviews(p.hospitable_property_id!);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      summary.push({ property: p.name, error: message });
      continue;
    }
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let classified = 0;
    for (const rv of reviews) {
      const reviewedAt = rv.reviewed_at || new Date().toISOString();
      if (since && reviewedAt < since) {
        skipped++;
        continue;
      }
      const cleanlinessEntry = rv.private?.detailed_ratings?.find((d) => d.type === "cleanliness");
      const cleanliness = cleanlinessEntry ? Number(cleanlinessEntry.rating) : null;
      const guest = [rv.guest?.first_name, rv.guest?.last_name].filter(Boolean).join(" ") || "guest";
      const publicReview = rv.public?.review || "";
      const privateFeedback = rv.private?.feedback || "";

      let classification: { flag: string; type: string } | null = null;
      if (anthropic && (publicReview || privateFeedback)) {
        try {
          classification = await classifyComplaint(anthropic, publicReview, privateFeedback);
          classified++;
        } catch (err) {
          console.warn("classify failed for review", rv.id, err);
        }
      }

      const row = {
        host_id: host.id,
        property_id: p.id,
        hospitable_review_id: rv.id,
        hospitable_reservation_id: rv.reservation?.id || null,
        guest_name: guest,
        reviewed_at: reviewedAt,
        cleanliness_score: cleanliness,
        public_review: truncate(publicReview, 4000),
        private_feedback: truncate(privateFeedback, 4000),
        classification: classification?.flag ?? null,
        classification_type: classification?.type ?? null,
        raw_payload: rv as unknown as Record<string, unknown>,
      };

      const { data: existing } = await sb
        .from("reviews")
        .select("id")
        .eq("hospitable_review_id", rv.id)
        .maybeSingle();

      const { error } = await sb
        .from("reviews")
        .upsert(row, { onConflict: "hospitable_review_id" });
      if (error) {
        console.error("upsert failed", error);
        continue;
      }
      if (existing) updated++;
      else inserted++;
    }
    summary.push({
      property: p.name,
      hospitable_property_id: p.hospitable_property_id,
      fetched: reviews.length,
      inserted,
      updated,
      skipped,
      classified,
    });
  }

  return NextResponse.json({ ok: true, host_email: hostEmail, classify, summary });
}
