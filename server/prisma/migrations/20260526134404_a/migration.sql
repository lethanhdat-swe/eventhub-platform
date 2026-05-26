/*
  Warnings:

  - You are about to drop the column `seatId` on the `event_seats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `event_seats` DROP FOREIGN KEY `event_seats_seatId_fkey`;

-- DropIndex
DROP INDEX `event_seats_seatId_fkey` ON `event_seats`;

-- AlterTable
ALTER TABLE `event_seats` DROP COLUMN `seatId`,
    ADD COLUMN `seat_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `hotline` VARCHAR(191) NULL,
    `support_email` VARCHAR(191) NULL,
    `working_hours` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event_seats` ADD CONSTRAINT `event_seats_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
