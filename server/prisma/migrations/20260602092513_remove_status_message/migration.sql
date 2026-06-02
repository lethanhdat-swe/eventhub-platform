/*
  Warnings:

  - You are about to drop the column `status` on the `chat_sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `chat_sessions_status_idx` ON `chat_sessions`;

-- AlterTable
ALTER TABLE `chat_sessions` DROP COLUMN `status`;
