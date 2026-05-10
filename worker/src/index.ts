/// <reference types="@cloudflare/workers-types" />

import { z } from "zod";

type Env = {
  DB: D1Database;
  KIRAPAY_API_KEY?: string;
  KIRAPAY_BASE_URL?: string;
  KIRAPAY_WEBHOOK_SECRET?: string;
  KIRAPAY_CURRENCY?: string;
  MERCHANT_WALLET_ADDRESS?: string;
  FRONTEND_URL: string;
  FRONTEND_ORIGIN?: string;
  ORGANIZER_PASSCODE?: string;
  KIRAPAY_MOCK_MODE?: string;
  ENVIRONMENT?: string;
};

type TicketType = "general" | "vip";
type OrderStatus = "pending" | "paid" | "failed" | "refunded";
type TicketStatus = "active" | "used" | "cancelled" | "refunded";
type AddOnId = "livestream_replay" | "priority_checkin" | "sponsor_networking";

type OrderAddOn = {
  id: AddOnId;
  label: string;
  amount: number;
};

type OrderRow = {
  id: string;
  event_id: string;
  buyer_email: string;
  buyer_wallet: string | null;
  ticket_type: TicketType;
  amount: number;
  total_amount: number;
  add_ons: string;
  currency: string;
  status: OrderStatus;
  custom_order_id: string;
  kirapay_checkout_url: string | null;
  kirapay_link_code: string | null;
  kirapay_payment_link_id: string | null;
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  general_price: number;
  vip_price: number;
  created_at: string;
  updated_at: string;
};

type TicketRow = {
  id: string;
  order_id: string;
  event_id: string;
  buyer_email: string;
  ticket_type: TicketType;
  ticket_code: string;
  qr_url: string;
  status: TicketStatus;
  checked_in: number;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
};

const FRONTIER_EVENT_ID = "event_frontier_night_2026";
const KIRAPAY_BASE_URL = "https://api.kira-pay.com/api";

const checkoutSchema = z.object({
  eventId: z.string().optional().default(FRONTIER_EVENT_ID),
  buyerEmail: z.string().email(),
  buyerWallet: z.string().trim().optional(),
  ticketType: z.enum(["general", "vip"]),
  addOns: z.array(z.enum(["livestream_replay", "priority_checkin", "sponsor_networking"])).default([])
});

const verifySchema = z.object({
  ticketCode: z.string().min(4),
  checkIn: z.boolean().optional(),
  passcode: z.string().optional()
});

const refundSchema = z.object({
  orderId: z.string(),
  transactionId: z.string(),
  txHash: z.string(),
  amount: z.number().positive(),
  reason: z.string().optional()
});

const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.unknown()).default({})
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return corsResponse(request, env);

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/$/, "") || "/";

      if (path === "/health" && request.method === "GET") {
        return json(request, env, { ok: true, service: "kirapass-api" });
      }

      if (path === "/api/checkout/create" && request.method === "POST") {
        return json(request, env, await createCheckout(await request.json(), env), { status: 201 });
      }

      if (path === "/api/webhooks/kirapay" && request.method === "POST") {
        const rawBody = await request.text();
        if (!(await verifyKiraPayWebhook(request, rawBody, env))) {
          return json(request, env, { message: "WEBHOOK_VERIFICATION_FAILED" }, { status: 401 });
        }
        return json(request, env, await processWebhook(JSON.parse(rawBody), env));
      }

      const orderMatch = path.match(/^\/api\/orders\/([^/]+)$/);
      if (orderMatch && request.method === "GET") {
        return json(request, env, await getOrderPayload(orderMatch[1], env));
      }

      if (path === "/api/tickets" && request.method === "GET") {
        const email = url.searchParams.get("email");
        return json(request, env, { tickets: email ? await getTicketsByEmail(email, env) : [] });
      }

      const ticketMatch = path.match(/^\/api\/tickets\/([^/]+)$/);
      if (ticketMatch && request.method === "GET") {
        const ticket = await getTicketById(ticketMatch[1], env);
        if (!ticket) return json(request, env, { message: "TICKET_NOT_FOUND" }, { status: 404 });
        return json(request, env, { ticket });
      }

      if (path === "/api/tickets/verify" && request.method === "POST") {
        return json(request, env, await verifyTicket(await request.json(), env));
      }

      if (path === "/api/organizer/attendees" && request.method === "GET") {
        if (!isOrganizerAuthorized(request, env)) {
          return json(request, env, { message: "ORGANIZER_UNAUTHORIZED" }, { status: 401 });
        }
        return json(request, env, await listAttendees(env));
      }

      if (path === "/api/refund" && request.method === "POST") {
        if (!isOrganizerAuthorized(request, env)) {
          return json(request, env, { message: "ORGANIZER_UNAUTHORIZED" }, { status: 401 });
        }
        return json(request, env, await refundTransaction(await request.json(), env), { status: 201 });
      }

      return json(request, env, { message: "NOT_FOUND" }, { status: 404 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
      return json(request, env, { message }, { status: message.includes("NOT_FOUND") ? 404 : 400 });
    }
  }
} satisfies ExportedHandler<Env>;

