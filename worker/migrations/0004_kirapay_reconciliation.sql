ALTER TABLE orders ADD COLUMN kirapay_expected_amount REAL;

UPDATE orders
SET kirapay_expected_amount = CASE
  WHEN event_id = 'event_frontier_night_2026' THEN ROUND(total_amount / 1000.0, 2)
  ELSE total_amount
END
WHERE kirapay_expected_amount IS NULL;

CREATE INDEX IF NOT EXISTS idx_orders_kirapay_payment_link_id ON orders(kirapay_payment_link_id);
CREATE INDEX IF NOT EXISTS idx_orders_kirapay_link_code ON orders(kirapay_link_code);
