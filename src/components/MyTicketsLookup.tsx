"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { apiUrl } from "@/lib/api";

type PublicTicket = {
  status: string;
  id: string;
  ticketCode: string;
};

type PublicOrderLookup = {
  order: {
    id: string;
    buyerEmail: string;
    ticketType: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
  };
  event: { title: string; date: string; location: string };
  ticket: PublicTicket | null;
};

export function MyTicketsLookup() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<PublicOrderLookup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl(`/api/orders?email=${encodeURIComponent(email)}`));
      const payload = (await response.json()) as { orders?: PublicOrderLookup[]; message?: string };
      if (!response.ok) throw new Error(payload.message ?? "Unable to find orders");
      setOrders(payload.orders ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to find orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
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
          Find order
        </button>
      </div>
      {error ? <p className="mt-4 rounded-xl border border-red-300/25 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}
      <div className="mt-6 space-y-3">
        {orders.map((entry) => {
          const status = entry.ticket?.status ?? entry.order.status;
          const body = (
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.06]">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold">{entry.event.title}</p>
                  <p className="mt-1 text-sm text-white/55">
                    {entry.order.ticketType} pass · ${entry.order.totalAmount} {entry.order.currency}
                  </p>
                  <p className="mt-2 text-sm text-white/50">{orderStatusCopy(entry)}</p>
                </div>
                <StatusBadge value={status} />
              </div>
            </div>
          );

          return entry.ticket ? (
            <Link key={entry.order.id} href={`/ticket/${entry.ticket.id}`} className="block">
              {body}
            </Link>
          ) : (
            <div key={entry.order.id}>{body}</div>
          );
        })}
        {!loading && orders.length === 0 ? <p className="text-sm text-white/45">No orders loaded for this email yet.</p> : null}
      </div>
    </section>
  );
}

function orderStatusCopy(entry: PublicOrderLookup) {
  if (entry.ticket) return `QR ticket ready: ${entry.ticket.ticketCode}`;
  if (entry.order.status === "paid") return "Payment confirmed. QR ticket is being issued.";
  if (entry.order.status === "pending") return "Order found. Waiting for KIRAPAY webhook confirmation.";
  if (entry.order.status === "failed") return "Checkout link creation failed. Try checkout again.";
  if (entry.order.status === "refunded") return "This order was refunded.";
  return "Order status is being updated.";
}
