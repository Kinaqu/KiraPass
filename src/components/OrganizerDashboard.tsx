"use client";

import { useEffect, useState } from "react";
import { AttendeeTable } from "@/components/AttendeeTable";
import { OrganizerMetrics } from "@/components/OrganizerMetrics";
import { apiUrl } from "@/lib/api";
import type { AttendeeRow, WebhookEventRecord } from "@/types/domain";

type DashboardPayload = {
  metrics: {
    orders: number;
    paid: number;
    checkedIn: number;
    revenue: number;
  };
  attendees: AttendeeRow[];
  webhooks: WebhookEventRecord[];
};

export function OrganizerDashboard() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passcode, setPasscode] = useState("");
  const [submittedPasscode, setSubmittedPasscode] = useState("");
  const [needsPasscode, setNeedsPasscode] = useState(false);
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [reconcileMessage, setReconcileMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const response = await fetch(apiUrl("/api/organizer/attendees"), {
        headers: submittedPasscode ? { "x-organizer-passcode": submittedPasscode } : {}
      });
      const data = (await response.json()) as DashboardPayload | { message?: string };
      if (!active) return;
      if (response.status === 401) {
        setNeedsPasscode(true);
        setError(null);
        return;
      }
      if (!response.ok || !("attendees" in data)) {
        setError("message" in data ? data.message ?? "Unable to load dashboard" : "Unable to load dashboard");
        return;
      }
      setNeedsPasscode(false);
      setPayload(data);
    }
    load().catch((caught) => {
      if (active) setError(caught instanceof Error ? caught.message : "Unable to load dashboard");
    });
    return () => {
      active = false;
    };
  }, [submittedPasscode]);

  async function refund(row: AttendeeRow) {
    if (!row.transaction?.hash) return;
    const reason = window.prompt(`Refund ${row.order.buyerEmail}?`, "Organizer refund");
    if (reason === null) return;

    setRefundingOrderId(row.order.id);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/refund"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(submittedPasscode ? { "x-organizer-passcode": submittedPasscode } : {})
        },
        body: JSON.stringify({
          orderId: row.order.id,
          transactionId: row.transaction.kirapayTransactionId ?? row.transaction.id,
          txHash: row.transaction.hash,
          amount: row.order.totalAmount,
          reason
        })
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? "Refund failed");
      setSubmittedPasscode((current) => `${current}`);
      const refreshed = await fetch(apiUrl("/api/organizer/attendees"), {
        headers: submittedPasscode ? { "x-organizer-passcode": submittedPasscode } : {}
      });
      const refreshedData = (await refreshed.json()) as DashboardPayload;
      if (refreshed.ok) setPayload(refreshedData);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Refund failed");
    } finally {
      setRefundingOrderId(null);
    }
  }

  async function reconcile() {
    setReconciling(true);
    setError(null);
    setReconcileMessage(null);
    try {
      const response = await fetch(apiUrl("/api/reconcile/kirapay"), {
        method: "POST",
        headers: submittedPasscode ? { "x-organizer-passcode": submittedPasscode } : {}
      });
      const data = (await response.json()) as { checked?: number; reconciled?: unknown[]; message?: string };
      if (!response.ok) throw new Error(data.message ?? "Reconciliation failed");
      setReconcileMessage(`Checked ${data.checked ?? 0}, reconciled ${data.reconciled?.length ?? 0}.`);
      const refreshed = await fetch(apiUrl("/api/organizer/attendees"), {
        headers: submittedPasscode ? { "x-organizer-passcode": submittedPasscode } : {}
      });
      const refreshedData = (await refreshed.json()) as DashboardPayload;
      if (refreshed.ok) setPayload(refreshedData);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Reconciliation failed");
    } finally {
      setReconciling(false);
    }
  }

  if (error) return <div className="glass rounded-2xl p-6 text-red-100">{error}</div>;
  if (needsPasscode) {
    return (
      <section className="glass max-w-xl rounded-2xl p-6">
        <h2 className="text-lg font-black">Organizer passcode</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">
          Enter the organizer passcode to view attendee, payment, and check-in data.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            type="password"
            placeholder="Passcode"
            className="h-11 flex-1 rounded-lg border border-white/12 bg-slate-950/60 px-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-emerald-300/60"
          />
          <button
            type="button"
            disabled={!passcode}
            onClick={() => setSubmittedPasscode(passcode)}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-300 px-5 text-sm font-black text-slate-950 disabled:opacity-50"
          >
            Unlock
          </button>
        </div>
      </section>
    );
  }
  if (!payload) return <div className="glass rounded-2xl p-6 text-white/65">Loading organizer data from Cloudflare...</div>;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <OrganizerMetrics metrics={payload.metrics} />
        <button
          type="button"
          onClick={reconcile}
          disabled={reconciling}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-emerald-300/30 px-4 text-sm font-black text-emerald-100 hover:bg-emerald-300/10 disabled:opacity-45"
        >
          {reconciling ? "Reconciling..." : "Reconcile KIRAPAY"}
        </button>
      </div>
      {reconcileMessage ? <p className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/8 p-3 text-sm text-emerald-100">{reconcileMessage}</p> : null}
      <div className="mt-6">
        <AttendeeTable rows={payload.attendees} onRefund={refund} refundingOrderId={refundingOrderId} />
      </div>
      <WebhookDebugPanel webhooks={payload.webhooks} />
    </>
  );
}

function WebhookDebugPanel({ webhooks }: { webhooks: WebhookEventRecord[] }) {
  const failed = webhooks.filter((webhook) => !webhook.processed || webhook.processingError);
  return (
    <section className="glass mt-6 rounded-2xl p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-lg font-black">KIRAPAY webhooks</h2>
          <p className="mt-1 text-sm text-white/52">Recent webhook processing state for payload matching and demo debugging.</p>
        </div>
        <span className="text-sm font-bold text-white/50">{failed.length} need review</span>
      </div>
      <div className="mt-4 grid gap-2">
        {webhooks.slice(0, 6).map((webhook) => (
          <details key={webhook.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
            <summary className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="block font-bold">{webhook.eventType}</span>
                <span className="mt-1 block text-xs text-white/42">{webhook.orderId ?? webhook.kirapayTransactionId ?? webhook.id}</span>
              </span>
              <span className="text-sm font-bold">
                {webhook.processingError ? (
                  <span className="text-red-100">{webhook.processingError}</span>
                ) : webhook.processed ? (
                  <span className="text-emerald-200">Processed</span>
                ) : (
                  <span className="text-yellow-100">Stored</span>
                )}
              </span>
            </summary>
            <pre className="mt-3 max-h-72 overflow-auto rounded-lg border border-white/8 bg-slate-950/60 p-3 text-xs leading-5 text-white/62">
              {JSON.stringify(webhook.rawPayload, null, 2)}
            </pre>
          </details>
        ))}
        {webhooks.length === 0 ? <p className="text-sm text-white/45">No webhook events stored yet.</p> : null}
      </div>
    </section>
  );
}
