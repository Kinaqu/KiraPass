import { CalendarDays, MapPin, Sparkles, Users } from "lucide-react";
import { AnimatedVisual } from "@/components/AnimatedVisual";
import { FlowSteps } from "@/components/FlowSteps";
import { SiteShell } from "@/components/SiteShell";
import { TicketCard } from "@/components/TicketCard";

const highlights = [
  "Solana founder and builder mixer",
  "Hackathon team demos",
  "Cross-chain checkout at the door",
  "Partner networking lounge"
];

export default function FrontierNightPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="flex min-h-[520px] flex-col justify-center">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm font-semibold text-emerald-100">
              May 18, 2026
            </span>
            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-sm font-semibold text-white/76">
              Istanbul, Turkiye
            </span>
          </div>
          <h1 className="mt-6 text-6xl font-black leading-[0.93] tracking-tight sm:text-8xl">
            Frontier Night 2026
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            A Solana builder side event with cross-chain ticketing powered by KIRAPAY.
          </p>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <p className="glass rounded-xl p-4 text-sm text-white/72">
              <CalendarDays className="mb-3 size-5 text-emerald-200" />
              May 18, 2026
            </p>
            <p className="glass rounded-xl p-4 text-sm text-white/72">
              <MapPin className="mb-3 size-5 text-emerald-200" />
              Istanbul, Turkiye
            </p>
            <p className="glass rounded-xl p-4 text-sm text-white/72">
              <Users className="mb-3 size-5 text-emerald-200" />
              Builders, founders, hackers
            </p>
          </div>
          <a
            href="#tickets"
            className="mt-8 inline-flex w-fit items-center justify-center rounded-lg bg-emerald-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
          >
            Buy ticket
          </a>
        </div>
        <AnimatedVisual compact />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">About</p>
          <h2 className="mt-3 text-3xl font-black">A real event checkout, not a payment button demo</h2>
        </div>
        <p className="text-lg leading-8 text-white/70">
          An evening for Solana builders, hackathon teams, crypto founders, and ecosystem partners. Reserve
          your pass using any supported chain or token through KIRAPAY and receive a QR event pass after
          payment confirmation.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {highlights.map((highlight) => (
            <article key={highlight} className="glass rounded-xl p-5">
              <Sparkles className="mb-4 size-5 text-emerald-200" />
              <p className="font-semibold">{highlight}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tickets" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Tickets</p>
          <h2 className="mt-3 text-4xl font-black">Choose a pass</h2>
          <p className="mt-3 text-white/64">
            Prices are validated on the server. KIRAPAY creates a single-use checkout link for each order.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <TicketCard ticketType="general" />
          <TicketCard ticketType="vip" featured />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Checkout</p>
          <h2 className="mt-3 text-3xl font-black">How checkout works</h2>
        </div>
        <FlowSteps
          steps={[
            "Choose ticket",
            "Pay with KIRAPAY from any supported chain/token",
            "Receive QR pass after transaction confirmation",
            "Show QR at entrance"
          ]}
          className="md:grid-cols-4"
        />
        <p className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/8 p-4 text-sm font-semibold text-emerald-100">
          Tickets are issued only after KIRAPAY confirms the payment via webhook.
        </p>
      </section>
    </SiteShell>
  );
}
