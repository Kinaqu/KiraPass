UPDATE orders
SET kirapay_link_code = REPLACE(kirapay_checkout_url, 'https://checkout.kira-pay.com/', '')
WHERE kirapay_link_code IS NULL
  AND kirapay_checkout_url LIKE 'https://checkout.kira-pay.com/%';

UPDATE orders
SET kirapay_expected_amount = ROUND(total_amount / 1000.0, 6)
WHERE event_id = 'event_frontier_night_2026'
  AND status = 'pending';
