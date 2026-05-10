ALTER TABLE orders ADD COLUMN add_ons TEXT NOT NULL DEFAULT '[]';
ALTER TABLE orders ADD COLUMN total_amount REAL NOT NULL DEFAULT 0;

UPDATE orders SET total_amount = amount WHERE total_amount = 0;
