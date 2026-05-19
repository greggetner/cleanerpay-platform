export type HospitableReviewPayload = {
  action?: string;
  property_id?: string;
  data?: Record<string, unknown>;
  [k: string]: unknown;
};

type AnyRecord = Record<string, unknown>;
function obj(v: unknown): AnyRecord {
  return v && typeof v === "object" ? (v as AnyRecord) : {};
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function extractPropertyId(payload: HospitableReviewPayload): string | undefined {
  const data = obj(payload.data);
  const prop = obj(data.property);
  const fromProp = typeof prop.id === "string" ? prop.id : undefined;
  const fromData = typeof data.property_id === "string" ? data.property_id : undefined;
  const fromTop = typeof payload.property_id === "string" ? payload.property_id : undefined;
  return fromProp ?? fromData ?? fromTop;
}

export function extractReview(payload: HospitableReviewPayload) {
  const review = obj(payload.data);
  const priv = obj(review.private);
  const pub = obj(review.public);
  const detailedRatings = Array.isArray(priv.detailed_ratings)
    ? (priv.detailed_ratings as Array<{ type?: string; rating?: number }>)
    : [];
  const cleanlinessEntry = detailedRatings.find((r) => r?.type === "cleanliness");
  const cleanliness: number | null =
    cleanlinessEntry && typeof cleanlinessEntry.rating === "number"
      ? cleanlinessEntry.rating
      : null;
  const publicReview = str(pub.review);
  const privateFeedback = str(priv.feedback);
  const reviewedAt = str(review.reviewed_at) || new Date().toISOString();
  const dateStr = reviewedAt.slice(0, 10);
  const reviewId = str(review.id);
  const reservation = obj(review.reservation);
  const reservationId = str(reservation.id);
  const guest = obj(review.guest);
  const guestFirst = str(guest.first_name);
  const guestLast = str(guest.last_name);
  const guestName = [guestFirst, guestLast].filter(Boolean).join(" ") || "guest";
  return {
    cleanliness,
    publicReview,
    privateFeedback,
    reviewedAt,
    dateStr,
    reviewId,
    reservationId,
    guestFirst,
    guestLast,
    guestName,
  };
}

export function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
