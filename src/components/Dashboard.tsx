/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Chat, Public, Mail } from '@mui/icons-material';
import ChatWindow from './ChatWindow';
import type { Message, ChatRoom, chatClient, AuthUser } from '../types';

type TabType = 'private' | 'public' | 'invites';

interface DashboardProps {
  currentUser: AuthUser;
  onLogout: () => void;
}

//TODO: get chat messages from db, then put them in an array with map
//TODO: pass to chatwindow.tsx

//* A few states are getting pulled up from chatwindow like the current user and the websocket client
const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('private');
  const [chatClientWS, setChatClientWS] = useState<chatClient>();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // const [currentMessage, setcurrentMessage] = useState<string>('');
  // const [currentUser, setCurrentUser] = useState<User>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      roomID: '1',
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

  const handleSendMessage = (messageText: string) => {
    if (!selectedChatRoom) return;

    //* index of sent message SHOULD be what is on the end of the array for chatRooms
    const newMessage: Message = {
      //date time to make mid's unique
      mID: Date.now().toString(),
      text: messageText,
      sender: currentUser.id,
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

  async function getMessagesFromDB(){
    console.log('loading messages');
    const url = 'http://localhost:3000/rooms/1';

    try{
      const response = await fetch(url);
      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      console.log('data:', data);
      return data
      //run map
      
      
    } catch(err: unknown){
      console.log(err);
      throw err
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("FETCHING MESSAGES");
        const messages = await getMessagesFromDB();
        console.log("MESSAGES", messages);
        // Do something with messages here (like setting state)
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
  
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay-200 py-8 px-2 font-mono">
      <div className="w-full max-w-5xl mx-auto">
        {/* Window Frame */}
        <div className="relative rounded-lg border-2 border-clay-700 shadow-[0_8px_32px_0_rgba(110,62,37,0.25)] bg-clay-50 overflow-hidden">
          {/* Title Bar */}
          <div
            className="flex items-center justify-between px-3 py-1 bg-clay-400 border-clay-700 select-none"
            style={{
              fontFamily:
                'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
            }}
          >
            <div className="flex items-center gap-2">
              {/* Window Controls: blue, red, green */}
              <span className="w-3 h-3 rounded-full bg-blue-300 border border-blue-900 shadow-inner inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-red-300 border border-red-900 shadow-inner inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-300 border border-green-900 shadow-inner inline-block"></span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-0 md:p-6 bg-clay-50">
            <div
              className="w-full bg-clay-200 border-b-2 border-clay-400 px-4 py-2 flex items-center justify-between"
              style={{
                fontFamily:
                  'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
              }}
            >
              <div className="flex gap-2 md:gap-4">
                <button
                  onClick={() => setActiveTab('private')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-clay-400 transition-colors ${
                    activeTab === 'private'
                      ? 'bg-clay-100 text-clay-800 border-clay-700 shadow'
                      : 'text-clay-500 hover:bg-clay-100 hover:text-clay-700'
                  }`}
                >
                  <Chat fontSize="small" />
                  <span className="hidden sm:inline">Private Chats</span>
                </button>
                <button
                  onClick={() => setActiveTab('public')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-clay-400 transition-colors ${
                    activeTab === 'public'
                      ? 'bg-clay-100 text-clay-800 border-clay-700 shadow'
                      : 'text-clay-500 hover:bg-clay-100 hover:text-clay-700'
                  }`}
                >
                  <Public fontSize="small" />
                  <span className="hidden sm:inline">Public Chats</span>
                </button>
                <button
                  onClick={() => setActiveTab('invites')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-clay-400 transition-colors ${
                    activeTab === 'invites'
                      ? 'bg-clay-100 text-clay-800 border-clay-700 shadow'
                      : 'text-clay-500 hover:bg-clay-100 hover:text-clay-700'
                  }`}
                >
                  <Mail fontSize="small" />
                  <span className="hidden sm:inline">Invites</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-clay-300 rounded flex items-center justify-center text-clay-800 font-extrabold text-base border-2 border-clay-500">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-clay-700 font-bold">
                  {currentUser.name}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest uppercase border border-clay-400 rounded bg-clay-700 text-clay-50 hover:bg-clay-800 transition-colors"
                  style={{
                    fontFamily:
                      'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="w-full px-2 md:px-4 py-4">
              {activeTab === 'private' && (
                <div className="w-full bg-clay-100 rounded border-2 border-clay-300 p-2 md:p-6">
                  <h2
                    className="text-lg text-clay-800 font-bold mb-4 tracking-widest uppercase"
                    style={{
                      fontFamily:
                        'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                    }}
                  >
                    Your Chats
                  </h2>
                  <div className="flex h-96">
                    {/* Chat List - Left Side */}
                    <div className="w-1/4 border-r-2 border-clay-300 pr-2 md:pr-4">
                      <div className="space-y-2">
                        {chatRooms.map((chat) => (
                          <div
                            key={chat.roomID}
                            onClick={() =>
                              setSelectedChat(chat.roomID.toString())
                            }
                            className={`flex items-center p-2 md:p-3 rounded cursor-pointer border border-clay-200 hover:bg-clay-200 transition-colors ${
                              selectedChat === chat.roomID.toString()
                                ? 'bg-clay-200 border-clay-400'
                                : ''
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-bold text-clay-700 truncate"
                                style={{
                                  fontFamily:
                                    'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                                }}
                              >
                                {chat.name}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Window - Right Side */}
                    <div className="w-3/4 pl-2 md:pl-4">
                      {selectedChat ? (
                        <ChatWindow
                          roomName={selectedChatRoom?.name || ''}
                          messages={selectedChatRoom?.messages || []}
                          chatrooms={setChatRooms}
                          selectedChat={selectedChat}
                          onSendMessage={handleSendMessage}
                          currentMessage={() => {}}
                          chatClientWS={(client: chatClient) => {
                            setChatClientWS(client);
                            return client;
                          }}
                          currentUser={() => {}}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-clay-400">
                          <div className="text-center">
                            <Chat className="w-12 h-12 mx-auto mb-4 text-clay-200" />
                            <p>Select a chat to start messaging</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'public' && (
                <div className="w-full bg-clay-100 rounded border-2 border-clay-300 shadow p-2 md:p-6">
                  <h2
                    className="text-lg text-clay-800 font-bold mb-4 tracking-widest uppercase"
                    style={{
                      fontFamily:
                        'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                    }}
                  >
                    Popular Topics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-clay-200 rounded bg-clay-50">
                      <h3 className="text-clay-800 font-bold">Technology</h3>
                      <p className="text-xs text-clay-500">1.2k members</p>
                    </div>
                    <div className="p-4 border-2 border-clay-200 rounded bg-clay-50">
                      <h3 className="text-clay-800 font-bold">Gaming</h3>
                      <p className="text-xs text-clay-500">3.5k members</p>
                    </div>
                    <div className="p-4 border-2 border-clay-200 rounded bg-clay-50">
                      <h3 className="text-clay-800 font-bold">Music</h3>
                      <p className="text-xs text-clay-500">2.8k members</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'invites' && (
                <div className="w-full bg-clay-100 rounded border-2 border-clay-300 shadow p-2 md:p-6">
                  <h2
                    className="text-lg text-clay-800 font-bold mb-4 tracking-widest uppercase"
                    style={{
                      fontFamily:
                        'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                    }}
                  >
                    Chat Invitations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-clay-200 rounded bg-clay-50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-clay-300 rounded-full flex items-center justify-center text-clay-800 font-semibold text-sm mr-4">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-clay-800 font-bold">
                            AI Conventional Commits Dev Tool
                          </h3>
                          <p className="text-xs text-clay-500">
                            Invited by Alicia
                          </p>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
