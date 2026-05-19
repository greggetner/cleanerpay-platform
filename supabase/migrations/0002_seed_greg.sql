-- Seed: Greg's host + 3 properties + 2 cleaners + all assignments + Q2 2026 bonus period.
-- Idempotent on re-run via NOT EXISTS guards (avoiding ON CONFLICT on expression indexes).

insert into public.hosts (name, email, plan, slug, notification_email)
select 'Greg Getner', 'greg@cleanerpay.ai', 'self', 'greg', 'greg@cleanerpay.ai'
where not exists (
  select 1 from public.hosts where lower(email) = 'greg@cleanerpay.ai'
);

insert into public.properties (host_id, name, hospitable_property_id, turnover_amount_cents, active)
select h.id, v.name, v.hospitable_property_id, v.turnover_amount_cents, true
from public.hosts h
join (values
  ('Sedona Wellness Casita', 'f31b21db-09a8-4c6b-a465-0f3906c8a6bc', 8000),
  ('Uptown Sedona Haven',    '8aadcb1f-8e7c-44f2-9c4f-94c64c3f3f9c', 8000),
  ('Panoramic Red Rock Retreat', '860418c0-c89d-43bd-83f3-9dd617d128f0', 8000)
) as v(name, hospitable_property_id, turnover_amount_cents) on true
where lower(h.email) = 'greg@cleanerpay.ai'
on conflict (hospitable_property_id) where hospitable_property_id is not null do nothing;

insert into public.cleaners (host_id, name, email, slug, active)
select h.id, v.name, v.email, v.slug, true
from public.hosts h
join (values
  ('John Richichi', 'johnrichichi5858@gmail.com', 'john'),
  ('Tess', 'top2bottom88@aol.com', 'tess')
) as v(name, email, slug) on true
where lower(h.email) = 'greg@cleanerpay.ai'
on conflict (slug) where slug is not null do nothing;

insert into public.cleaner_property_assignments (host_id, cleaner_id, property_id, role, active)
select c.host_id, c.id, p.id, 'lead', true
from public.cleaners c
join public.properties p on p.host_id = c.host_id
where c.host_id = (select id from public.hosts where lower(email) = 'greg@cleanerpay.ai')
on conflict (cleaner_id, property_id) do nothing;

insert into public.bonus_periods (host_id, label, year, quarter, start_date, end_date, status)
select id, 'Q2 2026', 2026, 2, '2026-04-01', '2026-06-30', 'active'
from public.hosts
where lower(email) = 'greg@cleanerpay.ai'
on conflict (host_id, year, quarter) do nothing;
