//* websocket client connection module.
//* I built it here so that it can be plugged in wherever it needs to go without messing over someone else's files
//* inside there are notes for what everything is and does

//TODO: make interfaces for the messages for type safety
interface Payload {
    msgID?: string;
    message?: string;
    user?: string[];
    timestamp?: Date;
    roomName?: string;
}

interface User {
    userID: string;
    userName: string;
}

interface MessageData {
    type: string;
    payload?: Payload;
}

//interfaces for some stuff i need for sending messages to server
interface Message {
    mID: string;
    text: string;
    sender: string;
    timestamp: Date;
    isOwn: boolean;
  }
  
  interface ChatRoom {
    roomID: string;
    name: string;
    messages: Message[];
  }

  
  //handles websocket connection logic "what is the client sending to the server and how will it handle what it gets back"
  function wsClient(userArg: User){
    // needs a url, in this case its the local host at 3000 because thats where the backend ws server is listening to.
    //! we may have to change this later if we get the app hosted on an aws server.
    const wsConnection = new WebSocket('ws://localhost:3000');

    //* Websocket commands are methods that you have to define with logic. onopen, onmessage, onclose are a few of the important ones
    //when the connection first opens...
    

    //*user passed into data to be sent as a message to server
    const { userID, userName } = userArg;
    
    //? more info on how this function is structured below at the sendMsgToServer function...
    wsConnection.onopen = () => {
        //tell server that a new user has connected
        const data = {
            type: 'JOIN_USER',
            payload: {
                userID: userID,
                userName: userName
            }
        }

        //send the data to server
        wsConnection.send(JSON.stringify(data));

        //prints to browser console letting you know you connected to the server socket
        console.log('client: connection established with server');
    }

    //when a message is recieved from the server...
    wsConnection.onmessage = (msg:MessageEvent) =>{
        //extract the message data from the server message event.
        //* the message can now be rendered on the chat/stored/etc...
        const message = msg.data;

        //* the message coming from the server will likely be an object that has been stringified
        // JSON parse the stringified object from the server and destructure to extract the type and payload of the message.
        const { type, payload } = JSON.parse(message);

        //* This is where the redux reducer format comes in. Use a switch statement to sort out what to do with messages from the server.
        //TODO figure out what type of messages we will be sending back and forth from client and server

        switch(type){
            case 'NEW_USER':
                //* logging the message to browser console but this would go in the chat as a server message or something
                console.log('a new user has entered the chat!')
                break;
            case 'NEW_MESSAGE':
                //* logging to browser console but this is a message from another user that got broadcast to the chat room from server.
                console.log(payload.message)
                break;
            default:
                break;
        }
    }
}

//* using this to determine what gets sent to server for chatroom messages
// interface Message {
//     id: string;
//     text: string;
//     sender: string;
//     timestamp: Date;
//     isOwn: boolean;
// }
  
// interface ChatWindowProps {
//     roomName?: string;
//     messages?: Message[];
//     onSendMessage?: (message: string) => void;
// }
  

//* this is to send messages to the server, more than just this type of message can be sent but here is a preliminary one
//msg is the text string the user will send, in this case its empty for now
function sendChatToServer(msg: Message, room: ChatRoom){
    //destructure msg so parts can be sent to the server.
    const { mID, text, sender, timestamp } = msg;
    const { roomID } = room;

    //* this kind of uses redux action formatting, the server will kind of resemble a redux reducer.
    const msgToSend: MessageData = {
        //type is whats happening
        type: 'SEND_CHAT',
        //payload is whats being sent to server. In this case, only the test message string is being sent.
        payload:{
            msgID: mID,
            message: text,
            user: sender,
            timestamp: timestamp,
            roomName: roomID
        }
    }
    //* websockets can only send strings
    // stringify the message. The Server will parse it with JSON.parse()
    wsConnection.send(JSON.stringify(msgToSend));
}

//* exporting module for front end component imports
export { wsClient, sendChatToServer };