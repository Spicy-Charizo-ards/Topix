import { useEffect, useState } from 'react';
import { Chat, Public, Mail } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import ChatWindow from './ChatWindow';
import { wsClient } from '../wsClient';

type TabType = 'private' | 'public' | 'invites';

//TODO: get chat messages from db, then put them in an array with map
//TODO: pass to chatwindow.tsx

//* Websocket wrapper
interface chatClient {
  socket: WebSocket;
  sendChatToServer: (message: Message, room: ChatRoom) => void;
}

interface Message {
  mID?: string | number;
  text: string;
  sender: string | number;
  timestamp: Date;
  imgURL?: string | null;
  isOwn?: boolean;
}

interface ChatRoom {
  roomID: string | number;
  name: string;
  messages: Message[];
}

interface User {
  userID: string | number;
  userName: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('private');
  const [chatClientWS, setChatClientWS] = useState<chatClient>();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [currentMessage, setcurrentMessage] = useState<string>('');
  //*Creating fake user to connect to socket
  const [currentUser, setCurrentUser] = useState<User>({
    userID: Math.random(),
    userName: 'Wenjun',
  });
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      roomID: 1,
      name: 'Charizard',
      messages: [
        {
          // mID: 4,
          text: 'HEY',
          sender: 1,
          timestamp: new Date(Date.now() - 300000),
          imgURL: null,
          isOwn: false,
        },
      ],
    },
  ]);

  const selectedChatRoom = chatRooms.find(
    (chat) => chat.roomID === selectedChat
  );

  //placing this here
  useEffect(() => {
    // const chatWS = wsClient(currentUser);
    // setChatClientWS(chatWS);
  }, [currentUser, selectedChat]);

  // useEffect(() => {
  //   const chatWS = wsClient(currentUser, (incomingMessage: Message) => {
  //     setChatRooms((prevRooms) =>
  //       prevRooms.map((room) =>
  //         room.roomID === selectedChat
  //           ? { ...room, messages: [...room.messages, incomingMessage] }
  //           : room
  //       )
  //     );
  //   });
  //   setChatClientWS(chatWS);
  // }, [currentUser, selectedChat]);

  const handleSendMessage = (messageText: string) => {
    if (!selectedChatRoom) return;

    //* index of sent message SHOULD be what is on the end of the array for chatRooms
    const newMessage: Message = {
      //date time to make mid's unique
      mID: Date.now().toString(),
      text: messageText,
      sender: currentUser.userID,
      timestamp: new Date(),
      isOwn: true,
      imgURL: null,
    };

    //* SENDING MESSAGE TO SERVER USING SEND MESSAGE HANDLER
    chatClientWS?.sendChatToServer(newMessage, selectedChatRoom);

    // Update local state to show the new message immediately
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomID === selectedChatRoom.roomID
          ? { ...room, messages: [...room.messages, newMessage] }
          : room
      )
    );
  };
  //*This is for chatrooms
  // setChatRooms((prev) =>
  //   prev.map((chat) =>
  //     chat.roomID === selectedChat
  //       ? { ...chat, mID: [...chat.messages, newMessage] }
  //       : chat
  //   )
  // );

  async function getMessagesFromDB(){
    console.log('loading messages');
    const url = 'http://localhost:3000/getMessages';

    try{
      const response = await fetch(url);
      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log('res:',json);
    
      //run map
      // setChatRooms(chatRooms)
      
    }catch(err){
      console.log(err.message);
    }
  }

  useEffect(()=>{
    // some function to request messages on load
    // getMessagesFromDB();
  }, []);

  return (
    <div className="w-full min-h-screen">
      <div className="w-full bg-orange-950">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('private')}>
              <Chat />
              Private Chats
            </button>
            <button onClick={() => setActiveTab('public')}>
              <Public />
              Public Chats
            </button>
            <button onClick={() => setActiveTab('invites')}>
              <Mail />
              Invites
            </button>
          </div>
          <div className="flex mr-7">
            <Avatar alt="Profile" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full px-4 py-6">
        {activeTab === 'private' && (
          <div className="w-full bg-white rounded-lg p-6">
            <h2 className="text-lg text-amber-900 font-medium mb-4">
              Your Chats
            </h2>
            <div className="flex h-96">
              {/* Chat List - Left Side */}
              <div className="w-1/4 border-r pr-4">
                <div className="space-y-2">
                  {chatRooms.map((chat) => (
                    <div
                      key={chat.roomID}
                      onClick={() => setSelectedChat(chat.roomID)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedChat === chat.roomID ? 'bg-stone-100' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-500 truncate">
                          {chat.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window - Right Side */}
              <div className="w-3/4 pl-4">
                {selectedChat ? (
                  <ChatWindow
                    roomName={selectedChatRoom?.name || ''}
                    messages={selectedChatRoom?.messages || []}
                    chatrooms={setChatRooms}
                    selectedChat={setSelectedChat}
                    onSendMessage={handleSendMessage}
                    currentMessage={setcurrentMessage}
                    chatClientWS={setChatClientWS}
                    currentUser={setCurrentUser}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Chat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a chat to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'public' && (
          <div className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-lg text-amber-900 font-medium mb-4">
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-amber-900 font-medium">Technology</h3>
                <p className="text-sm text-gray-500">1.2k members</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-amber-900 font-medium">Gaming</h3>
                <p className="text-sm text-gray-500">3.5k members</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-amber-900 font-medium">Music</h3>
                <p className="text-sm text-gray-500">2.8k members</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'invites' && (
          <div className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-lg text-amber-900 font-medium mb-4">
              Chat Invitations
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Avatar className="mr-4" />
                  <div>
                    <h3 className="text-amber-900 font-medium">
                      AI Conventional Commits Dev Tool
                    </h3>
                    <p className="text-sm text-gray-500">Invited by Alicia</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 boarder border-blue-600 text-blue-600 rounded-md">
                    Accept
                  </button>
                  <button className="px-4 py-2 text-neutral-500">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
