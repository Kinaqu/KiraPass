import { CheckCircle2, ScanLine, ShieldAlert, TicketCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const statuses = ["active", "used", "refunded", "cancelled"];

export function QRVerificationPreview() {
  const attendeeFlow = ["Pay online", "Get QR pass", "Show at door", "Organizer verifies"];

  return (
    <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-4 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">Organizer Verification</p>
        <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          The QR pass proves entry at the door.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/62">
          After webhook confirmation, your QR pass becomes available. Show it at the door for one-use verification.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {attendeeFlow.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3 text-sm font-black text-white/74">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#14f195]/12 text-xs text-[#d9fff0]">
                {index + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white p-4 text-slate-950">
          <div className="grid aspect-square grid-cols-6 gap-1 rounded-xl bg-white p-2">
            {Array.from({ length: 36 }).map((_, index) => (
              <span
                key={index}
                className={
                  index % 5 === 0 || index % 7 === 0 || [1, 6, 29, 34].includes(index)
                    ? "rounded-[3px] bg-slate-950"
                    : "rounded-[3px] bg-slate-200"
                }
              />
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            /verify/KP-DEMO26
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
          <div className="flex items-start gap-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
            <TicketCheck className="mt-0.5 size-5 shrink-0 text-[#14f195]" />
            <div>
              <h3 className="font-black text-emerald-50">Active pass</h3>
              <p className="mt-1 text-sm leading-6 text-emerald-50/68">Valid ticket. Staff can check in attendee.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <CheckCircle2 className="size-5 text-[#14f195]" />
              <p className="mt-4 text-sm font-bold text-white/76">Check-in writes `used` status.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <ShieldAlert className="size-5 text-red-200" />
              <p className="mt-4 text-sm font-bold text-white/76">Already-used tickets cannot enter again.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <StatusBadge key={status} value={status} />
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/54">
            <ScanLine className="size-4 text-[#14f195]" />
            Works from browser scan or organizer dashboard.
          </div>
        </div>
      </div>
    </section>
  );
}
