import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// api router v
// import apiRouter from './routes/apiRouter';
import cookieParser from 'cookie-parser';
import { WebSocket, WebSocketServer } from 'ws';

//* creating http server from express for the websocket
import http from 'http';

// import db functions
import {createUser} from "./controllers/authController.ts"
import {createRoom} from "./controllers/roomController.ts"
import {createMessage} from "./controllers/messageController.ts"

//TODO these need to be changed to es import format.
// const cookieParser = require('cookie-parser');



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//* Pass app into server constructor
const server = http.createServer(app);

// * CORS
app.use(cors());

//parse json from incoming request
app.use(express.json());

//serve index through main folder
app.use(express.static(path.resolve(__dirname, '../src')));

//link router
//app.use()

//* Websocket Server stuff

//* attach express server to websocket
const wsServer = new WebSocketServer({ server: server });

//TODO websocket logic goes here

//* Basically the server is just rerouting messages from the client back to the appropriate clients. (the ones in the chatrooms that messages go to)

//when a new connection is made to the server...
wsServer.on('connection', (ws) => {

    //TODO: assign the current ws socket an id. probably from the DB to identify connections. The clients might send this information after authenticating
    // i.e: wd.id = some data pulled from the 'NEW_USER' message from client

    //**TODO: put the user in a chatroom. The client sends messages with target chatroom in them to server
    //TODO: the chatroom is a map or a set that holds all users inside

    //print to console when connection is made
    console.log('server: client connected to server!')

    //console log error if there is an error connecting
    ws.on('error', console.error);

    //after receiving a message from client route it back to everyone exept the sender
    ws.on('message', async function incoming(data){
        //for each client connected to the server socket, broadcast the recieved message to them all
        broadcastMsg(data, ws)

        //TODO: BIG switch statement here that controls what happens with user messages. all the db queries for user and room info go here too.
        //some of these might end up being routes instead.
        switch(type){
            case 'NEW_USER':
              await createUser(name, email, username, password)
                 break;
            case 'JOIN_USER':
                //add user to a chat in db
                //assign some sort of id to the client socket
                break;
            case 'SEND_CHAT':
                //add chat to db and broadcast to members of that chat
                await createMessage(userId, roomId, content, imgUrl)
                break;
            case 'CREATE_ROOM':
                //add room to DB
                await createRoom(userId, roomName, roomDescription)
                break;
            default:
                break;
        }
    });

    // //send something to the client just because
    // // ws.send('hello from the server');
});

//*This just broadcasts to each user barring a specified socket which is supposed to be the user who sent the message in the first place.
//may need to be changed at some point.
function broadcastMsg(data, ignoredSocket){
    wsServer.clients.forEach((client)=>{
        //as long as the socket is connected (its readyState is OPEN) AND it is not the socket that sent the message (ignoredSocket), send the message back to the other clients
        if(ws.readyState === WebSocket.OPEN && client !== ignoredSocket){
            client.send(data);
        }
    })     

}

app.use('/test', async (req, res) => {
  const mockUser = {
    email: "frank.reynolds@paddys.com",
    username: "frank",
    name: "Frank Reynolds",
    password: "trolltoll",
  }

  const mockRoom = {
    name: "Paddy's Pub",
    description: "The official chat room of the Gang. Expect chaos.",
    creatorId: 1,
  };

  const mockMessage =   {
    authorId: 1,
    content: "Can I offer you an egg in this trying time?",
    roomId: 1,
}

  // const createdUser = await createUser(mockUser.name, mockUser.email, mockUser.username, mockUser.password)
  // console.log({createdUser})
  // return res.send({data: createdUser})
  
  // const createdRoom = await createRoom(1, mockRoom.name, mockRoom.description)
  // console.log(createdRoom)
  // return res.send({data: createdRoom})
  
  const createdMessage = await createMessage(1, 1, mockMessage.content)
  console.log(createdMessage)
  return res.send({data: createdMessage})
})

//! add catch all error handler for incorrect routes
app.use((req, res) => res.status(404).send('This is not the page you\re looking for.'))



//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// server listens for the ports now, app is included in this too
server.listen(3000, ()=>console.log('server listening on port 3000'));