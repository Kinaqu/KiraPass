import { CheckCircle2, QrCode, ShieldCheck, WalletCards } from "lucide-react";

const steps = [
  {
    icon: ShieldCheck,
    title: "Review first",
    body: "Choose a pass, confirm your email, and approve the KIRAPAY redirect."
  },
  {
    icon: WalletCards,
    title: "KIRAPAY checkout",
    body: "Pay from a supported chain or token without a manual bridge step in KiraPass."
  },
  {
    icon: CheckCircle2,
    title: "Webhook confirmed",
    body: "The return page can show pending while KiraPass waits for confirmation."
  },
  {
    icon: QrCode,
    title: "QR issued",
    body: "After confirmed payment, your pass is ready for one-use door verification."
  }
];

export function TrustPaymentStrip() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8">
      <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl md:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <Icon className="size-5 text-[#14f195]" />
              <h2 className="mt-4 text-base font-black">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">{step.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
