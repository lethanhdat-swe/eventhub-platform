-- AlterTable
ALTER TABLE `chat_messages` MODIFY `role` ENUM('USER', 'ASSISTANT', 'SYSTEM', 'ADMIN') NOT NULL;

-- CreateIndex
CREATE INDEX `chat_sessions_status_idx` ON `chat_sessions`(`status`);
