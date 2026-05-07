"use client";

import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, MapPin, TicketCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

type TicketPayload = {
  id: string;
  buyerEmail: string;
  ticketType: string;
  ticketCode: string;
  qrUrl: string;
  status: string;
  checkedIn: boolean;
  event: {
    title: string;
    date: string;
    location: string;
  };
};

export function QrTicketCard({ ticket }: { ticket: TicketPayload }) {
  return (
    <section className="glass mx-auto grid max-w-4xl gap-6 rounded-2xl p-6 md:grid-cols-[1fr_280px]">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-emerald-300 text-slate-950">
            <TicketCheck className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-black">{ticket.event.title}</h1>
            <p className="text-sm text-white/58">{ticket.ticketCode}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-white/72 sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 text-emerald-200" />
            {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ticket.event.date))}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-emerald-200" />
            {ticket.event.location}
          </p>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-white/42">Attendee</dt>
            <dd className="mt-1 text-sm font-semibold">{ticket.buyerEmail}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-white/42">Pass</dt>
            <dd className="mt-1 text-sm font-semibold capitalize">{ticket.ticketType}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-white/42">Status</dt>
            <dd className="mt-1">
              <StatusBadge value={ticket.status} />
            </dd>
          </div>
        </dl>
      </div>
      <div className="rounded-xl border border-white/10 bg-white p-4 text-slate-950">
        <QRCodeSVG value={ticket.qrUrl} size={240} level="H" />
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Scan to verify
        </p>
      </div>
    </section>
  );
}
