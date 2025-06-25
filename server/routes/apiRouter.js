import express from 'express';
import { getRoomMesages } from '../controllers/messageController.ts';

const apiRouter = express.Router();

// get request that (endpoint, controller)
apiRouter.get('/getMessages', getRoomMesages, (req,res) => {
    return res.status(200).json(res.locals.messages);
});


export default apiRouter;