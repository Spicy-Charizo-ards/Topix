//* websocket client connection module.
//* I built it here so that it can be plugged in wherever it needs to go without messing over someone else's files
//* inside there are notes for what everything is and does

// needs a url, in this case its the local host at 3000 because thats where the backend ws server is listening to.
//! we may have to change this later if we get the app hosted on an aws server.
const wsConnection = new WebSocket('ws://localhost:3000');

//handles websocket connection logic "what is the client sending to the server and how will it handle what it gets back"
function wsClient(){

    //* Websocket commands are methods that you have to define with logic. onopen, onmessage, onclose are a few of the important ones
    //when the connection first opens...
    wsConnection.onopen = () => {
        //prints to browser console letting you know you connected to the server socket
        console.log('client: connection established with server');
    }

    //when a message is recieved from the server...
    wsConnection.onmessage = (msg:MessageEvent) =>{
        //extract the message data from the server message event.
        //* the message can now be rendered on the chat/stored/etc...
        const message = msg.data;
    }
}

//* exporting module for front end component imports
export { wsClient };