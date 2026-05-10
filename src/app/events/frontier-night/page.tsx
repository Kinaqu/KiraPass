import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Compass,
  Gem,
  MapPin,
  Network,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  WalletCards,
  Waypoints,
  Zap
} from "lucide-react";
import { CheckoutSteps } from "@/components/frontier-night/CheckoutSteps";
import { ConciergeSection } from "@/components/frontier-night/ConciergeSection";
import { EventStructuredData } from "@/components/frontier-night/EventStructuredData";
import { FAQSection } from "@/components/frontier-night/FAQSection";
import { QRVerificationPreview } from "@/components/frontier-night/QRVerificationPreview";
import { SpotlightCard } from "@/components/frontier-night/SpotlightCard";
import { TicketingExperience } from "@/components/frontier-night/TicketingExperience";
import { TrustPaymentStrip } from "@/components/frontier-night/TrustPaymentStrip";

export const metadata: Metadata = {
  title: "Frontier Night 2026 | KIRAPAY",
  description: "A Solana builder side event with cross-chain ticketing powered by KIRAPAY."
};

const audience = [
  "Solana builders",
  "Protocol teams",
  "Founders",
  "Crypto creators",
  "Ecosystem guests",
  "Cross-chain builders"
];

const whyAttend = [
  {
    icon: Users,
    title: "Meet Solana builders",
    body: "Talk with teams shipping products, protocols, tooling, and consumer crypto."
  },
  {
    icon: Compass,
    title: "Find signal fast",
    body: "A focused room for founders, creators, and ecosystem voices."
  },
  {
    icon: Waypoints,
    title: "See access rails live",
    body: "Experience cross-chain ticketing as part of the event flow."
  },
  {
    icon: Gem,
    title: "Enter a curated night",
    body: "Invite-friendly access for serious builders and product people."
  }
];

const accessLayer = [
  "Cross-chain ticket purchase or claim",
  "Wallet-based access checks",
  "QR ticket and simple verification",
  "Event-ready access infrastructure"
];

const details = [
  { icon: CalendarDays, label: "Date", value: "May 18, 2026" },
  { icon: MapPin, label: "Location", value: "Istanbul, Turkiye" },
  { icon: Sparkles, label: "Format", value: "Builder side event" },
  { icon: Users, label: "Audience", value: "Solana developers, founders, creators, ecosystem guests" },
  { icon: ShieldCheck, label: "Access", value: "Ticketed / invite-friendly" }
];

const agenda = [
  "Doors open",
  "Builder networking",
  "Lightning conversations",
  "Product demos and ecosystem talks",
  "After-hours connections"
];

