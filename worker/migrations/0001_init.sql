CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  general_price REAL NOT NULL,
  vip_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_wallet TEXT,
  ticket_type TEXT NOT NULL CHECK(ticket_type IN ('general', 'vip')),
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK(status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  custom_order_id TEXT NOT NULL UNIQUE,
  kirapay_checkout_url TEXT,
  kirapay_link_code TEXT,
  kirapay_payment_link_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  ticket_type TEXT NOT NULL CHECK(ticket_type IN ('general', 'vip')),
  ticket_code TEXT NOT NULL UNIQUE,
  qr_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'used', 'cancelled', 'refunded')) DEFAULT 'active',
  checked_in INTEGER NOT NULL DEFAULT 0,
  checked_in_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(buyer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);

CREATE TABLE IF NOT EXISTS kirapay_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  kirapay_transaction_id TEXT UNIQUE,
  hash TEXT UNIQUE,
  status TEXT NOT NULL,
  price REAL,
  settlement_amount REAL,
  sender TEXT,
  recipient TEXT,
  raw_payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  kirapay_transaction_id TEXT,
  raw_payload TEXT NOT NULL,
  processed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  refund_tx_hash TEXT,
  amount REAL NOT NULL,
  reason TEXT,
  status TEXT NOT NULL CHECK(status IN ('requested', 'succeeded', 'failed')) DEFAULT 'requested',
  raw_payload TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY(order_id) REFERENCES orders(id)
);

INSERT OR IGNORE INTO events (
  id,
  title,
  slug,
  description,
  date,
  location,
  image_url,
  general_price,
  vip_price,
  created_at,
  updated_at
) VALUES (
  'event_frontier_night_2026',
  'Frontier Night 2026',
  'frontier-night',
  'An evening for Solana builders, hackathon teams, crypto founders, and ecosystem partners. Reserve your pass using any supported chain or token through KIRAPAY and receive a QR event pass after payment confirmation.',
  '2026-05-18T19:00:00.000Z',
  'Istanbul, Turkiye',
  NULL,
  15,
  35,
  '2026-05-07T00:00:00.000Z',
  '2026-05-07T00:00:00.000Z'
);
