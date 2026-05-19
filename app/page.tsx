import SignupForm from "./_components/SignupForm";
import StickyNav from "./_components/StickyNav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <StickyNav />
      <Hero />
      <Numbers />
      <Products />
      <MultiLLC />
      <HowItWorks />
      <Founder />
      <Pricing />
      <Signup />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="container-cp pt-14 pb-16 sm:pt-20 sm:pb-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            For short-term rental hosts with dedicated cleaning teams
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
            Pay your cleaners better.
          </h1>
          <p className="text-pretty mt-6 max-w-xl text-lg sm:text-xl text-stone-600 leading-relaxed">
            Turnover pay, expense reimbursement, performance bonuses. All in one
            place. Built by a STR host fed up with logging into bank websites.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#signup"
              className="inline-flex items-center rounded-md bg-teal px-5 py-3 text-base font-medium text-white hover:bg-teal-dark transition"
            >
              Get started
            </a>
            <a
              href="#how"
              className="inline-flex items-center rounded-md border border-stone-300 px-5 py-3 text-base font-medium text-stone-800 hover:bg-stone-50 transition"
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative w-[280px] sm:w-[320px] rounded-[2.25rem] bg-stone-900/95 p-2 shadow-card">
      <div className="rounded-[1.75rem] bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-2 text-[10px] uppercase tracking-widest text-stone-400">
          Inbox
        </div>
        <div className="px-5 pb-5">
          <div className="text-[11px] text-stone-500">
            From: CleanerPay
          </div>
          <div className="mt-1 font-display text-[15px] font-semibold leading-snug text-stone-900">
            New review. Nily Keramat at Haven, 5.0 cleanliness.
          </div>
          <div className="mt-3 rounded-lg bg-cream border border-stone-100 p-3">
            <div className="text-[11px] text-stone-500">Cleanliness score</div>
            <div className="mt-0.5 font-display text-2xl font-semibold text-stone-900">
              5.0
            </div>
            <div className="mt-2 text-[12px] text-stone-700 leading-snug">
              Haven cleanliness now <span className="font-semibold">4.88</span>{" "}
              across 7 reviews. Property tier holds at{" "}
              <span className="text-teal-700 font-semibold">Green ($200/cleaner)</span>.
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-widest text-stone-400">
              Q2 standings
            </div>
            <ul className="mt-2 space-y-1.5 text-[12px]">
              <li className="flex justify-between">
                <span className="text-stone-700">Haven</span>
                <span className="text-stone-900 font-medium">
                  <span className="mr-1">🟢</span>Green $200
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-700">Panoramic</span>
                <span className="text-stone-900 font-medium">
                  <span className="mr-1">🌟</span>Nailed it $333
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-700">Casita</span>
                <span className="text-stone-900 font-medium">
                  <span className="mr-1">🌟</span>Nailed it $333
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Numbers() {
  const stats = [
    { n: "3", c: "Properties" },
    { n: "13", c: "Reviews processed in Q2" },
    { n: "$1,732", c: "In cleaner bonuses calculated" },
    { n: "0", c: "Spreadsheets touched" },
  ];
  return (
    <section className="border-y border-stone-100 bg-white">
      <div className="container-cp grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 py-12 sm:py-16">
        {stats.map((s) => (
          <div key={s.c} className="text-center md:text-left">
            <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              {s.n}
            </div>
            <div className="mt-1.5 text-sm text-stone-500">{s.c}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="bg-cream border-y border-stone-100">
      <div className="container-cp py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Three things, one product.
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Stop spending hours each month logging into banks to pay your team. Three flows that handle the work for you: automatic payments, AI receipt capture, motivated cleaners.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card
            artifact={<TurnoverArtifact />}
            title="Turnover Pay"
            copy="Automatic ACH the moment a stay completes. No more logging in after every turnover."
            subcopy="Stop spending hours each month firing payments by hand."
          />
          <Card
            artifact={<ExpenseArtifact />}
            title="Expense Pay"
            copy="AI extracts the details. Approve from your phone in one click. Multi-LLC friendly."
            subcopy="Skip the company credit cards and Ramp accounts that creep up. Cleaners use their own cards and text in receipts."
          />
          <Card
            artifact={<IncentiveArtifact />}
            title="Incentive Pay"
            copy="Quarterly bonuses based on real review scores. Cleaners see exactly where they stand."
            subcopy="Motivated cleaners do better work. Better reviews mean more bookings. The bonus pays for itself."
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  artifact,
  title,
  copy,
  subcopy,
}: {
  artifact: React.ReactNode;
  title: string;
  copy: string;
  subcopy?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-stone-100 shadow-card p-6 flex flex-col">
      <div className="mb-5">{artifact}</div>
      <h3 className="font-display text-lg font-semibold text-stone-900">
        {title}
      </h3>
      <p className="mt-2 text-stone-700 leading-relaxed">{copy}</p>
      {subcopy ? (
        <p className="mt-3 text-[14px] text-stone-500 leading-relaxed">
          {subcopy}
        </p>
      ) : null}
    </div>
  );
}

function TurnoverArtifact() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          ACH transfer
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8l3.5 3.5L13 5" />
          </svg>
          Settled
        </span>
      </div>
      <div className="mt-2 font-mono text-base font-semibold text-stone-900">
        $80.00
      </div>
      <div className="mt-0.5 text-[12px] text-stone-600">
        to John Richichi
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
        <span>Stay: Haven, Apr 27</span>
        <span>Sent 12:04pm</span>
      </div>
    </div>
  );
}

function ExpenseArtifact() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3.5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-10 flex-none rounded-md bg-stone-100 border border-stone-200" />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider text-stone-500">
            Receipt scanned
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-stone-900">
            Home Depot
          </div>
          <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px]">
            <dt className="text-stone-500">Amount</dt>
            <dd className="text-stone-900 font-medium">$34.18</dd>
            <dt className="text-stone-500">Category</dt>
            <dd className="text-stone-900">Supplies</dd>
          </dl>
        </div>
      </div>
      <button
        type="button"
        className="mt-3 w-full inline-flex items-center justify-center rounded-md bg-teal/10 text-teal-700 px-2.5 py-1.5 text-[12px] font-medium"
      >
        Approve, Blue Door LLC
        <span className="ml-1.5">→</span>
      </button>
    </div>
  );
}

