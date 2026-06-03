-- AlterTable
ALTER TABLE `ai_content_configs` ADD COLUMN `chat_model` VARCHAR(191) NULL,
    ADD COLUMN `chat_system_prompt` TEXT NULL;
