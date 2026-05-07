import type { EventRecord, TicketType } from "@/types/domain";

export const FRONTIER_EVENT_ID = "event_frontier_night_2026";
export const FRONTIER_EVENT_SLUG = "frontier-night";

export const frontierEvent: EventRecord = {
  id: FRONTIER_EVENT_ID,
  title: "Frontier Night 2026",
  slug: FRONTIER_EVENT_SLUG,
  description:
    "An evening for Solana builders, hackathon teams, crypto founders, and ecosystem partners. Reserve your pass using any supported chain or token through KIRAPAY and receive a QR event pass after payment confirmation.",
  date: "2026-05-18T19:00:00.000Z",
  location: "Istanbul, Turkiye",
  imageUrl: null,
  generalPrice: 15,
  vipPrice: 35,
  createdAt: "2026-05-07T00:00:00.000Z",
  updatedAt: "2026-05-07T00:00:00.000Z"
};

export const ticketCatalog: Record<
  TicketType,
  {
    label: string;
    amount: number;
    features: string[];
  }
> = {
  general: {
    label: "General Pass",
    amount: frontierEvent.generalPrice,
    features: ["Event access", "QR ticket", "KIRAPAY cross-chain checkout"]
  },
  vip: {
    label: "VIP Builder Pass",
    amount: frontierEvent.vipPrice,
    features: ["Event access", "Priority entry", "Networking area", "QR ticket"]
  }
};

export function getTicketPrice(ticketType: TicketType) {
  return ticketCatalog[ticketType].amount;
}

export function getTicketLabel(ticketType: TicketType) {
  return ticketCatalog[ticketType].label;
}
