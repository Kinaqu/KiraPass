# KiraPass

## What it is
KiraPass turns an existing event landing page into cross-chain ticketing powered by KIRAPAY.

The frontend is a Next.js app for Vercel. The backend is a Cloudflare Worker backed by D1. KIRAPAY keys, payment-link creation, webhooks, ticket issuance, verification, organizer data, and refunds all live on Cloudflare.

## Problem
Event organizers lose crypto-native buyers because attendees hold funds across many chains and tokens. Manual payment checks are slow, error-prone, and hard to scale at the door.

## Solution
KiraPass adds a KIRAPAY checkout layer to event pages. KIRAPAY handles cross-chain payment collection and configured settlement, while the Cloudflare Worker handles pending orders, webhook-confirmed ticket issuance, QR passes, and organizer check-in.

## How KIRAPAY is used
1. Vercel frontend calls Cloudflare `POST /api/checkout/create`.
2. Worker writes a pending order to D1.
3. Worker calls KIRAPAY `POST /link/generate` with `customOrderId`, ticket price, settlement token, receiver wallet, and frontend redirect URL.
4. Attendee pays on the hosted KIRAPAY checkout page.
5. KIRAPAY sends `transaction.succeeded` to Cloudflare `POST /api/webhooks/kirapay`.
6. Worker verifies the webhook, marks the order paid, stores the transaction, and creates one QR ticket.
7. Organizer verifies and checks in the ticket through Cloudflare `POST /api/tickets/verify`.

## Demo flow
1. Open `/events/frontier-night` on the Vercel frontend.
2. Choose General Pass or VIP Builder Pass.
3. Enter an email and click **Buy with KIRAPAY**.
4. The frontend calls the Cloudflare Worker, which creates the D1 order and KIRAPAY checkout link.
5. After KIRAPAY webhook confirmation, open `/checkout/success?orderId=...`.
6. View the QR ticket.
7. Open `/organizer` to see paid attendees from D1.
8. Scan or open `/verify/[ticketCode]` and check in the attendee.

## Architecture
- **Frontend:** Next.js App Router on Vercel.
- **Backend:** Cloudflare Worker in `worker/src/index.ts`.
- **Database:** Cloudflare D1 with migrations in `worker/migrations`.
- **Frontend/backend boundary:** browser calls `NEXT_PUBLIC_KIRAPASS_API_URL`.
- **Secrets:** KIRAPAY and organizer secrets are Worker vars/secrets only.
- **Ticket storage:** D1-backed QR tickets; future Solana NFT/compressed NFT minting can be added after payment confirmation.

## KIRAPAY routes used
- `POST /link/generate`: create single-use checkout links.
- `POST /api/webhooks/kirapay`: Cloudflare webhook receiver for KIRAPAY lifecycle events.
- `POST /wallet/transactions/refund`: optional Cloudflare `/api/refund` route.
- Wallet transaction APIs can be added later for reconciliation/reporting.

## Environment variables
### Vercel frontend
```bash
NEXT_PUBLIC_KIRAPASS_API_URL=https://kirapass-api.<your-subdomain>.workers.dev
```

### Cloudflare Worker vars/secrets
```bash
FRONTEND_URL=https://your-vercel-app.vercel.app
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
KIRAPAY_BASE_URL=https://api.kira-pay.com/api
KIRAPAY_API_KEY=...
KIRAPAY_WEBHOOK_SECRET=...
MERCHANT_WALLET_ADDRESS=...
SETTLEMENT_CHAIN_ID=...
SETTLEMENT_TOKEN_ADDRESS=...
ORGANIZER_PASSCODE=...
KIRAPAY_MOCK_MODE=false
ENVIRONMENT=production
```

Use `wrangler secret put KIRAPAY_API_KEY`, `wrangler secret put KIRAPAY_WEBHOOK_SECRET`, and `wrangler secret put ORGANIZER_PASSCODE` for sensitive values.

## Local setup
Install dependencies:

```bash
npm install
```

Create a D1 database and paste its `database_id` into `worker/wrangler.toml`:

```bash
npm run d1:create
```

Apply local D1 migrations:

```bash
npm run d1:migrate:local
```

Start the Cloudflare backend:

```bash
npm run dev:worker
```

In another terminal, start the Vercel/Next frontend:

```bash
NEXT_PUBLIC_KIRAPASS_API_URL=http://localhost:8787 npm run dev
```

## Webhook setup
Configure KIRAPAY to send webhooks to:

```text
https://kirapass-api.<your-subdomain>.workers.dev/api/webhooks/kirapay
```

The Worker accepts HMAC SHA-256 via `x-kirapay-signature` and a secret-header fallback via `x-webhook-secret` or `Authorization: Bearer ...`.

Sample local webhook:

```bash
curl -X POST http://localhost:8787/api/webhooks/kirapay \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $KIRAPAY_WEBHOOK_SECRET" \
  -d '{
    "event": "transaction.succeeded",
    "data": {
      "id": "tx_demo_1",
      "status": "Success",
      "hash": "0xabc",
      "price": 15,
      "settlementAmount": 15,
      "customOrderId": "order_replace_me"
    }
  }'
```

## Cloudflare deployment
### GitHub Actions deployment
The repository includes `.github/workflows/deploy-cloudflare-worker.yml`. Add these GitHub repository secrets before running it:

```bash
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

The workflow applies D1 migrations and deploys `worker/src/index.ts` to Cloudflare.

### Manual deployment
Apply remote D1 migrations:

```bash
npm run d1:migrate:remote
```

Deploy the Worker:

```bash
npm run deploy:worker
```

Set the Vercel environment variable:

```bash
NEXT_PUBLIC_KIRAPASS_API_URL=https://kirapass-api.<your-subdomain>.workers.dev
```

## Limitations
- No seat maps, resale, marketplace, NFT minting, or full organizer authentication.
- Local D1 data is stored by Wrangler and is separate from remote D1.
- Real production should lock `FRONTEND_ORIGIN` to the Vercel domain and set `KIRAPAY_MOCK_MODE=false`.

## Future improvements
- Solana compressed NFT ticket mint after confirmed KIRAPAY payment.
- KIRAPAY transaction reconciliation dashboard using wallet transaction APIs.
- Refund controls with stronger organizer auth and audit trail.
- Multi-event organizer onboarding.

## Demo video script
1. Event organizers lose crypto buyers because users hold funds across many chains.
2. KiraPass adds KIRAPAY-powered cross-chain checkout to any event landing page.
3. The demo event is Frontier Night 2026, a Solana builder side event.
4. The attendee selects General or VIP and pays with KIRAPAY.
5. KIRAPAY confirms the transaction through a webhook to Cloudflare.
6. Cloudflare Worker writes the paid order and QR ticket to D1.
7. The Vercel frontend shows the issued QR ticket.
8. The organizer dashboard reads attendees from D1.
9. At the door, staff scan the QR and check in the attendee through the Worker.
10. KIRAPAY is central: payment link, hosted checkout, webhook confirmation, transaction status, and optional refund infrastructure.
