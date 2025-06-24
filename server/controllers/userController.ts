import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * RELATIONSHIPS:
 * - One user can be active in zero or one chat room (activeChatRoom)
 * - One user can create multiple chat rooms (createdChatRooms)
 * - One user can send multiple messages (messages)
 * LOGIC
 * - User must have unique email address
 * - User can only be active in one room at a time
 * - When user joins a new room, they automatically leave their current room
 * - User who creates a room becomes the room creator/admin
 */



/**
 * 
 */
export const sendInvite = () => { }


/**
 * input: , userId, roomId, password?
 * Return: creator, activeUsers, messages
 */
export const enterRoom = () => { };

/**
 * input: userId, roomId
 * Return: true
 */
export const exitRoom = () => {};
