import { SiteShell } from "@/components/SiteShell";
import { VerifyPanel } from "@/components/VerifyPanel";

export default async function VerifyPage({ params }: { params: Promise<{ ticketCode: string }> }) {
  const { ticketCode } = await params;
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Organizer verification</p>
        <h1 className="mt-4 text-5xl font-black">Verify entry</h1>
        <p className="mt-4 text-white/66">
          Staff can validate the QR pass and check in an attendee from this screen.
        </p>
        <div className="mt-8">
          <VerifyPanel ticketCode={decodeURIComponent(ticketCode)} />
        </div>
      </section>
    </SiteShell>
  );
}
