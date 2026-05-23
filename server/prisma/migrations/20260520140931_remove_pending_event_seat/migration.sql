/*
  Warnings:

  - The values [PENDING] on the enum `event_seats_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `event_seats` MODIFY `status` ENUM('AVAILABLE', 'RESERVING', 'BOOKED', 'DISABLED') NOT NULL DEFAULT 'AVAILABLE';
