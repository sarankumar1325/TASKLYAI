
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  List, 
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
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-geist">
              TaskFlowAI
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 font-geist ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <NavLink
            to="/settings"
            className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 font-geist"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
