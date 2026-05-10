import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

describe("Cloudflare backend architecture", () => {
  it("does not keep Next.js API routes as backend", () => {
    expect(existsSync(join(process.cwd(), "src/app/api"))).toBe(false);
  });

  it("defines Cloudflare Worker routes for the KiraPass API", () => {
    const worker = readFileSync(join(process.cwd(), "worker/src/index.ts"), "utf8");
    for (const route of [
      "/api/checkout/create",
      "/api/webhooks/kirapay",
      "/api\\/orders\\/",
      "/api/tickets",
      "/api/tickets/verify",
      "/api/organizer/attendees",
      "/api/refund"
    ]) {
      expect(worker).toContain(route);
    }
  });

  it("uses D1 migrations for persistent backend storage", () => {
    const migration = readFileSync(join(process.cwd(), "worker/migrations/0001_init.sql"), "utf8");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS orders");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS tickets");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS kirapay_transactions");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS webhook_events");
    const hardeningMigration = readFileSync(join(process.cwd(), "worker/migrations/0003_kirapay_webhook_hardening.sql"), "utf8");
    expect(hardeningMigration).toContain("processing_error");
    expect(hardeningMigration).toContain("processed_at");
  });

  it("keeps KIRAPAY secrets out of client components", () => {
    const clientFiles = collectFiles(join(process.cwd(), "src")).filter((file) => {
      const content = readFileSync(file, "utf8");
      return content.startsWith('"use client"') || content.startsWith("'use client'");
    });

    for (const file of clientFiles) {
      const content = readFileSync(file, "utf8");
      expect(content, file).not.toContain("KIRAPAY_API_KEY");
      expect(content, file).not.toContain("KIRAPAY_WEBHOOK_SECRET");
    }
  });
});

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return collectFiles(path);
    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });
}
