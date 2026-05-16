-- CreateTable
CREATE TABLE `order_seats` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `event_seat_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `order_seats_order_id_event_seat_id_key`(`order_id`, `event_seat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_seats` ADD CONSTRAINT `order_seats_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_seats` ADD CONSTRAINT `order_seats_event_seat_id_fkey` FOREIGN KEY (`event_seat_id`) REFERENCES `event_seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