function IncentiveArtifact() {
  const rows = [
    { p: "Haven", tier: "Green", icon: "🟢", amt: "$200" },
    { p: "Panoramic", tier: "Nailed it", icon: "🌟", amt: "$333" },
    { p: "Casita", tier: "Nailed it", icon: "🌟", amt: "$333" },
  ];
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3.5">
      <div className="text-[11px] uppercase tracking-wider text-stone-500">
        Q2 tier standings
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.p}
            className="flex items-center justify-between text-[12px]"
          >
            <span className="text-stone-700">{r.p}</span>
            <span className="text-stone-900 font-medium">
              <span className="mr-1">{r.icon}</span>
              {r.tier} {r.amt}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-[12px]">
        <span className="text-stone-500">Projected Q2 payout</span>
        <span className="font-semibold text-stone-900">$866 / cleaner</span>
      </div>
    </div>
  );
}

function MultiLLC() {
  return (
    <section className="bg-cream">
      <div className="container-cp pb-16 sm:pb-20">
        <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 sm:px-6 sm:py-5 text-stone-700 leading-relaxed">
          <span className="font-semibold text-stone-900">
            Operate through multiple LLCs?
          </span>{" "}
          CleanerPay routes turnover payments and reimbursements to the right
          bank account per LLC, automatically.
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Connect Hospitable",
      copy: "We pull your properties, reservations, and reviews. Two clicks.",
    },
    {
      n: "2",
      title: "Connect Mercury",
      copy: "Add your business bank account and the cleaners you pay. Same account you use today.",
    },
    {
      n: "3",
      title: "Invite your cleaners",
      copy: "They get their own page to see scheduled pay, submit receipts, and track their bonus standing.",
    },
  ];
  return (
    <section id="how" className="container-cp py-16 sm:py-20">
      <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
        How it works.
      </h2>
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-sm font-semibold">
                {s.n}
              </span>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
            </div>
            <p className="mt-3 text-stone-600 leading-relaxed">{s.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Founder() {
  return (
    <section className="bg-cream border-y border-stone-100">
      <div className="container-cp py-16 sm:py-20">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_180px]">
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Why I built this.
            </h2>
            <div className="mt-6 space-y-5 text-stone-700 leading-relaxed text-[17px]">
              <p>
                Hi, I&apos;m Greg. I run three short-term rentals in Sedona,
                Arizona. I built CleanerPay because Tuesday afternoons logging
                into Mercury to pay my cleaners sucked, and because every
                quarterly bonus calculation I did by hand was one I&apos;d
                rather have automated. The cleaning team is the single biggest
                reason a stay goes well or doesn&apos;t, and yet the systems
                for paying them are stuck in the &quot;log in every week and
                click around&quot; era.
              </p>
              <p>
                This is the system I built for myself. It pays John and Tess
                automatically after every turnover. It reads their expense
                receipts with AI so I can approve from my phone in one click.
                It calculates their quarterly bonuses based on real Hospitable
                review scores, transparently, so they always know where they
                stand. I&apos;m sharing it because if you also run STRs with a
                dedicated team, you probably want the same thing.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="h-[120px] w-[120px] rounded-full bg-stone-100 ring-2 ring-teal/40 ring-offset-4 ring-offset-cream flex items-center justify-center text-stone-400 text-sm">
                Photo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const features = [
    "Automatic turnover payments via Mercury ACH",
    "AI-powered expense capture and one-click approval",
    "Quarterly performance bonuses with transparent tier tracking",
    "Unlimited cleaners, unlimited properties",
    "Multi-LLC support out of the box",
    "Email support, fast",
  ];
  return (
    <section id="pricing" className="bg-white">
      <div className="container-cp py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Pricing.
        </h2>
        <div className="mt-8 max-w-md rounded-xl bg-white border border-stone-200 shadow-card p-7">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-semibold tracking-tight">
              $49
            </span>
            <span className="text-stone-600">per month, per host</span>
          </div>
          <p className="mt-3 text-stone-700">First month free.</p>
          <ul className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[15px] text-stone-700">
                <svg
                  viewBox="0 0 20 20"
                  className="mt-1 h-3.5 w-3.5 flex-none text-teal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10l4 4 8-8" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-stone-500">
            Hosts with more than 3 properties, get in touch and we&apos;ll work
            something out.
          </p>
        </div>
      </div>
    </section>
  );
}

function Signup() {
  return (
    <section id="signup" className="bg-cream border-y border-stone-100">
      <div className="container-cp py-16 sm:py-20">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Get started.
          </h2>
          <p className="mt-3 text-stone-600">
            Tell us about your setup. We&apos;ll be in touch within a day.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-100">
      <div className="container-cp py-10 text-sm text-stone-500">
        <p>
          Built by an STR operator running three properties in Sedona, Arizona.
          Live in our own business since 2026.
        </p>
        <p className="mt-2">
          <a
            className="text-stone-700 hover:text-stone-900"
            href="mailto:greg@cleanerpay.ai"
          >
            greg@cleanerpay.ai
          </a>
        </p>
        <p className="mt-4 text-stone-400">
          Part of the{" "}
          <a
            href="https://getner.ai"
            className="text-teal-700 underline decoration-teal/40 underline-offset-2 hover:decoration-teal"
          >
            Conductor Method
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
