import { OrganizerDashboard } from "@/components/OrganizerDashboard";
import { SiteShell } from "@/components/SiteShell";

export default function OrganizerPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Organizer</p>
            <h1 className="mt-4 text-5xl font-black">Frontier Night dashboard</h1>
            <p className="mt-3 text-white/64">
              Paid attendees, payment state, ticket issuance, and QR check-in status.
            </p>
          </div>
        </div>
        <OrganizerDashboard />
      </section>
    </SiteShell>
  );
}
