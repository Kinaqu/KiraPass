import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import type { AttendeeRow } from "@/types/domain";

export function AttendeeTable({ rows }: { rows: AttendeeRow[] }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-black">Attendees</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/[0.035] text-xs uppercase tracking-[0.18em] text-white/44">
            <tr>
              <th className="px-5 py-4">Buyer</th>
              <th className="px-5 py-4">Pass</th>
              <th className="px-5 py-4">Payment</th>
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
                <td className="px-5 py-4">{row.ticket ? <StatusBadge value={row.ticket.status} /> : <span className="text-white/42">Not issued</span>}</td>
                <td className="px-5 py-4 text-white/70">{row.ticket?.checkedIn ? "Checked in" : "Waiting"}</td>
                <td className="px-5 py-4">
                  {row.ticket ? (
                    <Link href={`/verify/${row.ticket.ticketCode}`} className="font-bold text-emerald-200 hover:text-emerald-100">
                      Verify
                    </Link>
                  ) : (
                    <span className="text-white/34">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