async function createCheckout(rawInput: unknown, env: Env) {
  await ensureSeedEvent(env);
  const input = checkoutSchema.parse(rawInput);
  const event = await getEventById(input.eventId, env);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const orderId = createId("order");
  const amount = getTicketPrice(event, input.ticketType);
  const addOns = getAddOns(input.addOns);
  const totalAmount = amount + addOns.reduce((sum, addOn) => sum + addOn.amount, 0);
  const now = isoNow();

  await env.DB.prepare(
    `INSERT INTO orders (
      id, event_id, buyer_email, buyer_wallet, ticket_type, amount, total_amount, add_ons, currency, status,
      custom_order_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USD', 'pending', ?, ?, ?)`
  )
    .bind(
      orderId,
      event.id,
      input.buyerEmail.toLowerCase(),
      input.buyerWallet || null,
      input.ticketType,
      amount,
      totalAmount,
      JSON.stringify(addOns),
      orderId,
      now,
      now
    )
    .run();

  const redirectUrl = `${trimSlash(env.FRONTEND_URL)}/checkout/success?orderId=${encodeURIComponent(orderId)}`;
  const link = await createKiraPayLink(
    {
      price: totalAmount,
      currency: env.KIRAPAY_CURRENCY ?? "USDC",
      receiver: requireEnv(env.MERCHANT_WALLET_ADDRESS, "MERCHANT_WALLET_ADDRESS"),
      name: `KiraPass ${getTicketLabel(input.ticketType)} - ${event.title}`,
      customOrderId: orderId,
      redirectUrl
    },
    env
  ).catch(async (error) => {
    await env.DB.prepare("UPDATE orders SET status = 'failed', updated_at = ? WHERE id = ?")
      .bind(isoNow(), orderId)
      .run();
    throw error;
  });

  await env.DB.prepare(
    `UPDATE orders
      SET kirapay_checkout_url = ?, kirapay_link_code = ?, kirapay_payment_link_id = ?, updated_at = ?
      WHERE id = ?`
  )
    .bind(link.data.url, link.data.code ?? null, link.data.id ?? link.data._id ?? null, isoNow(), orderId)
    .run();

  const order = await getOrderById(orderId, env);
  return { orderId, checkoutUrl: link.data.url, status: order?.status ?? "pending", totalAmount };
}

