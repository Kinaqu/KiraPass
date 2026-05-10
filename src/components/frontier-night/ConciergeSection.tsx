"use client";

import { useState } from "react";
import type { TicketType } from "@/types/domain";
import { ConciergeBar } from "@/components/frontier-night/ConciergeBar";

export function ConciergeSection() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  function selectTicket(ticketType: TicketType, reason: string) {
    setSelectedTicket(ticketType);
    window.dispatchEvent(
      new CustomEvent("kirapass:select-ticket", {
        detail: { ticketType, reason }
      })
    );
  }

  return <ConciergeBar selectedTicket={selectedTicket} onSelect={selectTicket} />;
}
