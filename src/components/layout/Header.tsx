
import React from 'react';
import { Search, Plus, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/components/auth/AuthGuard';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateTask,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-8">
        {/* Left section - Logo and Search */}
        <div className="flex items-center space-x-8 flex-1">
          {/* Premium Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                TaskFlowAI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Premium Edition</p>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 w-5 h-5 transition-colors" />
              <Input
                type="text"
                placeholder="Search tasks, projects, or anything..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 h-12 bg-gray-50/80 dark:bg-slate-800/80 border-gray-200/60 dark:border-gray-700/60 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 placeholder:text-gray-400 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-slate-700/80"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="relative">
            <ThemeToggle />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-11 bg-gray-50/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          
          {/* Create Task Button */}
          <Button
            onClick={onCreateTask}
            className="h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">New Task</span>
          </Button>

          {/* User Profile */}
          <div className="relative">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};
