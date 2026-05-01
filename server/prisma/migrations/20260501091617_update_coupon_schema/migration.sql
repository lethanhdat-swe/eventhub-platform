/*
  Warnings:

  - Made the column `discount_percent` on table `coupons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `description` TEXT NULL,
    MODIFY `discount_percent` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `coupon_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
