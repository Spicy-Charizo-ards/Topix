import express from 'express';
import { getRooms, createRoom } from '../controllers/roomController.ts';
import { getRoomMesages } from '../controllers/messageController.ts';

const apiRouter = express.Router();

// get request that (endpoint, controller)


// GET PUBLIC ROOMS - RETURN LIST OF ALL ROOMS
apiRouter.get('/rooms', getRooms, (req,res) => {
    return res.status(200).json({rooms: res.locals.rooms});
});

// CREATE A ROOM
apiRouter.post('/rooms', createRoom, (req, res)=> {
    return res.status(201).json({room: res.locals.room});

});

// GET ROOM DETAILS AND  MESSAGES 
apiRouter.get('/rooms/:roomId', getRoomMesages, (req,res) => {
    return res.status(200).json({room: res.locals.roomMessages});
});





export default apiRouter;