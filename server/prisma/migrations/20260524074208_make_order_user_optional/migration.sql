-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
