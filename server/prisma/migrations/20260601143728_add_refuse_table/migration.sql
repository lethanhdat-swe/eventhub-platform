-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `refund_requests` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,
    `customer_phone` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NOT NULL,
    `bank_account_number` VARCHAR(191) NOT NULL,
    `bank_account_holder` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `refund_percent` INTEGER NOT NULL,
    `refund_amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `refund_requests_order_id_idx`(`order_id`),
    INDEX `refund_requests_user_id_idx`(`user_id`),
    INDEX `refund_requests_status_idx`(`status`),
    INDEX `refund_requests_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refund_requests` ADD CONSTRAINT `refund_requests_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund_requests` ADD CONSTRAINT `refund_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
