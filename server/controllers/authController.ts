import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

/**
 * Creates a new user on sign-up
 * @param email
 * @param username
 * @param password
 * @returns
 */
export const createUser = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    // check for existing user with the same email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User is already registered" };
    }

    const hashPassword = await bcrypt.hash(password, 10); // 10 = salt rounds


    // create new user from param values
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashPassword
      },
    });

    // return new user
    return { user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Something went wrong while creating user." };
  }
};

/**
 * Queries database for user using username and password
 * @param username 
 * @param password 
 * @returns 
 */
export const getUser = async (username, password) => {
  try {
    // check user table for matching user 
    const user = await prisma.user.findUnique({
      //*This now checks for email because, though username is on the schema, prisma's findUnique method doesnt allow for us to use username, it requires id or email to be used.
      where: { email: username },
    });

    if (!user) {
        return {error: "Invalid entry"}
    }

    // compare input password to database password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return {error: 'Invalid password'}
    }

    // return select user info
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      };

  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed due to server error." };
  }
};
