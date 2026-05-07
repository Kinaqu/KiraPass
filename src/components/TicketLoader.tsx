"use client";

import { useEffect, useState } from "react";
import { QrTicketCard } from "@/components/QrTicketCard";
import { apiUrl } from "@/lib/api";

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
  order: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
};

export function TicketLoader({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<TicketPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const response = await fetch(apiUrl(`/api/tickets/${ticketId}`));
      const payload = (await response.json()) as { ticket?: TicketPayload; message?: string };
      if (!active) return;
      if (!response.ok || !payload.ticket) {
        setError(payload.message ?? "Ticket not found");
        return;
      }
      setTicket(payload.ticket);
    }
    load().catch((caught) => {
      if (active) setError(caught instanceof Error ? caught.message : "Ticket not found");
    });
    return () => {
      active = false;
    };
  }, [ticketId]);

  if (error) {
    return <section className="glass mx-auto max-w-4xl rounded-2xl p-6 text-red-100">{error}</section>;
  }

  if (!ticket) {
    return <section className="glass mx-auto max-w-4xl rounded-2xl p-6 text-white/65">Loading ticket from Cloudflare...</section>;
  }

  return <QrTicketCard ticket={ticket} />;
}
