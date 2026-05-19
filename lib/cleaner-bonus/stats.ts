import type { PropertyStats } from "./tiers";

export type ReviewRow = {
  reviewed_at: string;
  cleanliness_score: number | null;
  classification: "none" | "minor" | "major" | "flag" | null;
};

export function calcPropertyStats(
  rows: ReviewRow[],
  quarterStart: string,
  quarterEnd: string,
): PropertyStats {
  const inQ = rows.filter(
    (r) => r.reviewed_at >= quarterStart && r.reviewed_at <= `${quarterEnd}T23:59:59Z`,
  );
  const scores = inQ
    .map((r) => (r.cleanliness_score == null ? NaN : Number(r.cleanliness_score)))
    .filter((n) => !isNaN(n));
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const minor = inQ.filter((r) => r.classification === "minor").length;
  const major = inQ.filter((r) => r.classification === "major").length;
  return { count: inQ.length, avg, minor, major };
}
