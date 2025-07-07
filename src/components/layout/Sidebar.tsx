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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/hooks/useSidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navigation = [
  { name: 'All Tasks', href: '/', icon: List },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Completed', href: '/completed', icon: CheckCircle },
  { name: 'Important', href: '/important', icon: Star },
  { name: 'Upcoming', href: '/upcoming', icon: Clock },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'AI Chat', href: '/ai-chat', icon: MessageCircle },
];

interface SidebarProps {
  className?: string;
}

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

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  if (isMobile) return null;

  const NavigationItem = ({ item, isActive }: { item: typeof navigation[0], isActive: boolean }) => {
    const content = (
      <NavLink
        to={item.href}
        className={`group flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl font-medium transition-all duration-300 font-inter hover:scale-[1.02] active:scale-[0.98] ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/30 shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="transition-opacity duration-300">{item.name}</span>}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-white/10">
            <p className="text-sm font-medium">{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-20' : 'w-64'} bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300 ease-out ${className}`}>
      <div className="flex h-full flex-col">
        {/* Header with Logo and Collapse Button */}
        <div className={`flex h-20 items-center border-b border-white/20 dark:border-white/10 ${isCollapsed ? 'justify-center px-3' : 'justify-between px-6'} transition-all duration-300`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-inter transition-opacity duration-300">
                TaskFlowAI
              </h1>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapsed}
                className="h-9 w-9 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 border border-white/40 dark:border-white/20 rounded-lg shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-white/10">
              <p className="text-sm font-medium">
                {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'} py-6 transition-all duration-300`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavigationItem key={item.name} item={item} isActive={isActive} />
            );
          })}
        </nav>

        {/* Settings - Minimalistic Pixel Grid Hover */}
        <div className={`border-t border-white/20 dark:border-white/10 ${isCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/settings"
                  className="group flex items-center justify-center px-3 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 relative overflow-hidden transition-all duration-300 font-inter"
                >
                  <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="block w-full h-full bg-[linear-gradient(90deg,transparent_95%,#d1d5db_95%)] bg-[length:6px_6px] bg-repeat opacity-30" />
                  </span>
                  <Settings className="w-5 h-5 z-10 relative" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <p className="text-sm font-medium">Settings</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              to="/settings"
              className="group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 relative overflow-hidden transition-all duration-300 font-inter"
            >
              <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="block w-full h-full bg-[linear-gradient(90deg,transparent_95%,#d1d5db_95%)] bg-[length:6px_6px] bg-repeat opacity-30" />
              </span>
              <Settings className="w-5 h-5 z-10 relative" />
              <span className="transition-opacity duration-300 z-10 relative">Settings</span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};