-- CreateTable
CREATE TABLE `system_jobs` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('SEND_VERIFY_EMAIL', 'SEND_FORGOT_PASSWORD_EMAIL') NOT NULL,
    `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `payload` JSON NULL,
    `log` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `system_jobs_status_idx`(`status`),
    INDEX `system_jobs_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
