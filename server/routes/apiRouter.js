import express from 'express';
import { getRoomMesages } from '../controllers/messageController.ts';
import { createUser, getUser } from '../controllers/authController.ts';

const apiRouter = express.Router();

// get request that (endpoint, controller)
apiRouter.get('/getMessages', getRoomMesages, (req, res) => {
  return res.status(200).json(res.locals.messages);
});

// Authentication routes
apiRouter.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await createUser(name, email, username, password);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({ user: result.user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    const result = await getUser(username, password);

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    return res.status(200).json({ user: result });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default apiRouter;