async function processWebhook(rawPayload: unknown, env: Env) {
  const parsed = webhookSchema.parse(rawPayload);
  const data = parsed.data as Record<string, unknown>;
  const kirapayTransactionId = stringOrNull(data.transactionId) ?? stringOrNull(data.id) ?? stringOrNull(data._id);
  const webhookId = createId("webhook");

  await env.DB.prepare(
    `INSERT INTO webhook_events (id, event_type, kirapay_transaction_id, raw_payload, processed, created_at)
      VALUES (?, ?, ?, ?, 0, ?)`
  )
    .bind(webhookId, parsed.event, kirapayTransactionId, JSON.stringify(parsed), isoNow())
    .run();

  if (parsed.event !== "transaction.succeeded") {
    return { ok: true, processed: false, ticketId: null };
  }

  const order = await findOrderForWebhook(data, env);
  if (!order) {
    await markWebhookFailed(webhookId, "ORDER_REFERENCE_MISSING_OR_UNMATCHED", env);
    return { ok: true, processed: false, ticketId: null, reason: "ORDER_REFERENCE_MISSING_OR_UNMATCHED" };
  }

  if (!isSuccessStatus(stringOrNull(data.status))) {
    await markWebhookFailed(webhookId, "TRANSACTION_NOT_SUCCESSFUL", env);
    return { ok: true, processed: false, ticketId: null, reason: "TRANSACTION_NOT_SUCCESSFUL" };
  }

  await env.DB.prepare(
    `INSERT OR IGNORE INTO kirapay_transactions (
      id, order_id, kirapay_transaction_id, hash, status, price, settlement_amount,
      sender, recipient, raw_payload, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      createId("kirapay_tx"),
      order.id,
      kirapayTransactionId,
      stringOrNull(data.hash) ?? stringOrNull(data.transaction_hash),
      stringOrNull(data.status) ?? "Success",
      numberOrNull(data.price) ?? numberOrNull(data.amount),
      numberOrNull(data.settlementAmount),
      stringOrNull(data.sender),
      stringOrNull(data.recipient) ?? stringOrNull(data.receiver),
      JSON.stringify(data),
      isoNow()
    )
    .run();

  if (order.status === "refunded" || order.status === "failed") {
    await markWebhookFailed(webhookId, `ORDER_ALREADY_${order.status.toUpperCase()}`, env, order.id);
    return { ok: true, processed: false, ticketId: null, reason: `ORDER_ALREADY_${order.status.toUpperCase()}` };
  }

  if (order.status !== "paid") {
    await env.DB.prepare("UPDATE orders SET status = 'paid', updated_at = ? WHERE id = ?")
      .bind(isoNow(), order.id)
      .run();
  }

  const ticket = await createTicketIfMissing(order.id, env);
  await env.DB.prepare("UPDATE webhook_events SET processed = 1, order_id = ?, processed_at = ?, processing_error = NULL WHERE id = ?")
    .bind(order.id, isoNow(), webhookId)
    .run();
  return { ok: true, processed: true, ticketId: ticket.id };
}

async function getOrderPayload(orderId: string, env: Env) {
  const order = await getOrderById(orderId, env);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  const ticket = await env.DB.prepare("SELECT id FROM tickets WHERE order_id = ?")
    .bind(order.id)
    .first<{ id: string }>();
  return { order: mapOrder(order), ticketId: ticket?.id ?? null };
}

async function getTicketById(ticketId: string, env: Env) {
  const row = await env.DB.prepare(
    `SELECT
      t.*, o.id AS order_id_joined, o.amount, o.currency, o.status AS order_status,
      e.title, e.date, e.location
    FROM tickets t
    JOIN orders o ON o.id = t.order_id
    JOIN events e ON e.id = t.event_id
    WHERE t.id = ?`
  )
    .bind(ticketId)
    .first<Record<string, unknown>>();
  return row ? mapTicketPayload(row) : null;
}

async function getTicketByCode(ticketCode: string, env: Env) {
  const row = await env.DB.prepare(
    `SELECT
      t.*, o.id AS order_id_joined, o.amount, o.currency, o.status AS order_status,
      e.title, e.date, e.location
    FROM tickets t
    JOIN orders o ON o.id = t.order_id
    JOIN events e ON e.id = t.event_id
    WHERE t.ticket_code = ?`
  )
    .bind(ticketCode)
    .first<Record<string, unknown>>();
  return row ? mapTicketPayload(row) : null;
}

async function getTicketsByEmail(email: string, env: Env) {
  const result = await env.DB.prepare(
    `SELECT
      t.*, o.id AS order_id_joined, o.amount, o.currency, o.status AS order_status,
      e.title, e.date, e.location
    FROM tickets t
    JOIN orders o ON o.id = t.order_id
    JOIN events e ON e.id = t.event_id
    WHERE lower(t.buyer_email) = lower(?)
    ORDER BY t.created_at DESC`
  )
    .bind(email)
    .all<Record<string, unknown>>();
  return result.results.map(mapTicketPayload);
}

async function verifyTicket(rawInput: unknown, env: Env) {
  const input = verifySchema.parse(rawInput);
  if (env.ORGANIZER_PASSCODE && input.passcode !== env.ORGANIZER_PASSCODE) {
    return { ok: false, reason: "Invalid organizer passcode.", ticket: null };
  }

  const ticket = await getTicketByCode(input.ticketCode, env);
  if (!ticket) return { ok: false, reason: "Ticket not found.", ticket: null };
  if (ticket.status === "cancelled" || ticket.status === "refunded") {
    return { ok: false, reason: `Ticket is ${ticket.status}.`, ticket };
  }
  if (ticket.checkedIn || ticket.status === "used") {
    return { ok: false, reason: "Ticket has already been checked in.", ticket };
  }
  if (!input.checkIn) {
    return { ok: true, reason: "Ticket is valid.", ticket };
  }

  await env.DB.prepare(
    "UPDATE tickets SET checked_in = 1, checked_in_at = ?, status = 'used', updated_at = ? WHERE id = ?"
  )
    .bind(isoNow(), isoNow(), ticket.id)
    .run();

  return { ok: true, reason: "Ticket checked in.", ticket: await getTicketByCode(input.ticketCode, env) };
}

async function listAttendees(env: Env) {
  const result = await env.DB.prepare(
    `SELECT
      o.*,
      e.id AS event_id_joined, e.title, e.slug, e.description, e.date, e.location, e.image_url,
      e.general_price, e.vip_price, e.created_at AS event_created_at, e.updated_at AS event_updated_at,
      t.id AS ticket_id, t.ticket_code, t.qr_url, t.status AS ticket_status, t.checked_in,
      t.checked_in_at, t.created_at AS ticket_created_at, t.updated_at AS ticket_updated_at,
      tx.id AS transaction_id, tx.kirapay_transaction_id, tx.hash, tx.status AS transaction_status,
      tx.price, tx.settlement_amount, tx.sender, tx.recipient, tx.raw_payload, tx.created_at AS transaction_created_at
    FROM orders o
    JOIN events e ON e.id = o.event_id
    LEFT JOIN tickets t ON t.order_id = o.id
    LEFT JOIN kirapay_transactions tx ON tx.id = (
      SELECT latest_tx.id
      FROM kirapay_transactions latest_tx
      WHERE latest_tx.order_id = o.id
      ORDER BY latest_tx.created_at DESC
      LIMIT 1
    )
    ORDER BY o.created_at DESC`
  ).all<Record<string, unknown>>();

  const attendees = result.results.map(mapAttendeeRow);
  const webhookResult = await env.DB.prepare(
    `SELECT id, event_type, order_id, kirapay_transaction_id, raw_payload, processed, processed_at, processing_error, created_at
      FROM webhook_events
      ORDER BY created_at DESC
      LIMIT 20`
  ).all<Record<string, unknown>>();
  const metrics = {
    orders: attendees.length,
    paid: attendees.filter((row) => row.order.status === "paid").length,
    checkedIn: attendees.filter((row) => row.ticket?.checkedIn).length,
    revenue: attendees
      .filter((row) => row.order.status === "paid")
      .reduce((sum, row) => sum + row.order.totalAmount, 0)
  };
  return { metrics, attendees, webhooks: webhookResult.results.map(mapWebhookEvent) };
}

async function refundTransaction(rawInput: unknown, env: Env) {
  const input = refundSchema.parse(rawInput);
  const order = await getOrderById(input.orderId, env);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (order.status !== "paid") throw new Error("ORDER_NOT_REFUNDABLE");

  const apiKey = requireEnv(env.KIRAPAY_API_KEY, "KIRAPAY_API_KEY");
  const requestId = createId("refund_req");
  const response = await fetch(kiraPayApiUrl(env, "/wallet/transactions/refund"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      transactionId: input.transactionId,
      txHash: input.txHash,
      amount: input.amount,
      reason: input.reason,
      requestId,
      type: "Transfer"
    })
  });
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw new Error("KIRAPAY_REFUND_FAILED");

  const refundId = createId("refund");
  const refundTxHash = stringOrNull(payload?.hash) ?? stringOrNull(payload?.txHash) ?? stringOrNull(payload?.data);
  await env.DB.prepare(
    `INSERT INTO refunds (id, order_id, transaction_id, refund_tx_hash, amount, reason, status, raw_payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'requested', ?, ?)`
  )
    .bind(refundId, input.orderId, input.transactionId, refundTxHash, input.amount, input.reason ?? null, JSON.stringify(payload), isoNow())
    .run();

  await env.DB.prepare("UPDATE orders SET status = 'refunded', updated_at = ? WHERE id = ?")
    .bind(isoNow(), input.orderId)
    .run();
  await env.DB.prepare("UPDATE tickets SET status = 'refunded', updated_at = ? WHERE order_id = ?")
    .bind(isoNow(), input.orderId)
    .run();

  return { refundId, requestId, payload };
}

type KiraPayLinkResult = {
  data: {
    url: string;
    price?: unknown;
    originalPrice?: unknown;
    code?: string;
    id?: string;
    _id?: string;
    raw?: unknown;
  };
};

async function createKiraPayLink(input: Record<string, unknown>, env: Env): Promise<KiraPayLinkResult> {
  if (env.KIRAPAY_MOCK_MODE === "true" || (!env.KIRAPAY_API_KEY && env.ENVIRONMENT !== "production")) {
    return {
      data: {
        url: `${trimSlash(env.FRONTEND_URL)}/checkout/success?orderId=${input.customOrderId}&mock=1`,
        price: input.price,
        code: `mock_${input.customOrderId}`
      }
    };
  }

  const response = await fetch(kiraPayApiUrl(env, "/link/generate"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": requireEnv(env.KIRAPAY_API_KEY, "KIRAPAY_API_KEY")
    },
    body: JSON.stringify(input)
  });
  const payload = (await response.json().catch(() => null)) as
    | { data?: Record<string, unknown>; url?: string; checkoutUrl?: string }
    | null;
  const data = normalizeKiraPayLinkPayload(payload);
  if (!response.ok || !data.url) throw new Error("KIRAPAY_LINK_CREATE_FAILED");
  return { data };
}

async function createTicketIfMissing(orderId: string, env: Env): Promise<TicketRow> {
  const existing = await env.DB.prepare("SELECT * FROM tickets WHERE order_id = ?")
    .bind(orderId)
    .first<TicketRow>();
  if (existing) return existing;

  const order = await getOrderById(orderId, env);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (order.status !== "paid") throw new Error("ORDER_NOT_PAID");
  const ticketCode = createTicketCode();
  const ticketId = createId("ticket");
  const now = isoNow();

  await env.DB.prepare(
    `INSERT INTO tickets (
      id, order_id, event_id, buyer_email, ticket_type, ticket_code, qr_url,
      status, checked_in, checked_in_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 0, NULL, ?, ?)`
  )
    .bind(
      ticketId,
      order.id,
      order.event_id,
      order.buyer_email,
      order.ticket_type,
      ticketCode,
      `${trimSlash(env.FRONTEND_URL)}/verify/${encodeURIComponent(ticketCode)}`,
      now,
      now
    )
    .run();

  const ticket = await env.DB.prepare("SELECT * FROM tickets WHERE id = ?").bind(ticketId).first<TicketRow>();
  if (!ticket) throw new Error("TICKET_CREATE_FAILED");
  return ticket;
}

async function getOrderById(orderId: string, env: Env) {
  return env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first<OrderRow>();
}

async function getOrderByCustomOrderId(customOrderId: string, env: Env) {
  return env.DB.prepare("SELECT * FROM orders WHERE custom_order_id = ?").bind(customOrderId).first<OrderRow>();
}

async function getOrderByKiraPayLink(paymentLinkId: string | null, linkCode: string | null, env: Env) {
  if (paymentLinkId) {
    const order = await env.DB.prepare("SELECT * FROM orders WHERE kirapay_payment_link_id = ?")
      .bind(paymentLinkId)
      .first<OrderRow>();
    if (order) return order;
  }

  if (linkCode) {
    return env.DB.prepare("SELECT * FROM orders WHERE kirapay_link_code = ?")
      .bind(linkCode)
      .first<OrderRow>();
  }

  return null;
}

async function getEventById(eventId: string, env: Env) {
  return env.DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first<EventRow>();
}

async function ensureSeedEvent(env: Env) {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO events (
      id, title, slug, description, date, location, image_url, general_price, vip_price, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, 15, 35, ?, ?)`
  )
    .bind(
      FRONTIER_EVENT_ID,
      "Frontier Night 2026",
      "frontier-night",
      "An evening for Solana builders, hackathon teams, crypto founders, and ecosystem partners. Reserve your pass using any supported chain or token through KIRAPAY and receive a QR event pass after payment confirmation.",
      "2026-05-18T19:00:00.000Z",
      "Istanbul, Turkiye",
      "2026-05-07T00:00:00.000Z",
      "2026-05-07T00:00:00.000Z"
    )
    .run();
}

