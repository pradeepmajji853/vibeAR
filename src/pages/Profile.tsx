import React, { useState } from 'react';
import { User, Heart, History, Settings, Camera, Share2, Download, Trash2, Star } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'shared'>('saved');

  const savedItems = [
    {
      id: '1',
      name: 'Modern Lounge Chair',
      image: 'https://images.pexels.com/photos/586738/pexels-photo-586738.jpeg?auto=compress&cs=tinysrgb&w=200',
      price: '$599',
      savedDate: '2 days ago'
    },
    {
      id: '2',
      name: 'Glass Coffee Table',
      image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=200',
      price: '$449',
      savedDate: '1 week ago'
    },
    {
      id: '3',
      name: 'Velvet Accent Chair',
      image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=200',
      price: '$799',
      savedDate: '2 weeks ago'
    }
  ];

  const arSessions = [
    {
      id: '1',
      name: 'Living Room Design',
      thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200',
      itemCount: 5,
      date: 'Today',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Bedroom Makeover',
      thumbnail: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=200',
      itemCount: 3,
      date: 'Yesterday',
      rating: 5.0
    },
    {
      id: '3',
      name: 'Home Office Setup',
      thumbnail: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=200',
      itemCount: 4,
      date: '3 days ago',
      rating: 4.0
    }
  ];

  const sharedDesigns = [
    {
      id: '1',
      name: 'Cozy Reading Corner',
      thumbnail: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=200',
      likes: 24,
      comments: 8,
      date: '1 week ago'
    },
    {
      id: '2',
      name: 'Minimalist Kitchen',
      thumbnail: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=200',
      likes: 15,
      comments: 3,
      date: '2 weeks ago'
    }
  ];

  const tabs = [
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'history', label: 'History', icon: History },
    { id: 'shared', label: 'Shared', icon: Share2 }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Alex Chen</h1>
            <p className="text-violet-100">Design enthusiast</p>
            <p className="text-sm text-violet-200 mt-1">Joined January 2024</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-violet-200">Items Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-violet-200">AR Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-violet-200">Designs Shared</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="flex-1 bg-white text-violet-600 py-3 rounded-xl font-medium hover:bg-violet-50 transition-colors flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" />
            New AR Session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-violet-400 border-b-2 border-violet-400'
                    : 'text-gray-400 hover:text-violet-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Saved Furniture</h2>
              <span className="text-sm text-gray-400">{savedItems.length} items</span>
            </div>
            
            <div className="space-y-3">
              {savedItems.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <p className="text-violet-400 font-semibold">{item.price}</p>
                    <p className="text-sm text-gray-400">Saved {item.savedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                      <Download className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center hover:bg-red-900/50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">AR Sessions</h2>
              <span className="text-sm text-gray-400">{arSessions.length} sessions</span>
            </div>
            
            <div className="space-y-3">
              {arSessions.map((session) => (
                <div key={session.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex">
                    <img
                      src={session.thumbnail}
                      alt={session.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white">{session.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{session.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-1">
                        {session.itemCount} furniture items placed
                      </p>
                      <p className="text-sm text-gray-400">{session.date}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <button className="flex-1 bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                      Continue Session
                    </button>
                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm hover:bg-gray-700 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shared' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Shared Designs</h2>
              <span className="text-sm text-gray-400">{sharedDesigns.length} designs</span>
            </div>
            
            <div className="space-y-3">
              {sharedDesigns.map((design) => (
                <div key={design.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <img
                    src={design.thumbnail}
                    alt={design.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-2">{design.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {design.likes}
                        </span>
                        <span>{design.comments} comments</span>
                      </div>
                      <span>{design.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;