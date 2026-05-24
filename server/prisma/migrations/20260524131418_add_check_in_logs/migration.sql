-- CreateTable
CREATE TABLE `check_in_logs` (
    `id` VARCHAR(191) NOT NULL,
    `ticket_id` VARCHAR(191) NULL,
    `token` TEXT NOT NULL,
    `status` ENUM('VALID', 'DUPLICATE', 'INVALID') NOT NULL,
    `message` VARCHAR(191) NULL,
    `scanned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `check_in_logs_ticket_id_idx`(`ticket_id`),
    INDEX `check_in_logs_status_idx`(`status`),
    INDEX `check_in_logs_scanned_at_idx`(`scanned_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `check_in_logs` ADD CONSTRAINT `check_in_logs_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