async function verifyKiraPayWebhook(request: Request, rawBody: string, env: Env) {
  if (!env.KIRAPAY_WEBHOOK_SECRET) return env.KIRAPAY_MOCK_MODE === "true" || env.ENVIRONMENT !== "production";

  const signature = request.headers.get("x-kirapay-signature");
  if (signature) {
    const expected = await hmacHex(env.KIRAPAY_WEBHOOK_SECRET, rawBody);
    return timingSafeEqual(signature.replace(/^sha256=/, ""), expected);
  }

  const directSecret = request.headers.get("x-webhook-secret");
  if (directSecret && timingSafeEqual(directSecret, env.KIRAPAY_WEBHOOK_SECRET)) return true;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return timingSafeEqual(authorization.slice("Bearer ".length), env.KIRAPAY_WEBHOOK_SECRET);
  }

  return false;
}

async function hmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(request: Request, env: Env, body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request, env),
      ...init.headers
    }
  });
}

function corsResponse(request: Request, env: Env) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env)
  });
}

function corsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin");
  const allowed = env.FRONTEND_ORIGIN || origin || "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,x-webhook-secret,x-kirapay-signature,x-organizer-passcode",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function mapOrder(order: OrderRow) {
  return {
    id: order.id,
    eventId: order.event_id,
    buyerEmail: order.buyer_email,
    buyerWallet: order.buyer_wallet,
    ticketType: order.ticket_type,
    amount: order.amount,
    totalAmount: order.total_amount || order.amount,
    addOns: parseOrderAddOns(order.add_ons),
    currency: order.currency,
    status: order.status,
    customOrderId: order.custom_order_id,
    kirapayCheckoutUrl: order.kirapay_checkout_url,
    kirapayLinkCode: order.kirapay_link_code,
    kirapayPaymentLinkId: order.kirapay_payment_link_id,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
}

function mapTicketPayload(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    buyerEmail: String(row.buyer_email),
    ticketType: String(row.ticket_type),
    ticketCode: String(row.ticket_code),
    qrUrl: String(row.qr_url),
    status: String(row.status),
    checkedIn: Boolean(row.checked_in),
    checkedInAt: row.checked_in_at ? String(row.checked_in_at) : null,
    createdAt: String(row.created_at),
    event: {
      title: String(row.title),
      date: String(row.date),
      location: String(row.location)
    },
    order: {
      id: String(row.order_id_joined ?? row.order_id),
      amount: Number(row.amount),
      currency: String(row.currency),
      status: String(row.order_status)
    }
  };
}

