import SignupForm from "./_components/SignupForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <Nav />
      <Hero />
      <Products />
      <HowItWorks />
      <Pricing />
      <Signup />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="border-b border-stone-100">
      <div className="container-cp flex items-center justify-between py-5">
        <a href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          CleanerPay
        </a>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#products" className="hidden sm:inline text-stone-600 hover:text-stone-900">
            Products
          </a>
          <a href="#how" className="hidden sm:inline text-stone-600 hover:text-stone-900">
            How it works
          </a>
          <a
            href="#signup"
            className="inline-flex items-center rounded-md bg-teal px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-dark transition"
          >
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="container-cp pt-16 pb-16 sm:pt-24 sm:pb-20">
      <h1 className="text-balance text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
        Pay your short-term rental cleaners better.
      </h1>
      <p className="text-pretty mt-6 max-w-2xl text-lg sm:text-xl text-stone-600 leading-relaxed">
        Turnover pay, expense reimbursement, performance bonuses. All in one place.
        Built by an STR host running three properties.
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
    </section>
  );
}

function Products() {
  const items = [
    {
      title: "Turnover Pay",
      copy: "Automatic ACH the moment a stay completes. No more logging into your bank every Tuesday.",
    },
    {
      title: "Expense Pay",
      copy: "Cleaners submit receipts, you approve from your phone, money moves the same day.",
    },
    {
      title: "Incentive Pay",
      copy: "Quarterly bonuses based on real review scores. Cleaners see exactly where they stand.",
    },
  ];
  return (
    <section id="products" className="bg-cream border-y border-stone-100">
      <div className="container-cp py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Three things, one product.</h2>
        <p className="mt-3 max-w-xl text-stone-600">
          Everything that touches paying the people who clean your properties.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-xl bg-white border border-stone-100 shadow-card p-6"
            >
              <h3 className="text-lg font-semibold text-stone-900">{it.title}</h3>
              <p className="mt-2 text-stone-600 leading-relaxed">{it.copy}</p>
            </div>
          ))}
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
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">How it works.</h2>
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-sm font-semibold">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
            </div>
            <p className="mt-3 text-stone-600 leading-relaxed">{s.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-cream border-y border-stone-100">
      <div className="container-cp py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Pricing.</h2>
        <div className="mt-8 max-w-md rounded-xl bg-white border border-stone-100 shadow-card p-7">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">$49</span>
            <span className="text-stone-600">per month, per host</span>
          </div>
          <p className="mt-3 text-stone-700">First month free.</p>
          <p className="mt-4 text-sm text-stone-500">
            More than 3 properties? Get in touch and we&apos;ll work something out.
          </p>
        </div>
      </div>
    </section>
  );
}

function Signup() {
  return (
    <section id="signup" className="container-cp py-16 sm:py-20">
      <div className="max-w-xl">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Get started.</h2>
        <p className="mt-3 text-stone-600">
          Tell us about your setup. We&apos;ll be in touch within a day.
        </p>
        <div className="mt-8">
          <SignupForm />
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
          <a className="text-stone-700 hover:text-stone-900" href="mailto:greg@cleanerpay.ai">
            greg@cleanerpay.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
