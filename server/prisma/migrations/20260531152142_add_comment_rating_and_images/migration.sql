-- AlterTable
ALTER TABLE `comments` ADD COLUMN `image_urls` TEXT NULL,
    ADD COLUMN `rating` INTEGER NULL;

-- CreateIndex
CREATE INDEX `comments_rating_idx` ON `comments`(`rating`);
