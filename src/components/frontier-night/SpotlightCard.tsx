"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Position = {
  x: number;
  y: number;
};

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(20, 241, 149, 0.18)"
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onFocus={() => setOpacity(1)}
      onBlur={() => setOpacity(0)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:border-white/20",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 72%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
