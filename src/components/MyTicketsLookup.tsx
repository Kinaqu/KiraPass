"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { apiUrl } from "@/lib/api";

type PublicTicket = {
  id: string;
  buyerEmail: string;
  ticketType: string;
  ticketCode: string;
  status: string;
  event: { title: string; date: string; location: string };
};

export function MyTicketsLookup() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<PublicTicket[]>([]);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setLoading(true);
    const response = await fetch(apiUrl(`/api/tickets?email=${encodeURIComponent(email)}`));
    const payload = (await response.json()) as { tickets: PublicTicket[] };
    setTickets(payload.tickets ?? []);
    setLoading(false);
  }

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="builder@example.com"
          className="h-12 flex-1 rounded-lg border border-white/12 bg-slate-950/60 px-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-300/60"
        />
        <button
          type="button"
          disabled={!email || loading}
          onClick={lookup}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-black text-slate-950 disabled:opacity-50"
        >
          <Search className="size-4" />
          Find tickets
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/ticket/${ticket.id}`} className="block rounded-xl border border-white/10 bg-white/[0.035] p-4 hover:bg-white/[0.06]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{ticket.event.title}</p>
                <p className="mt-1 text-sm text-white/55">{ticket.ticketCode}</p>
              </div>
              <StatusBadge value={ticket.status} />
            </div>
          </Link>
        ))}
        {!loading && tickets.length === 0 ? <p className="text-sm text-white/45">No tickets loaded.</p> : null}
      </div>
    </section>
  );
}
