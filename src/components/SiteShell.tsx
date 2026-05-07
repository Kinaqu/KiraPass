import Link from "next/link";
import type { ReactNode } from "react";
import { TicketCheck } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="grid-glow pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
            <TicketCheck className="size-5" />
          </span>
          <span className="text-sm font-bold tracking-wide">KiraPass</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
          <Link href="/events/frontier-night" className="hover:text-white">
            Demo event
          </Link>
          <Link href="/my-tickets" className="hover:text-white">
            My tickets
          </Link>
          <Link href="/organizer" className="hover:text-white">
            Organizer
          </Link>
        </nav>
        <ButtonLink href="/events/frontier-night" className="hidden sm:inline-flex">
          View Demo Event
        </ButtonLink>
      </header>
      <div className="relative z-10">{children}</div>
    </main>
  );
}
