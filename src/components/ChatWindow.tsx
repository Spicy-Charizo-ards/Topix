import { useState, useRef, useEffect } from 'react';
import { Avatar, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { wsClient } from '../wsClient';

interface Message {
  mID: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

//user for websocket connection
interface User {
  userID: string;
  userName: string;
}

interface ChatWindowProps {
  roomName?: string;
  messages?: Message[];
  user: User;
  onSendMessage?: (message: string) => void;
}

const ChatWindow = ({
  roomName = 'General Chat',
  messages = [],
  user,
  onSendMessage,
}: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //* CONNECT CLIENT TO SOCKET
  useEffect(() => {
    wsClient(user);
  }, []);

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

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-orange-950 rounded-t-lg">
        <div className="flex items-center">
            <h3 className="font-medium">{roomName}</h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.mID}
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
                  <Avatar className="w-8 h-8 mr-2 flex-shrink-0" />
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none bg-neutral-300 text-black placeholder-gray-600"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="text-n disabled:bg-gray-300"
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
