import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** SIGN-UP
 * input: name, userName, email, password
 * return: success/fail
 */
export const createUser = () => { }

/** LOGIN
 * input: email or username, password 
 * return: userid, username, cookie?
 */
export const getUser = () => { }
