-- DropForeignKey
ALTER TABLE `usertoken` DROP FOREIGN KEY `UserToken_userId_fkey`;

-- AddForeignKey
ALTER TABLE `UserToken` ADD CONSTRAINT `UserToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
