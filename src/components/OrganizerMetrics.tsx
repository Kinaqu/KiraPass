import { BadgeDollarSign, CheckCheck, Ticket, Users } from "lucide-react";

export function OrganizerMetrics({ metrics }: { metrics: { orders: number; paid: number; checkedIn: number; revenue: number } }) {
  const cards = [
    { label: "Orders", value: metrics.orders, icon: Ticket },
    { label: "Paid", value: metrics.paid, icon: Users },
    { label: "Checked in", value: metrics.checkedIn, icon: CheckCheck },
    { label: "Revenue", value: `$${metrics.revenue}`, icon: BadgeDollarSign }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.label} className="glass rounded-xl p-5">
            <Icon className="size-5 text-emerald-200" />
            <p className="mt-5 text-3xl font-black">{card.value}</p>
            <p className="mt-1 text-sm text-white/52">{card.label}</p>
          </article>
        );
      })}
    </section>
  );
}
