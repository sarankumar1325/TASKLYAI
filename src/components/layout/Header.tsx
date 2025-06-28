
import React from 'react';
import { Search, Plus, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/components/auth/AuthGuard';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateTask,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <div className="glass-card h-16 mx-4 mt-4 mb-6 flex items-center justify-between px-6 border-gray-200/60 dark:border-gray-700/60">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 glass border-0 focus:ring-2 focus:ring-purple-500/50 bg-white/60 dark:bg-white/5 placeholder:text-gray-500 dark:placeholder:text-gray-400 font-inter"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleTheme}
          className="theme-toggle group"
          aria-label="Toggle theme"
        >
          <div className="relative">
            <Sun className={cn(
              "h-5 w-5 text-amber-500 absolute inset-0 transition-all duration-500 ease-out",
              isDarkMode ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            )} />
            <Moon className={cn(
              "h-5 w-5 text-slate-600 dark:text-slate-300 absolute inset-0 transition-all duration-500 ease-out",
              isDarkMode ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            )} />
          </div>
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          className="glass h-11 w-11 bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200/60 dark:border-gray-700/60 hover:scale-105 transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onCreateTask}
          className="glass h-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-medium border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 px-6 font-inter"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>

        <UserProfile />
      </div>
    </div>
  );
};
