-- AlterTable
ALTER TABLE `comments` ADD COLUMN `is_edited` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `root_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `comments_root_id_idx` ON `comments`(`root_id`);
