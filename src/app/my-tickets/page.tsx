import { MyTicketsLookup } from "@/components/MyTicketsLookup";
import { SiteShell } from "@/components/SiteShell";

export default function MyTicketsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">My tickets</p>
        <h1 className="mt-4 text-5xl font-black">Find your order or QR pass</h1>
        <p className="mt-4 text-white/66">
          Use the checkout email to see pending payment status, webhook confirmation, or the issued QR pass.
        </p>
        <div className="mt-8">
          <MyTicketsLookup />
        </div>
      </section>
    </SiteShell>
  );
}
