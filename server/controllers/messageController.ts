import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Retrieves the last 10 minutes of messages for a specified room with oldest messages at the top
 *
 * @param roomId
 */
export const getRoomMesages = async (roomId) => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const messages = await prisma.room.findMany({
      where: {
        id: roomId,
        createdAt: {
          gte: tenMinutesAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return messages;
  } catch (error) {
    console.error("Error retrieving recent messages:", error);
    return { error: "Failed to fetch recent messages." };
  }
};

/**
 * 
 * @param userId
 * @param roomId
 * @param content
 * @param imgUrl
 * @returns
 */
export const createMessage = async (userId, roomId, content, imgUrl) => {
  try {
    // Validate input
    if (!content && !imgUrl) {
      return { error: "Message must contain text or an image." };
    }

    // Check that user exists and is active in the specified room
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeRoomId: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.activeRoomId !== roomId) {
      return { error: "User is not active in this room." };
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        authorId: userId,
        roomId: roomId,
        content: content || null,
        imageUrl: imgUrl || null,
      },
      select: { id: true },
    });

    return { messageId: newMessage.id };
  } catch (error) {
    console.error("Error creating message:", error);
    return { error: "Failed to create message." };
  }
};

/**
 * input: messageID
 * return: 200 or fail
 */
const deleteMessage = () => {};
