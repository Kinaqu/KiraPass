"use client";

import { useEffect, useState } from "react";
import { AttendeeTable } from "@/components/AttendeeTable";
import { OrganizerMetrics } from "@/components/OrganizerMetrics";
import { apiUrl } from "@/lib/api";
import type { AttendeeRow } from "@/types/domain";

type DashboardPayload = {
  metrics: {
    orders: number;
    paid: number;
    checkedIn: number;
    revenue: number;
  };
  attendees: AttendeeRow[];
};

export function OrganizerDashboard() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const response = await fetch(apiUrl("/api/organizer/attendees"));
      const data = (await response.json()) as DashboardPayload | { message?: string };
      if (!active) return;
      if (!response.ok || !("attendees" in data)) {
        setError("message" in data ? data.message ?? "Unable to load dashboard" : "Unable to load dashboard");
        return;
      }
      setPayload(data);
    }
    load().catch((caught) => {
      if (active) setError(caught instanceof Error ? caught.message : "Unable to load dashboard");
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) return <div className="glass rounded-2xl p-6 text-red-100">{error}</div>;
  if (!payload) return <div className="glass rounded-2xl p-6 text-white/65">Loading organizer data from Cloudflare...</div>;

  return (
    <>
      <OrganizerMetrics metrics={payload.metrics} />
      <div className="mt-6">
        <AttendeeTable rows={payload.attendees} />
      </div>
    </>
  );
}
