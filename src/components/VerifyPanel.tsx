"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { apiUrl } from "@/lib/api";

type PublicTicket = {
  id: string;
  buyerEmail: string;
  ticketType: string;
  ticketCode: string;
  status: string;
  checkedIn: boolean;
  event: { title: string; date: string; location: string };
};

export function VerifyPanel({ ticketCode }: { ticketCode: string }) {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; reason: string; ticket: PublicTicket | null } | null>(null);

  async function verify(checkIn: boolean) {
    setLoading(true);
    const response = await fetch(apiUrl("/api/tickets/verify"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketCode, checkIn, passcode: passcode || undefined })
    });
    const payload = (await response.json()) as { ok?: boolean; reason?: string; ticket?: PublicTicket | null; message?: string };
    setResult({
      ok: Boolean(payload.ok),
      reason: payload.reason ?? payload.message ?? "Unable to verify ticket.",
      ticket: payload.ticket ?? null
    });
    setLoading(false);
  }

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-300/12 text-emerald-200">
          {result?.ok ? <CheckCircle2 className="size-6" /> : <ShieldAlert className="size-6" />}
        </span>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-white/42">Ticket code</p>
          <h1 className="mt-2 text-4xl font-black">{ticketCode}</h1>
        </div>
      </div>
      <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        Organizer passcode
        <input
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          type="password"
          placeholder="Optional for local demo"
          className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-emerald-300/60"
        />
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => verify(false)}
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/12 bg-white/6 px-4 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Verify
        </button>
        <button
          onClick={() => verify(true)}
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-black text-slate-950 disabled:opacity-50"
        >
          Check in attendee
        </button>
      </div>
      {result ? (
        <div className={`mt-6 rounded-xl border p-4 ${result.ok ? "border-emerald-300/25 bg-emerald-300/10" : "border-red-300/25 bg-red-300/10"}`}>
          <p className="font-bold">{result.reason}</p>
          {result.ticket ? (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-white/42">Attendee</dt>
                <dd className="mt-1 font-semibold">{result.ticket.buyerEmail}</dd>
              </div>
              <div>
                <dt className="text-white/42">Pass</dt>
                <dd className="mt-1 font-semibold capitalize">{result.ticket.ticketType}</dd>
              </div>
              <div>
                <dt className="text-white/42">Status</dt>
                <dd className="mt-1">
                  <StatusBadge value={result.ticket.status} />
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
