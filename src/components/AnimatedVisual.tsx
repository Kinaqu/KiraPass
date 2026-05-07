"use client";

import { motion } from "motion/react";
import { QrCode, Ticket, WalletCards, Webhook } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AnimatedVisual({ compact = false }: { compact?: boolean }) {
  const nodes = [
    { label: "Any chain", icon: WalletCards, className: "left-4 top-8" },
    { label: "KIRAPAY", icon: Webhook, className: "right-5 top-20" },
    { label: "QR pass", icon: QrCode, className: "bottom-8 left-12" },
    { label: "Entry", icon: Ticket, className: "bottom-16 right-12" }
  ];

  return (
    <div className={cn("glass beam relative min-h-[360px] overflow-hidden rounded-2xl p-6", compact && "min-h-[260px]")}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,241,149,0.20),transparent_16rem)]" />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/25"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/20"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      />
      <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/80 shadow-2xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">settles</p>
          <p className="mt-1 text-2xl font-black">SOL</p>
        </div>
      </div>
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.label}
            className={cn(
              "absolute flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm text-white shadow-xl backdrop-blur",
              node.className
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <Icon className="size-4 text-emerald-200" />
            {node.label}
          </motion.div>
        );
      })}
    </div>
  );
}
