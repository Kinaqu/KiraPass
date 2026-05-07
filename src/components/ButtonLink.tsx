import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300",
        variant === "primary"
          ? "bg-emerald-300 text-slate-950 hover:bg-emerald-200"
          : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
        className
      )}
    >
      {children}
    </Link>
  );
}
