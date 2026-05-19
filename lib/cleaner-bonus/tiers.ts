export type TierKey = "nailed" | "green" | "yellow" | "red";

export type Tier = {
  key: TierKey;
  emoji: string;
  label: string;
  min: number;
  maxMinor: number;
  maxMajor: number;
  payout: number;
};

export const TIERS: Tier[] = [
  { key: "nailed", emoji: "🌟", label: "Nailed it", min: 4.9, maxMinor: 0, maxMajor: 0, payout: 333 },
  { key: "green", emoji: "🟢", label: "Green", min: 4.8, maxMinor: 1, maxMajor: 0, payout: 200 },
  { key: "yellow", emoji: "🟡", label: "Yellow", min: 4.7, maxMinor: 2, maxMajor: 0, payout: 83 },
];

export const RED: Tier = {
  key: "red",
  emoji: "🔴",
  label: "Red",
  min: 0,
  maxMinor: Number.POSITIVE_INFINITY,
  maxMajor: Number.POSITIVE_INFINITY,
  payout: 0,
};

export const MIN_REVIEWS_FOR_TIER = 3;

export type PropertyStats = {
  count: number;
  avg: number;
  minor: number;
  major: number;
};

export function tierFor(stats: PropertyStats): Tier {
  if (stats.count < MIN_REVIEWS_FOR_TIER) return TIERS[0];
  if (stats.major > 0) return RED;
  for (const t of TIERS) {
    if (stats.avg >= t.min && stats.minor <= t.maxMinor && stats.major <= t.maxMajor) return t;
  }
  return RED;
}

export const MAX_QUARTERLY_PER_CLEANER = 1000;
