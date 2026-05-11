import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("KIRAPAY integration guardrails", () => {
  const worker = readFileSync(join(process.cwd(), "worker/src/index.ts"), "utf8");

  it("builds KIRAPAY URLs from the /api base without duplicating /api", () => {
    expect(worker).toContain('const KIRAPAY_BASE_URL = "https://api.kira-pay.com/api"');
    expect(worker).toContain('kiraPayApiUrl(env, "/link/generate")');
    expect(worker).toContain('kiraPayApiUrl(env, "/wallet/transactions/refund")');
    expect(worker).not.toContain("/api/link/generate");
    expect(worker).not.toContain("/api/wallet/transactions/refund");
  });

  it("uses the KIRAPAY API Reference payment link payload", () => {
    expect(worker).toContain("tokenOut: {");
    expect(worker).toContain('chainId: requireEnv(env.SETTLEMENT_CHAIN_ID, "SETTLEMENT_CHAIN_ID")');
    expect(worker).toContain('address: requireEnv(env.SETTLEMENT_TOKEN_ADDRESS, "SETTLEMENT_TOKEN_ADDRESS")');
    expect(worker).toContain('receiver: requireEnv(env.MERCHANT_WALLET_ADDRESS, "MERCHANT_WALLET_ADDRESS")');
    expect(worker).toContain("const FRONTIER_DEMO_PAYMENT_DIVISOR = 1000");
    expect(worker).toContain("const paymentTotalAmount = getKiraPayPaymentAmount(event.id, totalAmount)");
    expect(worker).toContain("originalPrice: paymentTotalAmount");
    expect(worker).toContain('fiatCurrency: "USD"');
  });

  it("keeps ticket issuance behind webhook-confirmed paid orders", () => {
    const successStatus = readFileSync(join(process.cwd(), "src/components/SuccessStatus.tsx"), "utf8");
    expect(successStatus).toContain("/api/orders/");
    expect(successStatus).not.toContain("/api/tickets");
    expect(successStatus).not.toContain("/api/checkout/create");
    expect(worker).toContain("ORDER_NOT_PAID");
    expect(worker).toContain("createTicketIfMissing(order.id, env)");
  });

  it("has idempotency and fallback matching for KIRAPAY webhooks", () => {
    expect(worker).toContain("INSERT OR IGNORE INTO kirapay_transactions");
    expect(worker).toContain("SELECT * FROM tickets WHERE order_id = ?");
    expect(worker).toContain("findOrderForWebhook");
    expect(worker).toContain("getOrderByKiraPayLink");
    expect(worker).toContain("processing_error");
  });
});