function mapAttendeeRow(row: Record<string, unknown>) {
  const order = mapOrder({
    id: String(row.id),
    event_id: String(row.event_id),
    buyer_email: String(row.buyer_email),
    buyer_wallet: stringOrNull(row.buyer_wallet),
    ticket_type: String(row.ticket_type) as TicketType,
    amount: Number(row.amount),
    total_amount: Number(row.total_amount || row.amount),
    add_ons: String(row.add_ons ?? "[]"),
    currency: String(row.currency),
    status: String(row.status) as OrderStatus,
    custom_order_id: String(row.custom_order_id),
    kirapay_checkout_url: stringOrNull(row.kirapay_checkout_url),
    kirapay_link_code: stringOrNull(row.kirapay_link_code),
    kirapay_payment_link_id: stringOrNull(row.kirapay_payment_link_id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  });

  const event = {
    id: String(row.event_id_joined),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description),
    date: String(row.date),
    location: String(row.location),
    imageUrl: stringOrNull(row.image_url),
    generalPrice: Number(row.general_price),
    vipPrice: Number(row.vip_price),
    createdAt: String(row.event_created_at),
    updatedAt: String(row.event_updated_at)
  };

  const ticket = row.ticket_id
    ? {
        id: String(row.ticket_id),
        orderId: order.id,
        eventId: order.eventId,
        buyerEmail: order.buyerEmail,
        ticketType: order.ticketType,
        ticketCode: String(row.ticket_code),
        qrUrl: String(row.qr_url),
        status: String(row.ticket_status) as TicketStatus,
        checkedIn: Boolean(row.checked_in),
        checkedInAt: stringOrNull(row.checked_in_at),
        createdAt: String(row.ticket_created_at),
        updatedAt: String(row.ticket_updated_at)
      }
    : null;

  const transaction = row.transaction_id
    ? {
        id: String(row.transaction_id),
        orderId: order.id,
        kirapayTransactionId: stringOrNull(row.kirapay_transaction_id),
        hash: stringOrNull(row.hash),
        status: String(row.transaction_status),
        price: numberOrNull(row.price),
        settlementAmount: numberOrNull(row.settlement_amount),
        sender: stringOrNull(row.sender),
        recipient: stringOrNull(row.recipient),
        rawPayload: parseMaybeJson(row.raw_payload),
        createdAt: String(row.transaction_created_at)
      }
    : null;

  return { order, event, ticket, transaction };
}

