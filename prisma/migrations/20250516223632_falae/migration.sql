/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `imgAvatar` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- DropIndex
DROP INDEX `user_id_key` ON `user`;

-- CreateTable
CREATE TABLE `chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `SentChatId` INTEGER NOT NULL,
    `ReceivedChatId` INTEGER NOT NULL,

    UNIQUE INDEX `chat_SentChatId_ReceivedChatId_key`(`SentChatId`, `ReceivedChatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chatId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_SentChatId_fkey` FOREIGN KEY (`SentChatId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_ReceivedChatId_fkey` FOREIGN KEY (`ReceivedChatId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
