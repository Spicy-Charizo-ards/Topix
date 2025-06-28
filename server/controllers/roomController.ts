import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 *  Retrieves all active public rooms.
 * @returns - List of all active public rooms
 */
export const getRooms = async (req, res, next) => {
  try {
    // query room table for all active rooms
    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        activeUsers: {
          select: { id: true },
        },
      },
    });

    // flatten object and reassign usercount to length of activeUsers array
    const formattedRooms = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      userCount: room.activeUsers.length,
    }));

    res.locals.rooms = formattedRooms;
    next();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ error: "Could not fetch rooms." });
  }
};

/**
 *  Creates a public room and makes the creator an active user in it.
 * @param userId
 * @param roomName
 * @param roomDescription
 * @returns
 */
export const createRoom = async (req, res, next) => {
  try {
    const { userId, roomName, roomDescription } = req.body;

    // validate user input
    if (!userId || !roomName) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // prevent duplicate active rooms room names
    const existingRoom = await prisma.room.findFirst({
      where: {
        name: roomName,
        isActive: true,
      },
    });

    if (existingRoom) {
      return res.status(409).json({ error: "A room with that name already exists" });
    }

    // create new room using user inputs
    const newRoom = await prisma.room.create({
      data: {
        creatorId: userId,
        name: roomName,
        description: roomDescription || null,
        isPrivate: false,
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

    res.locals.createdRoom = newRoom;

    // return roomId
    return next()
  } catch (error) {
    console.error("Error creating public room:", error);
    return next(error);
  }
};
