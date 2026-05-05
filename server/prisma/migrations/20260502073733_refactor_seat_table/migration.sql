/*
  Warnings:

  - You are about to drop the column `event_id` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_type_id` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `ticket_types` table. All the data in the column will be lost.
  - You are about to drop the column `remaining_quantity` on the `ticket_types` table. All the data in the column will be lost.
  - You are about to drop the column `total_quantity` on the `ticket_types` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `seat_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_type_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the `usertoken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_seat_id]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `default_ticket_type_id` to the `seats` table without a default value. This is not possible if the table is not empty.
  - Made the column `row_label` on table `seats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seat_number` on table `seats` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `event_seat_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `seats` DROP FOREIGN KEY `seats_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `seats` DROP FOREIGN KEY `seats_ticket_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `ticket_types` DROP FOREIGN KEY `ticket_types_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_seat_id_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ticket_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `usertoken` DROP FOREIGN KEY `UserToken_userId_fkey`;

-- DropIndex
DROP INDEX `seats_event_id_fkey` ON `seats`;

-- DropIndex
DROP INDEX `seats_ticket_type_id_fkey` ON `seats`;

-- DropIndex
DROP INDEX `ticket_types_event_id_fkey` ON `ticket_types`;

-- DropIndex
DROP INDEX `tickets_event_id_fkey` ON `tickets`;

-- DropIndex
DROP INDEX `tickets_seat_id_key` ON `tickets`;

-- DropIndex
DROP INDEX `tickets_ticket_type_id_fkey` ON `tickets`;

-- AlterTable
ALTER TABLE `events` MODIFY `description` TEXT NULL,
    MODIFY `content_html` TEXT NULL;

-- AlterTable
ALTER TABLE `seats` DROP COLUMN `event_id`,
    DROP COLUMN `status`,
    DROP COLUMN `ticket_type_id`,
    ADD COLUMN `default_ticket_type_id` VARCHAR(191) NOT NULL,
    MODIFY `row_label` VARCHAR(191) NOT NULL,
    MODIFY `seat_number` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ticket_types` DROP COLUMN `event_id`,
    DROP COLUMN `remaining_quantity`,
    DROP COLUMN `total_quantity`;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `event_id`,
    DROP COLUMN `seat_id`,
    DROP COLUMN `ticket_type_id`,
    ADD COLUMN `event_seat_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `usertoken`;

-- CreateTable
CREATE TABLE `user_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `type` ENUM('VERIFY_EMAIL', 'FORGOT_PASSWORD', 'REFRESH_TOKEN') NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_tokens_token_key`(`token`),
    INDEX `user_tokens_userId_idx`(`userId`),
    INDEX `user_tokens_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_seats` (
    `id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `seat_id` VARCHAR(191) NOT NULL,
    `ticket_type_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',

    UNIQUE INDEX `event_seats_event_id_seat_id_key`(`event_id`, `seat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `tickets_event_seat_id_key` ON `tickets`(`event_seat_id`);

-- AddForeignKey
ALTER TABLE `user_tokens` ADD CONSTRAINT `user_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_default_ticket_type_id_fkey` FOREIGN KEY (`default_ticket_type_id`) REFERENCES `ticket_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_seats` ADD CONSTRAINT `event_seats_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_seats` ADD CONSTRAINT `event_seats_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_seats` ADD CONSTRAINT `event_seats_ticket_type_id_fkey` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_event_seat_id_fkey` FOREIGN KEY (`event_seat_id`) REFERENCES `event_seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
