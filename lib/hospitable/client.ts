const BASE_URL = "https://public.api.hospitable.com";

function authHeaders(): HeadersInit {
  const token = process.env.HOSPITABLE_API_TOKEN;
  if (!token) throw new Error("HOSPITABLE_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export type HospitableReview = {
  id: string;
  reviewed_at?: string;
  public?: { review?: string; rating?: number };
  private?: {
    feedback?: string;
    detailed_ratings?: Array<{ type: string; rating: number }>;
  };
  guest?: { first_name?: string; last_name?: string; id?: string };
  reservation?: { id?: string; check_in?: string; check_out?: string };
};

export type HospitableReservation = {
  id: string;
  check_in?: string;
  check_out?: string;
  start_date?: string;
  end_date?: string;
  nights?: number;
  guests?: number;
  number_of_guests?: number;
  status?: string;
  property?: { id?: string };
};

export async function listPropertyReviews(
  propertyId: string,
  opts: { perPage?: number; page?: number } = {},
): Promise<HospitableReview[]> {
  const perPage = opts.perPage ?? 100;
  const page = opts.page ?? 1;
  const url = `${BASE_URL}/v2/properties/${propertyId}/reviews?include=guest,reservation&per_page=${perPage}&page=${page}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hospitable reviews fetch failed: ${res.status} ${text}`);
  }
  const body = await res.json();
  return (body.data || []) as HospitableReview[];
}

export async function listAllPropertyReviews(
  propertyId: string,
): Promise<HospitableReview[]> {
  const all: HospitableReview[] = [];
  let page = 1;
  while (true) {
    const batch = await listPropertyReviews(propertyId, { perPage: 100, page });
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
    if (page > 50) break;
  }
  return all;
}

export async function fetchNextReservation(
  propertyId: string,
): Promise<HospitableReservation | null> {
  const today = new Date().toISOString().slice(0, 10);
  const url = `${BASE_URL}/v2/reservations?property_ids[]=${propertyId}&start_date=${today}&per_page=5`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) return null;
  const body = await res.json();
  const items = ((body.data || []) as HospitableReservation[]).filter(
    (r) => (r.check_in || r.start_date || "") >= today,
  );
  items.sort((a, b) =>
    (a.check_in || a.start_date || "").localeCompare(b.check_in || b.start_date || ""),
  );
  return items[0] || null;
}
