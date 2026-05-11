"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import type { TicketType } from "@/types/domain";
import { apiUrl } from "@/lib/api";
import { FRONTIER_EVENT_ID, ticketCatalog } from "@/lib/events";

export const addOnCatalog = [
  { id: "livestream_replay", label: "Livestream replay access", amount: 5 },
  { id: "priority_checkin", label: "Priority check-in", amount: 8 },
  { id: "sponsor_networking", label: "Sponsor networking list", amount: 10 }
] as const;

export type AddOnId = (typeof addOnCatalog)[number]["id"];

export function CheckoutReviewModal({
  open,
  ticketType,
  reason,
  onClose
}: {
  open: boolean;
  ticketType: TicketType | null;
  reason: string | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticket = ticketType ? ticketCatalog[ticketType] : null;
  const addOnTotal = useMemo(
    () => addOnCatalog.filter((addOn) => selectedAddOns.includes(addOn.id)).reduce((sum, addOn) => sum + addOn.amount, 0),
    [selectedAddOns]
  );
  const total = (ticket?.amount ?? 0) + addOnTotal;

  if (!open || !ticketType || !ticket) return null;

  function toggleAddOn(addOnId: AddOnId) {
    setSelectedAddOns((current) =>
      current.includes(addOnId) ? current.filter((item) => item !== addOnId) : [...current, addOnId]
    );
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/checkout/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: FRONTIER_EVENT_ID,
          buyerEmail: email,
          buyerWallet: wallet || undefined,
          ticketType,
          addOns: selectedAddOns
        })
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
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/72 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] border border-white/12 bg-[#080914] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.55)] sm:rounded-[1.5rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#14f195]">Review & Approve</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Continue to KIRAPAY checkout</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">
              No charge happens here. Confirm your pass and email, then continue to KIRAPAY only when ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white/70 transition hover:text-white"
            aria-label="Close checkout review"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/48">Event</p>
              <p className="mt-1 font-black">Frontier Night 2026</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/48">Pass</p>
              <p className="mt-1 font-black">{ticket.label}</p>
            </div>
          </div>
          {reason ? (
            <div className="rounded-xl border border-[#14f195]/20 bg-[#14f195]/10 p-3 text-sm font-semibold leading-6 text-emerald-50/78">
              {reason}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Buyer email
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
          </div>
          <div className="grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-white/42">Public price</p>
              <p className="mt-1 font-black text-white">${ticket.amount} USD</p>
            </div>
            <div>
              <p className="text-white/42">Status after return</p>
              <p className="mt-1 font-black text-white">Pending until webhook</p>
            </div>
            <div>
              <p className="text-white/42">Ticket delivery</p>
              <p className="mt-1 font-black text-white">QR pass after payment</p>
            </div>
          </div>
        </div>

        <details className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <summary className="cursor-pointer list-none text-sm font-black text-white/82">
            Optional demo add-ons
            <span className="ml-2 text-xs font-bold uppercase tracking-[0.16em] text-white/42">not required</span>
          </summary>
          <p className="mt-2 text-sm leading-6 text-white/54">
            Keep the core flow simple: pass, email, KIRAPAY, QR. Add-ons are only for showing server-side totals.
          </p>
          <div className="mt-3 grid gap-2">
            {addOnCatalog.map((addOn) => (
              <label
                key={addOn.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 p-3 text-sm font-semibold text-white/72"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="size-4 accent-[#14f195]"
                  />
                  {addOn.label}
                </span>
                <span className="font-black text-white">+${addOn.amount}</span>
              </label>
            ))}
          </div>
        </details>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/24 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4 text-white/62">
              <span>{ticket.label}</span>
              <span>${ticket.amount} USD</span>
            </div>
            {addOnCatalog
              .filter((addOn) => selectedAddOns.includes(addOn.id))
              .map((addOn) => (
                <div key={addOn.id} className="flex justify-between gap-4 text-white/62">
                  <span>{addOn.label}</span>
                  <span>${addOn.amount} USD</span>
                </div>
              ))}
            <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-black text-white">
              <span>Public total</span>
              <span>${total} USD</span>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-white/60">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#14f195]" />
            KiraPass creates a pending order, redirects to KIRAPAY, then issues the QR ticket only after the KIRAPAY webhook confirms payment.
          </div>
        </div>

        {error ? <p className="mt-4 rounded-xl border border-red-300/25 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={submit}
            disabled={loading || !email}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#14f195] px-5 text-sm font-black text-[#04110b] transition hover:bg-[#7fffc8] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            Continue to KIRAPAY checkout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.055] px-5 text-sm font-black text-white/76 transition hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
