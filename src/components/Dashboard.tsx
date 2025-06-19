import { useState } from 'react';
import { Chat, Public, Mail } from '@mui/icons-material';
import { Avatar } from '@mui/material';

type TabType = 'private' | 'public' | 'invites';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('private');

  return (
    <div className="w-full min-h-screen">
      <div className="w-full bg-amber-900">
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
      <div className="w-full mx-auto px-4 py-6">
        {activeTab === 'private' && (
          <div className="w-full bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Your Chats</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Avatar className="mr-4" />
                <div>
                  <h3 className="font-medium">Wenjun</h3>
                  <p className="text-sm text-gray-500">
                    Last message: Hey, how are you?
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <Avatar className="mr-4" />
                <div>
                  <h3 className="font-medium">Unknown</h3>
                  <p className="text-sm text-gray-500">
                    Last message: See you tomorrow!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'public' && (
          <div className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Popular Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Technology</h3>
                <p className="text-sm text-gray-500">1.2k members</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Gaming</h3>
                <p className="text-sm text-gray-500">3.5k members</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Music</h3>
                <p className="text-sm text-gray-500">2.8k members</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'invites' && (
          <div className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Chat Invitations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Avatar className="mr-4" />
                  <div>
                    <h3 className="font-medium">
                      AI Conventional Commits Dev Tool
                    </h3>
                    <p className="text-sm text-gray-500">Invited by Alicia</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 boarder border-blue-600 text-blue-600 rounded-md">
                    Accept
                  </button>
                  <button className="px-4 py-2 border rounded-md">
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
