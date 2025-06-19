import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** 
 * input: userId, roomId, content (text or emoji or image)
 * return: messageID
 */
const createMessage = () => {}

/** 
 * input: messageID
 * return: 200 or fail
 */
const deleteMessage = () => {}