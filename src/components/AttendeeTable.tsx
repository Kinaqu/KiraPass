import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { AttendeeRow } from "@/types/domain";

export function AttendeeTable({
  rows,
  onRefund,
  refundingOrderId
}: {
  rows: AttendeeRow[];
  onRefund?: (row: AttendeeRow) => void;
  refundingOrderId?: string | null;
}) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-black">Attendees</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/[0.035] text-xs uppercase tracking-[0.18em] text-white/44">
            <tr>
              <th className="px-5 py-4">Buyer</th>
              <th className="px-5 py-4">Pass</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">KIRAPAY tx</th>
              <th className="px-5 py-4">Ticket</th>
              <th className="px-5 py-4">Check-in</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {rows.map((row) => (
              <tr key={row.order.id}>
                <td className="px-5 py-4 font-semibold">{row.order.buyerEmail}</td>
                <td className="px-5 py-4 capitalize text-white/70">{row.order.ticketType}</td>
                <td className="px-5 py-4">
                  <StatusBadge value={row.order.status} />
                </td>
                <td className="px-5 py-4 text-white/62">
                  {row.transaction?.hash ? (
                    <span title={row.transaction.hash}>{shortHash(row.transaction.hash)}</span>
                  ) : row.transaction?.kirapayTransactionId ? (
                    <span title={row.transaction.kirapayTransactionId}>{shortHash(row.transaction.kirapayTransactionId)}</span>
                  ) : (
                    <span className="text-white/34">Waiting</span>
                  )}
                </td>
                <td className="px-5 py-4">{row.ticket ? <StatusBadge value={row.ticket.status} /> : <span className="text-white/42">Not issued</span>}</td>
                <td className="px-5 py-4 text-white/70">{row.ticket?.checkedIn ? "Checked in" : "Waiting"}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                  {row.ticket ? (
                    <Link href={`/verify/${row.ticket.ticketCode}`} className="font-bold text-emerald-200 hover:text-emerald-100">
                      Verify
                    </Link>
                  ) : (
                    <span className="text-white/34">Pending</span>
                  )}
                  {onRefund && row.order.status === "paid" && row.transaction?.hash ? (
                    <button
                      type="button"
                      onClick={() => onRefund(row)}
                      disabled={refundingOrderId === row.order.id}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-100/80 hover:text-red-100 disabled:opacity-45"
                    >
                      <RotateCcw className="size-3" />
                      Refund
                    </button>
                  ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function shortHash(value: string) {
  return value.length > 14 ? `${value.slice(0, 6)}...${value.slice(-6)}` : value;
}
