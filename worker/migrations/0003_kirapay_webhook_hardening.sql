ALTER TABLE webhook_events ADD COLUMN order_id TEXT;
ALTER TABLE webhook_events ADD COLUMN processed_at TEXT;
ALTER TABLE webhook_events ADD COLUMN processing_error TEXT;

CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_order ON webhook_events(order_id);
