import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  List, 
  Star,
  Settings,
  Archive,
  Sparkles
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'All Tasks', href: '/', icon: List },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Completed', href: '/completed', icon: CheckCircle },
  { name: 'Important', href: '/important', icon: Star },
  { name: 'Upcoming', href: '/upcoming', icon: Clock },
  { name: 'Archive', href: '/archive', icon: Archive },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 left-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-white/20 dark:border-white/10 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-inter">
                TaskFlowAI
              </h1>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 font-inter ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/30 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-white/20 dark:border-white/10 p-4">
            <NavLink
              to="/settings"
              onClick={onClose}
              className="group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-inter"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-white/20 dark:border-white/10 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-inter">
              TaskFlowAI
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 font-inter hover:scale-[1.02] active:scale-[0.98] ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/30 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/20 dark:border-white/10 p-4">
          <NavLink
            to="/settings"
            className="group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-inter hover:scale-[1.02] active:scale-[0.98]"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};