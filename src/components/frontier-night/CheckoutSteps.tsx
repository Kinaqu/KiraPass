import { BadgeCheck, Clock3, QrCode, WalletCards } from "lucide-react";

const steps = [
  {
    icon: WalletCards,
    title: "Hosted KIRAPAY link",
    body: "The Worker creates a single-use checkout link with the server-validated order."
  },
  {
    icon: Clock3,
    title: "Pending until webhook",
    body: "KIRAPAY may redirect before Cloudflare receives the confirmation webhook."
  },
  {
    icon: QrCode,
    title: "Ticket after confirmation",
    body: "A QR pass is created only after transaction.succeeded is processed."
  },
  {
    icon: BadgeCheck,
    title: "One-use entry",
    body: "Organizer check-in changes the ticket from active to used."
  }
];

export function CheckoutSteps() {
  return (
    <section id="kirapay-flow" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">How KIRAPAY Checkout Works</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">No charge happens on this page.</h2>
        <p className="mt-4 text-base leading-7 text-white/62">
          KiraPass creates the order, KIRAPAY handles cross-chain payment from a supported chain or token, and the ticket appears after confirmed payment.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-[#14f195]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/34">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{step.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
