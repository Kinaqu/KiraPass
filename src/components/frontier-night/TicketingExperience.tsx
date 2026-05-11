"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import type { TicketType } from "@/types/domain";
import { ticketCatalog } from "@/lib/events";
import { CheckoutReviewModal } from "@/components/frontier-night/CheckoutReviewModal";
import { TicketComparison } from "@/components/frontier-night/TicketComparison";
import { cn } from "@/lib/utils/cn";

const passCopy: Record<
  TicketType,
  {
    tag: string;
    reason: string;
    badge: string;
    featured?: boolean;
  }
> = {
  general: {
    tag: "Builder access",
    badge: "Best value",
    reason: "Best for builders who need event access, demos, and a QR pass without extras."
  },
  vip: {
    tag: "Priority access",
    badge: "Best for networking",
    reason: "Best for founders and partners who want priority entry and networking access.",
    featured: true
  }
};

export function TicketingExperience() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [selectionReason, setSelectionReason] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    function handleSelection(event: Event) {
      const detail = (event as CustomEvent<{ ticketType?: TicketType; reason?: string }>).detail;
      if (detail?.ticketType === "general" || detail?.ticketType === "vip") {
        setSelectedTicket(detail.ticketType);
        setSelectionReason(detail.reason ?? passCopy[detail.ticketType].reason);
        window.setTimeout(() => document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      }
    }

    window.addEventListener("kirapass:select-ticket", handleSelection);
    return () => window.removeEventListener("kirapass:select-ticket", handleSelection);
  }, []);

  function openReview(ticketType: TicketType) {
    setSelectedTicket(ticketType);
    setSelectionReason(passCopy[ticketType].reason);
    setReviewOpen(true);
  }

  return (
    <>
      <section id="tickets" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Tickets</p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Choose the right pass.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/66">
                Review your pass and public price first. Continue to KIRAPAY only when ready; QR tickets are issued after confirmed payment.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "No automatic charge on this page",
                "No hidden KiraPass checkout fees",
                "Server validates the order before redirect",
                "QR ticket appears after KIRAPAY confirms payment"
              ].map((note) => (
                <li key={note} className="flex items-center gap-3 text-sm font-bold text-white/64">
                  <CheckCircle2 className="size-4 text-[#14f195]" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(["general", "vip"] as TicketType[]).map((ticketType) => (
              <TicketPanel
                key={ticketType}
                ticketType={ticketType}
                selected={selectedTicket === ticketType}
                onChoose={() => openReview(ticketType)}
              />
            ))}
          </div>
          <div className="lg:col-span-2">
            <TicketComparison />
          </div>
        </div>
      </section>

      <CheckoutReviewModal
        open={reviewOpen}
        ticketType={selectedTicket}
        reason={selectionReason}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}

function TicketPanel({
  ticketType,
  selected,
  onChoose
}: {
  ticketType: TicketType;
  selected: boolean;
  onChoose: () => void;
}) {
  const ticket = ticketCatalog[ticketType];
  const copy = passCopy[ticketType];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] p-px transition duration-300",
        copy.featured || selected
          ? "bg-[linear-gradient(90deg,#14f195,#9945ff,#14f195)] bg-[length:200%_200%] [animation:frontier-border_6s_ease_infinite]"
          : "border border-white/10 bg-[#060711]"
      )}
    >
      <div className="h-full rounded-[calc(1.5rem-1px)] bg-[#060711] p-4">
        <div className="relative flex h-full flex-col rounded-[1.1rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white/52">{copy.tag}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">{ticket.label}</h3>
            </div>
            <span className={cn("rounded-full px-3 py-1 text-xs font-black", copy.featured ? "bg-[#14f195] text-[#04110b]" : "bg-white/8 text-white/64")}>
              {copy.badge}
            </span>
          </div>
          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight">${ticket.amount}</span>
            <span className="pb-1 text-sm font-bold text-white/42">USD</span>
          </div>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#14f195]">
            {ticketType === "general" ? "Fits under a $20 budget" : "Priority networking pick"}
          </p>
          <p className="mt-5 text-sm font-semibold leading-6 text-white/62">{copy.reason}</p>
          <div className="mt-6 space-y-2 text-sm font-bold text-white/62">
            {ticket.features.map((feature) => (
              <p key={feature} className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-[#14f195]" />
                {feature}
              </p>
            ))}
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 text-[#14f195]" />
              Ticket issued after webhook confirmation
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#14f195]" />
              Review before KIRAPAY redirect
            </p>
          </div>
          <button
            type="button"
            onClick={onChoose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#14f195] px-4 text-sm font-black text-[#04110b] transition hover:bg-[#7fffc8] focus:outline-none focus:ring-2 focus:ring-[#14f195]/70"
          >
            Review pass
          </button>
        </div>
      </div>
    </article>
  );
}
