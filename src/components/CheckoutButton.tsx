"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { TicketType } from "@/types/domain";
import { apiUrl } from "@/lib/api";
import { FRONTIER_EVENT_ID } from "@/lib/events";

export function CheckoutButton({ ticketType }: { ticketType: TicketType }) {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/checkout/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: FRONTIER_EVENT_ID, buyerEmail: email, buyerWallet: wallet || undefined, ticketType })
      });
      const payload = (await response.json()) as { checkoutUrl?: string; message?: string };
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.message ?? "Checkout failed");
      window.location.assign(payload.checkoutUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        Email for pass
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="builder@example.com"
          className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/60"
        />
      </label>
      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        Wallet optional
        <input
          value={wallet}
          onChange={(event) => setWallet(event.target.value)}
          placeholder="0x... or Solana wallet"
          className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/60"
        />
      </label>
      <button
        type="button"
        onClick={submit}
        disabled={loading || !email}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
        Buy with KIRAPAY
      </button>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
    </div>
  );
}
