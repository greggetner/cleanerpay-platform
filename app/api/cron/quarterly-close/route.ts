import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stub: when Vercel cron fires this on the 1st of each new quarter,
// it will finalize bonus_calculations for the just-closed period
// and (with approval) create bonus turnover_payments at status='pending'.
// v1: do nothing; return shape only. No ACH ever fires here.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;
  if (expected && auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    stub: true,
    note: "quarterly-close stub. No payments created. Finalization logic lands when admin approval flow exists.",
  });
}
