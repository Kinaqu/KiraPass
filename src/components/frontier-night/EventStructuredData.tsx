import { frontierEvent, ticketCatalog } from "@/lib/events";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://kirapass.vercel.app").replace(/\/$/, "");
const eventUrl = `${siteUrl}/events/frontier-night`;

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: frontierEvent.title,
  description: frontierEvent.description,
  startDate: frontierEvent.date,
  endDate: "2026-05-18T23:00:00.000Z",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: eventUrl,
  location: {
    "@type": "Place",
    name: "Frontier Night venue",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR"
    }
  },
  organizer: {
    "@type": "Organization",
    name: "KiraPass / KIRAPAY demo"
  },
  offers: [
    {
      "@type": "Offer",
      name: ticketCatalog.general.label,
      price: ticketCatalog.general.amount,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-05-07T00:00:00.000Z",
      url: `${eventUrl}#tickets`
    },
    {
      "@type": "Offer",
      name: ticketCatalog.vip.label,
      price: ticketCatalog.vip.amount,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-05-07T00:00:00.000Z",
      url: `${eventUrl}#tickets`
    }
  ]
};

export function EventStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
    />
  );
}