function mapWebhookEvent(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    eventType: String(row.event_type),
    orderId: stringOrNull(row.order_id),
    kirapayTransactionId: stringOrNull(row.kirapay_transaction_id),
    rawPayload: parseMaybeJson(row.raw_payload),
    processed: Boolean(row.processed),
    processedAt: stringOrNull(row.processed_at),
    processingError: stringOrNull(row.processing_error),
    createdAt: String(row.created_at)
  };
}

function getTicketPrice(event: EventRow, ticketType: TicketType) {
  return ticketType === "vip" ? Number(event.vip_price) : Number(event.general_price);
}

function getTicketLabel(ticketType: TicketType) {
  return ticketType === "vip" ? "VIP Builder Pass" : "General Pass";
}

const addOnCatalog: Record<AddOnId, OrderAddOn> = {
  livestream_replay: { id: "livestream_replay", label: "Livestream replay access", amount: 5 },
  priority_checkin: { id: "priority_checkin", label: "Priority check-in", amount: 8 },
  sponsor_networking: { id: "sponsor_networking", label: "Sponsor networking list", amount: 10 }
};

function getAddOns(addOnIds: AddOnId[]) {
  return [...new Set(addOnIds)].map((addOnId) => addOnCatalog[addOnId]);
}

function parseOrderAddOns(value: string) {
  const parsed = parseMaybeJson(value);
  return Array.isArray(parsed) ? parsed : [];
}

