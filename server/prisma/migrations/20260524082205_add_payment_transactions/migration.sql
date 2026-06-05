-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `order_code` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `content` TEXT NULL,
    `gateway` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'MATCHED', 'UNMATCHED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transactions_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
