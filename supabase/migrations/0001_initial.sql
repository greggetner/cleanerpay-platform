-- CleanerPay initial schema
-- Conventions: all tables have id uuid pk default gen_random_uuid(), created_at default now(), updated_at via trigger.
-- All RLS enabled; service role only by default. Per-host RLS comes later when auth is wired.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- signups (marketing-page lead capture)
-- ============================================================
create table public.signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  property_count text,
  source text default 'marketing_site',
  notes text,
  converted_host_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index signups_email_idx on public.signups (lower(email));
create trigger signups_set_updated_at before update on public.signups
  for each row execute function public.set_updated_at();

-- ============================================================
-- hosts (customers of CleanerPay)
-- ============================================================
create table public.hosts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  plan text not null default 'self',
  hospitable_api_token_ciphertext text,
  mercury_account_id text,
  slug text unique,
  notification_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index hosts_email_idx on public.hosts (lower(email));
create trigger hosts_set_updated_at before update on public.hosts
  for each row execute function public.set_updated_at();

-- ============================================================
-- properties
-- ============================================================
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  name text not null,
  hospitable_property_id text,
  turnover_amount_cents integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index properties_host_id_idx on public.properties (host_id);
create unique index properties_hospitable_property_id_idx on public.properties (hospitable_property_id)
  where hospitable_property_id is not null;
create trigger properties_set_updated_at before update on public.properties
  for each row execute function public.set_updated_at();

-- ============================================================
-- cleaners
-- ============================================================
create table public.cleaners (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  mercury_recipient_id text,
  active boolean not null default true,
  slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cleaners_host_id_idx on public.cleaners (host_id);
create unique index cleaners_slug_idx on public.cleaners (slug) where slug is not null;
create trigger cleaners_set_updated_at before update on public.cleaners
  for each row execute function public.set_updated_at();

-- ============================================================
-- cleaner_property_assignments
-- ============================================================
create table public.cleaner_property_assignments (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  cleaner_id uuid not null references public.cleaners(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  role text not null default 'lead',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cleaner_id, property_id)
);
create index cpa_host_id_idx on public.cleaner_property_assignments (host_id);
create index cpa_cleaner_id_idx on public.cleaner_property_assignments (cleaner_id);
create index cpa_property_id_idx on public.cleaner_property_assignments (property_id);
create trigger cpa_set_updated_at before update on public.cleaner_property_assignments
  for each row execute function public.set_updated_at();

-- ============================================================
-- stays (turnover-relevant stay records)
-- ============================================================
create table public.stays (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  hospitable_reservation_id text,
  guest_name text,
  check_in date,
  check_out date,
  nights integer,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index stays_host_id_idx on public.stays (host_id);
create index stays_property_id_idx on public.stays (property_id);
create unique index stays_hospitable_reservation_id_idx on public.stays (hospitable_reservation_id)
  where hospitable_reservation_id is not null;
create trigger stays_set_updated_at before update on public.stays
  for each row execute function public.set_updated_at();

-- ============================================================
-- reviews
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  stay_id uuid references public.stays(id) on delete set null,
  hospitable_review_id text,
  hospitable_reservation_id text,
  guest_name text,
  reviewed_at timestamptz not null,
  cleanliness_score numeric(3,2),
  overall_score numeric(3,2),
  public_review text,
  private_feedback text,
  classification text check (classification in ('none','minor','major','flag')),
  classification_type text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_host_id_idx on public.reviews (host_id);
create index reviews_property_id_idx on public.reviews (property_id);
create index reviews_reviewed_at_idx on public.reviews (reviewed_at);
create unique index reviews_hospitable_review_id_idx on public.reviews (hospitable_review_id)
  where hospitable_review_id is not null;
create trigger reviews_set_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- ============================================================
-- turnover_payments (per-stay cleaner pay, v1 ALWAYS pending)
-- ============================================================
create table public.turnover_payments (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  stay_id uuid references public.stays(id) on delete set null,
  cleaner_id uuid references public.cleaners(id) on delete set null,
  amount_cents integer not null,
  status text not null default 'pending',
  mercury_transfer_id text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  settled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index turnover_payments_host_id_idx on public.turnover_payments (host_id);
create index turnover_payments_property_id_idx on public.turnover_payments (property_id);
create index turnover_payments_stay_id_idx on public.turnover_payments (stay_id);
create index turnover_payments_cleaner_id_idx on public.turnover_payments (cleaner_id);
create index turnover_payments_status_idx on public.turnover_payments (status);
create trigger turnover_payments_set_updated_at before update on public.turnover_payments
  for each row execute function public.set_updated_at();

-- ============================================================
-- expense_payments (cleaner-submitted reimbursements)
-- ============================================================
create table public.expense_payments (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  cleaner_id uuid references public.cleaners(id) on delete set null,
  amount_cents integer not null,
  description text,
  receipt_url text,
  status text not null default 'pending',
  approved_at timestamptz,
  mercury_transfer_id text,
  sent_at timestamptz,
  settled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index expense_payments_host_id_idx on public.expense_payments (host_id);
create index expense_payments_property_id_idx on public.expense_payments (property_id);
create index expense_payments_cleaner_id_idx on public.expense_payments (cleaner_id);
create index expense_payments_status_idx on public.expense_payments (status);
create trigger expense_payments_set_updated_at before update on public.expense_payments
  for each row execute function public.set_updated_at();

-- ============================================================
-- bonus_periods (quarter windows)
-- ============================================================
create table public.bonus_periods (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  label text not null,
  year integer not null,
  quarter integer not null check (quarter between 1 and 4),
  start_date date not null,
  end_date date not null,
  status text not null default 'active' check (status in ('active','closed','paid')),
  closed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (host_id, year, quarter)
);
create index bonus_periods_host_id_idx on public.bonus_periods (host_id);
create trigger bonus_periods_set_updated_at before update on public.bonus_periods
  for each row execute function public.set_updated_at();

-- ============================================================
-- bonus_calculations (per cleaner x property x period)
-- ============================================================
create table public.bonus_calculations (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.hosts(id) on delete cascade,
  bonus_period_id uuid not null references public.bonus_periods(id) on delete cascade,
  cleaner_id uuid not null references public.cleaners(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  review_count integer not null default 0,
  avg_score numeric(4,3),
  minor_count integer not null default 0,
  major_count integer not null default 0,
  tier text not null,
  payout_cents integer not null default 0,
  status text not null default 'projected' check (status in ('projected','final','paid')),
  paid_at timestamptz,
  mercury_transfer_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bonus_period_id, cleaner_id, property_id)
);
create index bonus_calculations_host_id_idx on public.bonus_calculations (host_id);
create index bonus_calculations_period_idx on public.bonus_calculations (bonus_period_id);
create index bonus_calculations_cleaner_idx on public.bonus_calculations (cleaner_id);
create index bonus_calculations_property_idx on public.bonus_calculations (property_id);
create trigger bonus_calculations_set_updated_at before update on public.bonus_calculations
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS: enable, service-role-only by default
-- ============================================================
alter table public.signups enable row level security;
alter table public.hosts enable row level security;
alter table public.properties enable row level security;
alter table public.cleaners enable row level security;
alter table public.cleaner_property_assignments enable row level security;
alter table public.stays enable row level security;
alter table public.reviews enable row level security;
alter table public.turnover_payments enable row level security;
alter table public.expense_payments enable row level security;
alter table public.bonus_periods enable row level security;
alter table public.bonus_calculations enable row level security;

-- service_role bypasses RLS by default in Supabase; no public policies until auth is wired.
