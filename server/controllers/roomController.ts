import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 *  Retrieves all active public rooms.
 * @returns - List of all active public rooms
 */
export const getRooms = async () => {
  try {
    // query room table for all active rooms
    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        activeUsers: {
          select: { id: true },
        },
      },
    });

    // flatten object and reassign usercount to length of activeUsers array
    const formattedData = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      userCount: room.activeUsers.length,
    }));

    return { rooms: formattedData };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { error: "Could not fetch rooms." };
  }
};

/**
 *  Creates a public room and makes the creator an active user in it.
 * @param userId
 * @param roomName
 * @param roomDescription
 * @returns
 */
export const createRoom = async (
  userId,
  roomName,
  roomDescription = null
  // isPrivate,
  // passwordPrompt,
  // password
) => {
  try {
    // validate user input
    if (!userId || !roomName) {
      return { error: "Missing required fields." };
    }

    // prevent duplicate active rooms room names
    const existingRoom = await prisma.room.findFirst({
      where: {
        name: roomName,
        isActive: true,
      },
    });
    if (existingRoom) {
      return { error: "A room with that name already exists" };
    }

    // create new room using user inputs
    const newRoom = await prisma.room.create({
      data: {
        creatorId: userId,
        name: roomName,
        description: roomDescription,
        private: false,
      },
      select: {
        id: true,
      },
    });

    // Update user to join this room
    await prisma.user.update({
      where: { id: userId },
      data: {
        activeRoomId: newRoom.id,
      },
    });

    // return roomId
    return { roomId: newRoom.id };
  } catch (error) {
    console.error("Error creating public room:", error);
    return { error: "Could not create room." };
  }
};
