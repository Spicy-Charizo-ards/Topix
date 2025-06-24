/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `activeChatRoomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_activeChatRoomId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatRoomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeChatRoomId",
ADD COLUMN     "activeRoomId" INTEGER;

-- DropTable
DROP TABLE "ChatRoom";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "passwordPrompt" TEXT,
    "password" TEXT,
    "description" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeRoomId_fkey" FOREIGN KEY ("activeRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
