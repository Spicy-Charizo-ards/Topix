import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Return array of all active private rooms. each room has id, name, user count
 * OR
 * Return array of all active public rooms. each room has id, name,  user count, password prompt
 */
export const getRooms = (roomType) => {
if (roomType==="private") {
    
}

};

/** 
 * input: userId, roomName, description, isPrivate, password prompt?, password?
 * return: id
*/
export const createRoom = (userId, roomName, roomDescription, isPrivate, passwordPrompt, password) => {
// check that all required values are valid 
// check if room already exists 
// access room table and add room with details 

};
