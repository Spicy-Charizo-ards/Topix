import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Retrieves the last 10 minutes of messages for a specified room with oldest messages at the top
 *
 * @param roomId
 */
export const getRoomMesages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const room = await prisma.room.findUnique({
      where: {
        id: Number(roomId),
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        messages: {
          // where: {
          //   createdAt: {
          //     gte: tenMinutesAgo,
          //   },
          // },
          orderBy: {
            createdAt: "asc",
          },
        },
        activeUsers: {
          select: {
            id: true,
            username: true
          }
        }, 

      },
  });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
console.log("ROOM", room)
    res.locals.roomMessages = room

    next()

  } catch (error) {
    console.error("Error retrieving recent messages:", error);
    return res.status(500).json({ error: "Failed to fetch recent messages." });
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
