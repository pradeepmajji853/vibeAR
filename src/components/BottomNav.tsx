import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Scan, Brain, User, Camera } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/ar-room', icon: Scan, label: 'AR Room' },
    { path: '/ai-analysis', icon: Camera, label: 'AI Analysis' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-violet-900/30 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-violet-400 bg-violet-900/30'
                  : 'text-gray-400 hover:text-violet-400'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">
                {item.label === 'AI Analysis' ? 'AI' : item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;