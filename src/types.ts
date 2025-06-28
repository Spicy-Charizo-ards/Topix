//* Websocket wrapper
export interface Message {
  mID?: string | number;
  text: string;
  sender: string | number | undefined;
  timestamp: Date;
  imgURL?: string | null;
  isOwn?: boolean;
}

export interface MessageData {
    type: string;
    payload?: Payload;
}


export interface ChatRoom {
  roomID: string | number;
  name: string;
  messages: Message[];
}

// Authentication user interface
export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  username: string;
}

//user for websocket connection
export interface User {
  userID: string | number;
  userName: string;
}

//* Websocket wrapper
export interface chatClient {
  socket: WebSocket;
  ononMessageReceived?: (message: Message) => void;
  sendChatToServer: (message: Message, room: ChatRoom) => void;
}

export interface Payload {
    msgID?: string | number;
    message?: string;
    user?: string | number;
    timestamp?: Date;
    imgURL: string | null | undefined;
    roomName?: string | number;
}