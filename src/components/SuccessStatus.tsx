"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, TicketCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { apiUrl } from "@/lib/api";

type OrderPayload = {
  order: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    ticketType: string;
  };
  ticketId: string | null;
};

export function SuccessStatus({ orderId }: { orderId?: string }) {
  const [data, setData] = useState<OrderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    async function load() {
      try {
        const response = await fetch(apiUrl(`/api/orders/${orderId}`));
        const payload = (await response.json()) as OrderPayload | { message?: string };
        if (!response.ok || !("order" in payload)) {
          const message = "message" in payload ? payload.message : undefined;
          throw new Error(message ?? "Order not found");
        }
        if (active) setData(payload);
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Order not found");
      }
    }
    load();
    const interval = setInterval(load, 3500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (!orderId) {
    return <p className="glass rounded-2xl p-6 text-white/70">Missing order id.</p>;
  }

  if (error) {
    return <p className="glass rounded-2xl p-6 text-red-100">{error}</p>;
  }

  if (!data) {
    return (
      <div className="glass flex items-center gap-3 rounded-2xl p-6 text-white/70">
        <Loader2 className="size-5 animate-spin text-emerald-200" />
        Loading order status
      </div>
    );
  }

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-white/42">Order</p>
          <h1 className="mt-2 text-3xl font-black">{data.order.id}</h1>
        </div>
        <StatusBadge value={data.order.status} />
      </div>
      <p className="mt-6 text-white/68">
        KIRAPAY may have redirected you before the webhook reached KiraPass. This page only unlocks your
        pass after the server receives a confirmed payment event.
      </p>
      {data.ticketId ? (
        <Link
          href={`/ticket/${data.ticketId}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950"
        >
          <TicketCheck className="size-4" />
          View QR ticket
        </Link>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-yellow-300/20 bg-yellow-300/8 p-4 text-sm text-yellow-100">
          <Loader2 className="size-4 animate-spin" />
          Waiting for KIRAPAY webhook confirmation
        </div>
      )}
    </section>
  );
}
