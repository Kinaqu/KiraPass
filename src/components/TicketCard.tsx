import { CheckCircle2 } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { ticketCatalog } from "@/lib/events";
import type { TicketType } from "@/types/domain";

export function TicketCard({ ticketType, featured = false }: { ticketType: TicketType; featured?: boolean }) {
  const ticket = ticketCatalog[ticketType];
  return (
    <article className="glass relative rounded-2xl p-2">
      {featured ? (
        <span className="absolute right-5 top-5 rounded-full border border-emerald-300/30 bg-emerald-300/12 px-3 py-1 text-xs font-bold text-emerald-100">
          Builder favorite
        </span>
      ) : null}
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6">
        <p className="text-sm font-bold text-white/62">{ticket.label}</p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-black tracking-tight">${ticket.amount}</span>
          <span className="pb-1 text-sm text-white/50">USD</span>
        </div>
        <ul className="mt-6 space-y-3">
          {ticket.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-white/74">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-200" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <CheckoutButton ticketType={ticketType} />
      </div>
    </article>
  );
}