export default function FrontierNightPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#03040a] text-white">
      <EventStructuredData />
      <style>{`
        @keyframes frontier-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes frontier-pulse {
          0%, 100% { opacity: .48; transform: scale(1); }
          50% { opacity: .92; transform: scale(1.04); }
        }

        @keyframes frontier-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes frontier-scan {
          0%, 38% { transform: translateY(-110%); opacity: 0; }
          48%, 70% { opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }

        @keyframes frontier-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(20,241,149,0.18),transparent_28rem),radial-gradient(circle_at_82%_4%,rgba(153,69,255,0.18),transparent_30rem),linear-gradient(180deg,#03040a_0%,#070712_48%,#04050a_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute inset-x-[-12%] top-[430px] h-72 rotate-[-4deg] bg-[linear-gradient(90deg,transparent,rgba(20,241,149,0.12),rgba(153,69,255,0.16),transparent)] blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/events/frontier-night" className="flex items-center gap-3" aria-label="Frontier Night 2026">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/8 shadow-[0_0_32px_rgba(20,241,149,0.16)]">
            <Compass className="size-5 text-[#14f195]" />
          </span>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-white/88">Frontier Night</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/58 md:flex">
          <a href="#concept" className="transition hover:text-white">
            Concept
          </a>
          <a href="#access" className="transition hover:text-white">
            Access
          </a>
          <a href="#details" className="transition hover:text-white">
            Details
          </a>
        </nav>
        <a
          href="#tickets"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#14f195]/35 bg-[#14f195]/12 px-5 text-sm font-black text-[#d9fff0] shadow-[0_0_34px_rgba(20,241,149,0.14)] transition hover:bg-[#14f195]/18 focus:outline-none focus:ring-2 focus:ring-[#14f195]/70"
        >
          Choose Pass
        </a>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-12 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-[#14f195] shadow-[0_0_14px_#14f195]" />
            Solana Builder Side Event
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Frontier Night 2026
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
            A Solana builder side event with cross-chain ticketing powered by KIRAPAY.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#tickets"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#14f195] px-7 text-sm font-black text-[#04110b] shadow-[0_0_42px_rgba(20,241,149,0.28)] transition hover:bg-[#7fffc8] focus:outline-none focus:ring-2 focus:ring-[#14f195]/70"
            >
              Choose Pass <ArrowRight className="size-4" />
            </a>
            <a
              href="#concept"
              className="inline-flex h-13 items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 text-sm font-black text-white/86 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/35"
            >
              Explore Event
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["When", "May 18"],
              ["Where", "Istanbul"],
              ["Access", "Ticketed"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/42">{label}</p>
                <p className="mt-2 text-sm font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroPass />
      </section>

      <ConciergeSection />

      <TrustPaymentStrip />

      <section className="relative z-10 border-y border-white/10 bg-white/[0.035] py-4 backdrop-blur">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-5 sm:px-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#05060c] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#05060c] to-transparent" />
          <div className="flex w-max gap-3 [animation:frontier-marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
            {[...audience, ...audience, ...audience].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#090a13] px-4 py-2 text-sm font-bold text-white/72"
              >
                <CircleDot className="size-3 text-[#14f195]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="concept" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Event Concept</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Where Solana builders meet the next frontier of access.
          </h2>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xl font-semibold leading-9 text-white/82">
            Frontier Night brings builders, founders, and ecosystem voices together for one focused night of
            Solana-native networking, product conversations, and cross-chain access.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {["Private side event", "Proof-of-access", "Builder-first room"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/24 p-4 text-sm font-black text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Why Attend</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">One night. High-signal people.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {whyAttend.map((item, index) => {
            const Icon = item.icon;
            return (
              <SpotlightCard
                key={item.title}
                spotlightColor={index % 2 === 0 ? "rgba(20, 241, 149, 0.2)" : "rgba(153, 69, 255, 0.2)"}
              >
                <Icon className="size-6 text-[#14f195]" />
                <h3 className="mt-8 text-xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{item.body}</p>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      <section id="access" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070812] p-6 shadow-[0_40px_130px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,241,149,0.15),transparent_20rem),radial-gradient(circle_at_80%_15%,rgba(153,69,255,0.16),transparent_22rem)]" />
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Powered by KIRAPAY</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              The access layer stays invisible until it matters.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
              KIRAPAY handles cross-chain ticketing, wallet-based verification, and crypto-native event entry.
            </p>
          </div>
          <div className="relative z-10 mt-9 grid gap-3 sm:grid-cols-2">
            {accessLayer.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#14f195]" />
                <p className="text-sm font-bold leading-6 text-white/74">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <AccessRail />
      </section>

      <section id="details" className="relative z-10 mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Event Details</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Built for the side-event circuit.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/55">
            A fictional but realistic Solana builder night for the KiraPass hackathon demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
                <Icon className="size-5 text-[#14f195]" />
                <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                <p className="mt-2 text-sm font-black leading-6 text-white/86">{item.value}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Evening Flow</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Simple by design.</h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-white/62">
            Enough structure to create momentum. Enough room for the conversations that matter.
          </p>
        </div>
        <ol className="relative grid gap-4">
          {agenda.map((item, index) => (
            <li key={item} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
              <div className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#14f195]/30 bg-[#14f195]/10 text-sm font-black text-[#d9fff0]">
                  0{index + 1}
                </span>
                <p className="text-lg font-black text-white/88">{item}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <TicketingExperience />

      <CheckoutSteps />

      <QRVerificationPreview />

      <FAQSection />

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090a13] p-8 text-center shadow-[0_36px_120px_rgba(20,241,149,0.12)] sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,241,149,0.2),transparent_26rem),radial-gradient(circle_at_50%_100%,rgba(153,69,255,0.16),transparent_26rem)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Get access to Frontier Night 2026
            </h2>
            <p className="mt-5 text-lg text-white/64">
              Review your pass, continue to KIRAPAY, and get a QR ticket after confirmation.
            </p>
            <a
              href="#tickets"
              className="mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#14f195] px-7 text-sm font-black text-[#04110b] shadow-[0_0_42px_rgba(20,241,149,0.28)] transition hover:bg-[#7fffc8] focus:outline-none focus:ring-2 focus:ring-[#14f195]/70"
            >
              Claim Ticket <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/50 sm:flex-row sm:items-center">
          <p className="font-black uppercase tracking-[0.18em] text-white/72">Frontier Night 2026</p>
          <p>Powered by KIRAPAY</p>
        </div>
      </footer>
    </main>
  );
}

function HeroPass() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -inset-8 rounded-full bg-[#14f195]/12 blur-3xl [animation:frontier-pulse_5s_ease-in-out_infinite]" />
      <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#14f195]/18 [animation:frontier-orbit_26s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9945ff]/18 [animation:frontier-orbit_18s_linear_infinite_reverse]" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#080914]/86 p-4 shadow-[0_44px_160px_rgba(0,0,0,0.44)] backdrop-blur-2xl">
        <div className="absolute inset-px rounded-[calc(2rem-1px)] bg-[linear-gradient(120deg,rgba(20,241,149,0.2),transparent_30%,rgba(153,69,255,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_44%,transparent_56%)] [animation:frontier-scan_6s_ease-in-out_infinite]" />
        <div className="relative rounded-[1.5rem] border border-white/10 bg-black/28 p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#14f195]">Proof of Access</p>
              <h2 className="mt-4 text-4xl font-black leading-none tracking-tight">Frontier Pass</h2>
            </div>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-black text-white/70">
              2026
            </span>
          </div>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

          <div className="grid gap-3">
            {[
              [WalletCards, "Any supported chain"],
              [Network, "KIRAPAY access rail"],
              [QrCode, "QR ticket issued"],
              [ScanLine, "Wallet verification"]
            ].map(([Icon, label]) => {
              const PassIcon = Icon as typeof WalletCards;
              return (
                <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#14f195]/12">
                    <PassIcon className="size-4 text-[#14f195]" />
                  </span>
                  <span className="text-sm font-bold text-white/72">{label as string}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">Powered by</p>
              <p className="mt-1 text-2xl font-black">KIRAPAY</p>
            </div>
            <div className="grid size-20 grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-white/7 p-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className={index % 3 === 0 || index === 14 ? "rounded-[3px] bg-[#14f195]" : "rounded-[3px] bg-white/20"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessRail() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />
      <div className="absolute left-1/2 top-1/2 h-1 w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#14f195]/20 via-[#14f195] to-[#9945ff]/70 shadow-[0_0_36px_rgba(20,241,149,0.28)]" />
      <div className="absolute left-[18%] top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#14f195] shadow-[0_0_22px_#14f195]" />
      <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#14f195]/40 bg-[#06140f] shadow-[0_0_30px_rgba(20,241,149,0.32)]" />
      <div className="absolute right-[18%] top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#9945ff] shadow-[0_0_22px_#9945ff]" />

      <div className="relative z-10 grid h-full min-h-[360px] content-between">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/12 bg-black/28 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/54">
            Cross-chain rails
          </span>
          <Zap className="size-5 text-[#14f195]" />
        </div>
        <div className="mx-auto max-w-sm rounded-3xl border border-white/12 bg-[#05060c]/88 p-5 text-center shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <Ticket className="mx-auto size-8 text-[#14f195]" />
          <p className="mt-4 text-2xl font-black">Wallet in. Ticket out.</p>
          <p className="mt-3 text-sm leading-6 text-white/58">
            The event brand stays front and center. KIRAPAY runs the access rail underneath.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-black uppercase tracking-[0.15em] text-white/48">
          <span>Claim</span>
          <span>Verify</span>
          <span>Enter</span>
        </div>
      </div>
    </div>
  );
}