async function findOrderForWebhook(data: Record<string, unknown>, env: Env) {
  const orderRef =
    firstString(data, ["customOrderId", "custom_order_id", "orderId", "order_id", "merchantOrderId", "merchant_order_id"]) ??
    nestedString(data, ["metadata", "customOrderId"]) ??
    nestedString(data, ["metadata", "orderId"]) ??
    nestedString(data, ["paymentLink", "customOrderId"]);

  if (orderRef) {
    const order = (await getOrderByCustomOrderId(orderRef, env)) ?? (await getOrderById(orderRef, env));
    if (order) return order;
  }

  const paymentLinkId =
    firstString(data, ["paymentLinkId", "payment_link_id", "payment_link", "linkId", "link_id"]) ??
    nestedString(data, ["paymentLink", "id"]) ??
    nestedString(data, ["paymentLink", "_id"]) ??
    nestedString(data, ["link", "id"]) ??
    nestedString(data, ["link", "_id"]);

  const linkCode =
    firstString(data, ["linkCode", "link_code", "paymentLinkCode", "payment_link_code", "code"]) ??
    nestedString(data, ["paymentLink", "code"]) ??
    nestedString(data, ["link", "code"]);

  return getOrderByKiraPayLink(paymentLinkId, linkCode, env);
}

