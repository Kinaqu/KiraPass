import { cn } from "@/lib/utils/cn";

export function FlowSteps({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn("grid gap-3 md:grid-cols-5", className)}>
      {steps.map((step, index) => (
        <li key={step} className="glass rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">0{index + 1}</span>
          <p className="mt-3 text-sm font-semibold leading-5">{step}</p>
        </li>
      ))}
    </ol>
  );
}
