//* Websocket wrapper
export interface Message {
  mID?: string | number;
  text: string;
  sender: string | number;
  timestamp: Date;
  imgURL?: string | null;
  isOwn?: boolean;
}

export interface ChatRoom {
  roomID: string | number;
  name: string;
  messages: Message[];
}

// Authentication user interface
export interface AuthUser {
  id: number;
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
