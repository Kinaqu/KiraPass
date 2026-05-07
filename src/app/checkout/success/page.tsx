import { Suspense } from "react";
import { SiteShell } from "@/components/SiteShell";
import { SuccessStatus } from "@/components/SuccessStatus";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-200">Checkout return</p>
        <h1 className="mt-4 text-5xl font-black">Payment status</h1>
        <div className="mt-8">
          <Suspense fallback={null}>
            <SuccessStatus orderId={params.orderId} />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
