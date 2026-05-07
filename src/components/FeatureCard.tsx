import type { LucideIcon } from "lucide-react";

export function FeatureCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <article className="glass rounded-xl p-5 transition hover:border-emerald-300/35 hover:bg-white/8">
      <Icon className="mb-4 size-6 text-emerald-200" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/68">{children}</p>
    </article>
  );
}
