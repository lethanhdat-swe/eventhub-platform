/*
  Warnings:

  - The values [ORDER_PAID] on the enum `notifications_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `notifications` MODIFY `type` ENUM('USER_REGISTERED', 'ORDER_CREATED', 'PAYMENT_CREATED', 'CONTACT_CREATED', 'CHECKIN_CREATED') NOT NULL;
