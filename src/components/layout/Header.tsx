
import React from 'react';
import { Search, Plus, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="glass-card h-16 mx-4 mt-4 mb-6 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 glass border-0 focus:ring-2 focus:ring-purple-500/50 bg-white/5"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="glass-button text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="glass-button text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onCreateTask}
          className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>
  );
};
