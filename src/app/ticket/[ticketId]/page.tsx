import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { TicketLoader } from "@/components/TicketLoader";

export default async function TicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  return (
    <SiteShell>
      <section className="px-5 py-12 sm:px-8">
        <TicketLoader ticketId={ticketId} />
        <div className="mx-auto mt-6 max-w-4xl text-sm text-white/58">
          <Link href="/events/frontier-night" className="font-semibold text-emerald-200">
            Back to event
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
