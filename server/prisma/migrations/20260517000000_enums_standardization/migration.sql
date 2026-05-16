-- Data normalization (columns still VARCHAR)
UPDATE `users` SET `role` = 'USER' WHERE LOWER(`role`) = 'user';
UPDATE `users` SET `role` = 'ADMIN' WHERE LOWER(`role`) = 'admin';

UPDATE `events` SET `status` = 'DRAFT' WHERE LOWER(TRIM(`status`)) = 'draft';
UPDATE `events` SET `status` = 'PUBLISHED' WHERE LOWER(TRIM(`status`)) IN ('published', 'active');
UPDATE `events` SET `status` = 'CANCELLED' WHERE LOWER(TRIM(`status`)) IN ('cancelled', 'canceled');

UPDATE `events` SET `status` = 'DRAFT' WHERE `status` NOT IN ('DRAFT', 'PUBLISHED', 'CANCELLED');

UPDATE `event_seats` SET `status` = UPPER(TRIM(`status`));
UPDATE `event_seats` SET `status` = 'AVAILABLE' WHERE `status` NOT IN ('AVAILABLE', 'PENDING', 'RESERVING', 'BOOKED', 'DISABLED');

UPDATE `orders` SET `status` = 'PENDING' WHERE LOWER(`status`) = 'pending';
UPDATE `orders` SET `status` = 'PAID' WHERE LOWER(`status`) IN ('paid', 'success') OR `status` = 'SUCCESS';
UPDATE `orders` SET `status` = 'CANCELLED' WHERE LOWER(`status`) IN ('cancelled', 'canceled', 'failed', 'refunded');

UPDATE `orders` SET `status` = 'PENDING' WHERE `status` NOT IN ('PENDING', 'PAID', 'CANCELLED');

UPDATE `orders` SET `payment_method` = 'SEPAY' WHERE `payment_method` IS NULL OR LOWER(`payment_method`) = 'sepay';

-- Native MySQL ENUM columns
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
ALTER TABLE `events` MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT';
ALTER TABLE `event_seats` MODIFY `status` ENUM('AVAILABLE', 'PENDING', 'RESERVING', 'BOOKED', 'DISABLED') NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `orders` MODIFY `payment_method` ENUM('SEPAY') NOT NULL DEFAULT 'SEPAY';
