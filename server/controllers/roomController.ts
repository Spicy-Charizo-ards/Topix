import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Return array of all active private rooms. each room has id, name, user count
 * OR
 * Return array of all active public rooms. each room has id, name,  user count, password prompt
 */
export const getRooms = () => {};

/** */
export const createRoom = () => {};
