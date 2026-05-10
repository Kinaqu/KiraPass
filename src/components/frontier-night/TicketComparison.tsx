import { BadgeCheck, CheckCircle2, Network, Users } from "lucide-react";

const rows = [
  ["Event access", true, true],
  ["QR ticket after KIRAPAY confirmation", true, true],
  ["Builder networking room", false, true],
  ["Priority check-in", false, true],
  ["Best for demo teams", true, false],
  ["Best for networking", false, true]
] as const;

export function TicketComparison() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Compare Passes</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight">General vs VIP</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-white/66">
            <Users className="size-3.5 text-[#14f195]" />
            Best value
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#14f195]/25 bg-[#14f195]/10 px-3 py-1.5 text-emerald-50">
            <Network className="size-3.5 text-[#14f195]" />
            Best networking
          </span>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr] bg-black/24 text-xs font-black uppercase tracking-[0.18em] text-white/42">
          <div className="p-3">Included</div>
          <div className="p-3">General</div>
          <div className="p-3">VIP</div>
        </div>
        {rows.map(([label, general, vip]) => (
          <div key={label} className="grid grid-cols-[1.3fr_0.85fr_0.85fr] border-t border-white/8 text-sm font-semibold text-white/70">
            <div className="p-3">{label}</div>
            <div className="p-3">
              {general ? <CheckCircle2 className="size-4 text-[#14f195]" /> : <span className="text-white/28">-</span>}
            </div>
            <div className="p-3">
              {vip ? <BadgeCheck className="size-4 text-[#14f195]" /> : <span className="text-white/28">-</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
