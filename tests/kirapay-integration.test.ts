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
    expect(worker).toContain('firstString(data, ["link"])');
    expect(worker).toContain("directLinkId");
    expect(worker).toContain("directLinkCode");
    expect(worker).toContain("getOrderByKiraPayLink");
    expect(worker).toContain("processing_error");
  });

  it("persists recoverable KIRAPAY link identity for redirect and webhook reconciliation", () => {
    expect(worker).toContain("resolveKiraPayLinkIdentity(link.data, env)");
    expect(worker).toContain("parseKiraPayLinkCode");
    expect(worker).toContain('kiraPayApiUrl(env, "/link?page=1&limit=100")');
    expect(worker).not.toContain("getKiraPayLinkByCode");
    expect(worker).not.toContain("encodeURIComponent(code)");
    expect(worker).toContain("kirapay_link_code = ?");
    expect(worker).toContain("kirapay_payment_link_id = ?");
  });

  it("exposes order lookup by email so pending payments are visible before QR issuance", () => {
    expect(worker).toContain('if (path === "/api/orders" && request.method === "GET")');
    expect(worker).toContain("getOrdersByEmail");
    expect(worker).toContain("mapPublicOrderLookup");
  });

  it("verifies and reconciles KIRAPAY transactions before issuing tickets", () => {
    expect(worker).toContain("verifyKiraPayTransactionForOrder");
    expect(worker).toContain("getRecentKiraPayTransactions");
    expect(worker).toContain("getKiraPayLinks");
    expect(worker).toContain("extractKiraPayList");
    expect(worker).toContain("enrichTransactionsWithLinks");
    expect(worker).toContain("transactionMatchesOrder");
    expect(worker).toContain('path === "/api/reconcile/kirapay"');
    expect(worker).toContain("reconcilePendingKiraPayOrders");
  });

  it("does not round demo crypto payment amounts to cents", () => {
    expect(worker).toContain("roundTokenAmount(publicTotalAmount / FRONTIER_DEMO_PAYMENT_DIVISOR)");
    expect(worker).toContain("Math.round(amount * 1_000_000) / 1_000_000");
  });
});
