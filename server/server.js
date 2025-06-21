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
    //print to console when connection is made
    console.log('server: client connected to server!')

    //console log error if there is an error connecting
    ws.on('error', console.error);

    //after receiving a message from client route it back to everyone exept the sender
    ws.on('message', function incoming(data){
        //for each client connected to the server socket, broadcast the recieved message to them all
        broadcastMsg(data, ws)
    });

    // //send something to the client just because
    // // ws.send('hello from the server');
});

function broadcastMsg(data, ignoredSocket){
    wsServer.clients.forEach((client)=>{
        //as long as the socket is connected (its readyState is OPEN) AND it is not the socket that sent the message (ignoredSocket), send the message back to the other clients
        if(ws.readyState === WebSocket.OPEN && client !== ignoredSocket){
            client.send(data);
        }
    })     

}


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