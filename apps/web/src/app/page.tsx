import type { PaymentProvider } from '@baara/shared-types';

const DIGITAL_CATEGORIES = [
  'Software Developers',
  'AI Engineers',
  'UI/UX Designers',
  'Data Analysts',
  'Digital Marketers',
  'Legal Consultants',
];

const LOCAL_CATEGORIES = [
  'Solar Technicians',
  'Electricians',
  'Plumbers',
  'Car & Moto Mechanics',
  'Caterers & Events',
  'Motorcycle Couriers',
];

const PAYMENT_RAILS: PaymentProvider[] = [
  'ORANGE_MONEY',
  'WAVE',
  'MOOV_MONEY',
  'MTN_MOMO',
  'AIRTEL_MONEY',
  'SASPAY',
  'STRIPE',
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-zinc-800 pb-8">
        <span className="w-fit rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-orange-400">
          PAN-AFRICAN MARKETPLACE · DIGITAL + LOCAL
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AFRIWORK <span className="text-zinc-400 font-normal">(Project Baara)</span>
        </h1>
        <p className="max-w-2xl text-zinc-300">
          Hire verified digital freelancers and trusted local service providers across Africa,
          protected by automated double-entry escrow and native Mobile Money payouts.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">Digital Freelancers</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Remote talent for software, AI, design, marketing, finance, and legal.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {DIGITAL_CATEGORIES.map((cat) => (
              <li
                key={cat}
                className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">Local Service Providers</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Geo-located technicians, artisans, couriers, and on-site specialists.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {LOCAL_CATEGORIES.map((cat) => (
              <li
                key={cat}
                className="rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Native Payment & Escrow Rails
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {PAYMENT_RAILS.map((rail) => (
            <span
              key={rail}
              className="rounded-md bg-zinc-800 px-3 py-1 text-xs font-mono text-orange-300"
            >
              {rail}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
