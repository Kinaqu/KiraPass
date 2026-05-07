import { ArrowRight, BadgeCheck, QrCode, ScanLine, WalletCards } from "lucide-react";
import { AnimatedVisual } from "@/components/AnimatedVisual";
import { ButtonLink } from "@/components/ButtonLink";
import { FeatureCard } from "@/components/FeatureCard";
import { FlowSteps } from "@/components/FlowSteps";
import { SiteShell } from "@/components/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-200">KiraPass</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
            Cross-chain event ticketing powered by KIRAPAY
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Sell event tickets globally. Let attendees pay from any supported chain or token, settle through
            KIRAPAY, and receive QR-based event passes after payment confirmation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/events/frontier-night">
              View Demo Event <ArrowRight className="ml-2 size-4" />
            </ButtonLink>
            <ButtonLink href="/organizer" variant="secondary">
              Organizer Dashboard
            </ButtonLink>
          </div>
        </div>
        <AnimatedVisual />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <FeatureCard icon={WalletCards} title="Cross-chain checkout">
            Attendees pay from their preferred chain/token through KIRAPAY.
          </FeatureCard>
          <FeatureCard icon={BadgeCheck} title="Solana-oriented settlement">
            Organizers settle through the configured KIRAPAY payout setup.
          </FeatureCard>
          <FeatureCard icon={QrCode} title="QR event passes">
            Tickets are issued only after KIRAPAY transaction confirmation.
          </FeatureCard>
          <FeatureCard icon={ScanLine} title="Organizer verification">
            Staff verify and check in attendees from a simple dashboard.
          </FeatureCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Flow</p>
            <h2 className="mt-3 text-3xl font-black">From landing page to verified entry</h2>
          </div>
          <ButtonLink href="/events/frontier-night" variant="secondary" className="hidden sm:inline-flex">
            Try event flow
          </ButtonLink>
        </div>
        <FlowSteps
          steps={[
            "Select ticket",
            "Pay with KIRAPAY",
            "Webhook confirms",
            "QR ticket issued",
            "Organizer verifies entry"
          ]}
        />
      </section>
    </SiteShell>
  );
}
