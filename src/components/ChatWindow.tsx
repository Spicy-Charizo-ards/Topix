import { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { wsClient } from '../wsClient';
import type { Message, ChatRoom, chatClient, User } from '../types';
// import type { IncomingMessage } from 'http';

interface ChatWindowProps {
  roomName?: string;
  messages?: Message[];
  currentUser: (cu: User) => void;
  chatrooms: (incomingMessage: React.SetStateAction<ChatRoom[]>) => void;
  selectedChat: (sc: string | null) => void;
  currentMessage: (msg: string) => void;
  chatClientWS: (cc: chatClient) => chatClient;
  onSendMessage?: (message: string) => void;
}

const ChatWindow = ({
  roomName = 'General Chat',
  messages = [],
  currentUser,
  chatrooms,
  chatClientWS,
  currentMessage,
  onSendMessage,
}: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatroomID, setChatroomID] = useState<string | number>(1);
  const [chatUser, setChatUser] = useState<User>({
    userID: Math.random(),
    userName: 'Mj',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentChat, setCurrentChat] = useState<ChatRoom[]>([
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  //* To set the message from dashboard with input message
  useEffect(() => {
    currentMessage(inputMessage);
  }, [currentMessage, inputMessage]);

  //!mount chat client here. Its passing up to the state in dashboard
  useEffect(() => {
    currentUser(chatUser);
    chatClientWS(
      wsClient(chatUser, (incomingMessage: Message) => {
        chatrooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === chatroomID
              ? { ...room, messages: [...room.messages, incomingMessage] }
              : room
          )
        );
      })
    );
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-clay-200 border-b-2 border-clay-400 rounded-t-lg select-none"
        style={{
          fontFamily:
            'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
        }}
      >
        <div className="flex items-center gap-2">
          Charizard
        </div>
        <h3
          className="text-base font-bold tracking-widest text-clay-800 uppercase"
          style={{ letterSpacing: '0.15em' }}
        >
          {' '}
          {roomName}{' '}
        </h3>
        <div className="w-8" /> {/* Spacer for symmetry */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-clay-100 border-b-2 border-clay-200">
        {messages.length === 0 ? (
          <div className="text-center text-clay-400 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              //TODO: destructure the array of messages from Dashboard here...
              key={message.mID || i}
              className={`flex ${
                message.isOwn ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex max-w-xs lg:max-w-md ${
                  message.isOwn ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!message.isOwn && (
                  <div className="w-8 h-8 bg-clay-300 rounded flex items-center justify-center text-clay-800 font-bold mr-2">
                    <span>U</span>
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded border-2 ${
                    message.isOwn
                      ? 'bg-clay-700 text-clay-50 border-clay-900'
                      : 'bg-clay-200 text-clay-900 border-clay-400'
                  } shadow-sm`}
                  style={{
                    fontFamily:
                      'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-clay-200' : 'text-clay-500'
                    }`}
                  >
                    {message.timestamp instanceof Date
                      ? message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-clay-400 bg-clay-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 border-2 border-clay-400 rounded bg-clay-100 text-black placeholder-clay-400 text-sm font-mono resize-none focus:ring-1 focus:ring-clay-400 focus:border-clay-700 outline-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="text-clay-700 bg-clay-200 border-2 border-clay-400 rounded hover:bg-clay-300 disabled:bg-clay-100"
            size="small"
          >
            <Send />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
