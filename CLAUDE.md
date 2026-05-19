# CleanerPay: repo-local instructions

## What this is

CleanerPay is the productized, multi-tenant version of Greg's STR cleaner-payment
infrastructure. Three flows in one place:

1. **Turnover Pay**: per-stay ACH the moment a cleaning is done.
2. **Expense Pay**: cleaner-submitted reimbursements with host approval.
3. **Incentive Pay**: quarterly bonuses tied to real review scores.

Live at `cleanerpay.ai`. V1 customer is Greg's own STR business (3 properties,
2 cleaners). Pricing is $49/mo per host, first month free.

## Cross-references

- Strategy: `/Users/gregoc/Documents/greg-vault/Strategic Priorities/CleanerPay.md`
- Canonical bonus rules: `/Users/gregoc/Documents/greg-vault/Sedona Retreats/Cleaner Bonus Agreement - 2026-Q2.md`
- Prior art (cleaning-score-tracker): `~/Desktop/.archive/cleaning-score-tracker/api/review-webhook.js`.
  Classifier, tier logic, and email generation were ported from here.
- Sister repo: `~/Desktop/guest-moment-platform` (cleaner-pay module + Mercury client
  origin). Long-term, cleaner-pay extraction collapses into this repo.

## Hard rules

- **No automatic ACH in v1.** Every `turnover_payments` and `expense_payments` row
  inserts with `status='pending'`. Mercury fires only after explicit, per-transaction
  human approval. Never wire an "auto-pay" path without Greg's say-so per change.
- **Never insert financial records without confirming Greg hasn't already paid via
  Mercury manually.** Cleaner pay sometimes gets handled in the Mercury UI before
  any automation fires. If a record could already exist, ask first.
- **Verify Mercury settlement independently of agent-reported success.** A 200 from
  the Mercury API is not a settled ACH. Real settlement comes from Mercury's own
  state, not from our log of having called them.
- **Dual-cleaner attribution: shared standing, no splitting.** When John and Tess
  both work a property, a single review affects BOTH cleaners' standing for that
  property. There is no per-cleaner attribution. Bonus rows still exist per
  (cleaner, property, period), but they're computed from the same shared property
  stats. See the canonical agreement doc.
- **Voice & copy: no em dashes, no SaaS buzzwords, no fake urgency.** Greg is a
  former brand planner. Specific and human beats clever and generic. This applies
  to all generated copy: marketing pages, emails, dashboards. Use periods, commas,
  semicolons, colons, or parentheses instead of em dashes.
- **Vercel production env vars: CLI only.** Never edit production env vars through
  the Vercel dashboard. The dashboard Edit panel blanks encrypted values on every
  click, and clicking Save without re-typing silently overwrites them with empty
  strings (regression on Greg's other product on 2026-05-13). Use:
  `vercel env rm <NAME> production --yes` then `vercel env add <NAME> production`,
  then `vercel --prod` to redeploy. Verify with `vercel env pull` (non-sensitive)
  or `vercel env run --environment=production -- printenv VAR`.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind.
- Supabase: project `cleanerpay-platform`, ref `pgnsxouftzedvnoonogl`,
  org `CleanerPay` (`dxxuszihmxfcauziovay`), region `us-east-1`, Pro plan.
- Resend (sender domain: `cleanerpay.ai`).
- Anthropic SDK: `claude-haiku-4-5-20251001` for classification,
  `claude-sonnet-4-6` for email generation.
- Vercel team: `greggetners-projects`.
- GitHub: `greggetner/cleanerpay-platform`.

## Layout

```
app/
  page.tsx                          marketing one-pager
  _components/SignupForm.tsx        client-side form
  api/
    signup/route.ts                 POST: signups + Resend notify
    hospitable-webhook/route.ts     POST: Hospitable review.created events
    cron/quarterly-close/route.ts   stub (Vercel cron, 0 9 1 */3 *)
    admin/backfill-reviews/route.ts POST, ADMIN_TOKEN bearer. Pulls historical reviews from Hospitable.
  p/[slug]/page.tsx                 cleaner-facing dashboard (placeholder)
  app/page.tsx                      host-facing dashboard (placeholder)
lib/
  cleaner-bonus/
    tiers.ts                        4-tier rubric (nailed/green/yellow/red, $333/$200/$83/$0)
    quarter.ts                      getCurrentQuarter / quarterForDate
    stats.ts                        calcPropertyStats over a quarter
    classifier.ts                   Anthropic Haiku. Public+private review to none/minor/major/flag.
    email-generator.ts              Anthropic Sonnet. Phone-friendly cleaner email.
  hospitable/
    client.ts                       fetch reviews + next reservation
    payload.ts                      extract property_id / review fields
  supabase/server.ts                service-role client (server-only)
supabase/
  migrations/0001_initial.sql       schema (RLS on, service-role-only)
  migrations/0002_seed_greg.sql     Greg's host + 3 props + 2 cleaners + Q2 2026 period
vercel.json                         cron config
```

## Environment

Required env vars (set in `.env.local` for dev, in Vercel for production):

- `SUPABASE_URL` (https://pgnsxouftzedvnoonogl.supabase.co)
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `HOSPITABLE_API_TOKEN`
- `RESEND_API_KEY`
- `ADMIN_TOKEN` (bearer for `/api/admin/*` endpoints)
- `CRON_SECRET` (optional; if set, the cron route requires `Authorization: Bearer <secret>`)

## How to add a migration

```bash
supabase migration new <name>
# edit supabase/migrations/<timestamp>_<name>.sql
SUPABASE_ACCESS_TOKEN=... supabase db push --password "<db_password>" --yes
```

Idempotency: prefer `insert ... where not exists` or `on conflict (col) do nothing`.
For partial unique indexes, include the predicate in the conflict clause:
`on conflict (col) where col is not null do nothing`.

## Bonus tier rubric (canonical)

| Tier      | Score             | Complaints   | Payout per property |
|-----------|-------------------|--------------|---------------------|
| Nailed it | 4.9+              | none         | $333                |
| Green     | 4.8 to 4.89       | max 1 minor  | $200                |
| Yellow    | 4.7 to 4.79       | max 2 minor  | $83                 |
| Red       | <4.7 or any major | n/a          | $0                  |

`MIN_REVIEWS_FOR_TIER=3`. Below 3 reviews in the quarter, default to "Nailed it"
tier (no penalty for thin data). Any single `major` complaint forces Red regardless
of avg.

## Hospitable webhook contract

`POST /api/hospitable-webhook` expects Hospitable's `review.created` payload.
Property is looked up via `properties.hospitable_property_id`. Unknown properties
return 200 with `{skipped: "unknown property"}` so Hospitable doesn't retry.

## What's NOT built yet

- Auth (Supabase magic-link). `/app` and `/p/[slug]` are placeholders.
- Mercury integration. No ACH fires.
- Multi-tenant signup flow (signups table captures leads only).
- Host-side admin UI for bonus approval.
- Quarterly-close finalization logic (stub returns 200 only).
- Sitter-pay flow.
- Expense submission UI.
