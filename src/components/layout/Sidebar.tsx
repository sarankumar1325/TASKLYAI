
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  List, 
  Search, 
  Star,
  Settings,
  Archive
} from 'lucide-react';

const navigation = [
  { name: 'All Tasks', href: '/', icon: List },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Completed', href: '/completed', icon: CheckCircle },
  { name: 'Important', href: '/important', icon: Star },
  { name: 'Upcoming', href: '/upcoming', icon: Clock },
  { name: 'Archive', href: '/archive', icon: Archive },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="glass-card h-screen w-64 fixed left-4 top-4 bottom-4 z-10 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            TaskFlowAI
          </h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/10">
          <NavLink
            to="/settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
