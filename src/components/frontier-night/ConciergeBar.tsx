"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { TicketType } from "@/types/domain";

type ConciergeResult = {
  ticketType: TicketType;
  reason: string;
};

const suggestions = [
  "VIP under $40",
  "Best networking",
  "2 general passes",
  "Under $20",
  "Reserve VIP"
];

function parseIntent(value: string): ConciergeResult | null {
  const input = value.toLowerCase().trim();
  if (!input) return null;

  if (input.includes("under $20") || input.includes("under 20") || input.includes("general") || input.includes("value")) {
    return {
      ticketType: "general",
      reason: "General Pass matches the lower-budget request."
    };
  }

  if (input.includes("vip") || input.includes("networking") || input.includes("priority") || input.includes("founder")) {
    return {
      ticketType: "vip",
      reason: "VIP Builder Pass is best for networking and priority entry."
    };
  }

  if (/\b2\b|\btwo\b/.test(input)) {
    return {
      ticketType: "general",
      reason: "Two-pass requests start with General Pass for the cleanest demo checkout."
    };
  }

  if (input.includes("ticket") || input.includes("pass") || input.includes("reserve")) {
    return {
      ticketType: "general",
      reason: "General Pass is the default event access option."
    };
  }

  return null;
}

export function ConciergeBar({
  selectedTicket,
  onSelect
}: {
  selectedTicket: TicketType | null;
  onSelect: (ticketType: TicketType, reason: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Try “VIP under $40” or “best networking”.");

  const activeLabel = useMemo(() => {
    if (selectedTicket === "vip") return "VIP Builder Pass selected";
    if (selectedTicket === "general") return "General Pass selected";
    return "No pass selected";
  }, [selectedTicket]);

  function runIntent(value: string) {
    const result = parseIntent(value);
    if (!result) {
      setMessage("I can route simple requests like general, VIP, under $20, or best networking.");
      return;
    }
    onSelect(result.ticketType, result.reason);
    setMessage(result.reason);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runIntent(query);
  }

  return (
    <section id="concierge" className="relative z-10 mx-auto max-w-7xl px-5 pb-6 sm:px-8">
      <div className="rounded-[1.5rem] border border-white/10 bg-[#070812]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#14f195]">
          <Sparkles className="size-4" />
          Concierge Bar
        </div>
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/34" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tell KiraPass what you want, e.g. best networking"
              className="h-14 w-full rounded-2xl border border-white/12 bg-white/[0.055] pl-12 pr-4 text-base font-semibold text-white outline-none transition placeholder:text-white/32 focus:border-[#14f195]/55"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#14f195] px-6 text-sm font-black text-[#04110b] transition hover:bg-[#7fffc8] focus:outline-none focus:ring-2 focus:ring-[#14f195]/70"
          >
            Find pass
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                runIntent(suggestion);
              }}
              className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#14f195]/35 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white/64">{message}</p>
          <p className="font-black text-white/78">{activeLabel}</p>
        </div>
      </div>
    </section>
  );
}
