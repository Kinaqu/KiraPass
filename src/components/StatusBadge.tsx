import { cn } from "@/lib/utils/cn";

const styles: Record<string, string> = {
  pending: "border-yellow-300/25 bg-yellow-300/10 text-yellow-100",
  paid: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  active: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  used: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  failed: "border-red-300/25 bg-red-300/10 text-red-100",
  refunded: "border-orange-300/25 bg-orange-300/10 text-orange-100",
  cancelled: "border-red-300/25 bg-red-300/10 text-red-100"
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize", styles[value] ?? styles.pending)}>
      {value}
    </span>
  );
}
