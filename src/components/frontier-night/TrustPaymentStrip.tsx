import { CheckCircle2, QrCode, ShieldCheck, WalletCards } from "lucide-react";

const steps = [
  {
    icon: ShieldCheck,
    title: "Review first",
    body: "Choose a pass, confirm your email, and approve the next step."
  },
  {
    icon: WalletCards,
    title: "KIRAPAY checkout",
    body: "You leave only after clicking Continue to KIRAPAY."
  },
  {
    icon: CheckCircle2,
    title: "Webhook confirmed",
    body: "KiraPass waits for KIRAPAY confirmation before issuing access."
  },
  {
    icon: QrCode,
    title: "QR issued",
    body: "Your ticket points to a one-use verification screen."
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