async function markWebhookFailed(webhookId: string, reason: string, env: Env, orderId?: string) {
  await env.DB.prepare("UPDATE webhook_events SET order_id = ?, processing_error = ? WHERE id = ?")
    .bind(orderId ?? null, reason, webhookId)
    .run();
}

function isSuccessStatus(status: string | null) {
  if (!status) return true;
  return ["success", "succeeded", "paid", "confirmed", "complete", "completed"].includes(status.toLowerCase());
}

function normalizeKiraPayLinkPayload(payload: { data?: Record<string, unknown>; url?: string; checkoutUrl?: string } | null) {
  const data = payload?.data ?? {};
  return {
    url:
      stringOrNull(data.url) ??
      stringOrNull(data.checkoutUrl) ??
      stringOrNull(data.checkout_url) ??
      stringOrNull(data.link) ??
      stringOrNull(payload?.url) ??
      stringOrNull(payload?.checkoutUrl) ??
      "",
    price: data.price,
    originalPrice: data.originalPrice ?? data.original_price,
    code: stringOrNull(data.code) ?? stringOrNull(data.linkCode) ?? stringOrNull(data.link_code) ?? undefined,
    id: stringOrNull(data.id) ?? undefined,
    _id: stringOrNull(data._id) ?? undefined,
    raw: payload
  };
}

function kiraPayApiUrl(env: Env, path: string) {
  const base = trimSlash(env.KIRAPAY_BASE_URL ?? KIRAPAY_BASE_URL);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function isOrganizerAuthorized(request: Request, env: Env) {
  if (!env.ORGANIZER_PASSCODE) return true;
  const url = new URL(request.url);
  const supplied =
    request.headers.get("x-organizer-passcode") ??
    url.searchParams.get("passcode") ??
    bearerToken(request.headers.get("authorization"));
  return Boolean(supplied && timingSafeEqual(supplied, env.ORGANIZER_PASSCODE));
}

function bearerToken(value: string | null) {
  return value?.startsWith("Bearer ") ? value.slice("Bearer ".length) : null;
}

function firstString(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = stringOrNull(data[key]);
    if (value) return value;
  }
  return null;
}

function nestedString(data: Record<string, unknown>, path: string[]) {
  let current: unknown = data;
  for (const part of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[part];
  }
  return stringOrNull(current);
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 20)}`;
}

function createTicketCode() {
  return `KP-${randomHex(6).toUpperCase()}`;
}

function randomHex(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

function isoNow() {
  return new Date().toISOString();
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name}_REQUIRED`);
  return value;
}

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberOrNull(value: unknown) {
  return typeof value === "number" ? value : value === null || value === undefined ? null : Number(value);
}

function parseMaybeJson(value: unknown) {
  if (typeof value !== "string") return value ?? null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}
