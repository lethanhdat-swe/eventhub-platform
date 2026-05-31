-- CreateTable
CREATE TABLE `event_reminder_logs` (
    `id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `event_reminder_logs_event_id_idx`(`event_id`),
    INDEX `event_reminder_logs_user_id_idx`(`user_id`),
    INDEX `event_reminder_logs_sent_at_idx`(`sent_at`),
    UNIQUE INDEX `event_reminder_logs_event_id_user_id_key`(`event_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event_reminder_logs` ADD CONSTRAINT `event_reminder_logs_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_reminder_logs` ADD CONSTRAINT `event_reminder_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
