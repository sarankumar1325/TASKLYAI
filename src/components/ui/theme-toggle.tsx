
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-11 w-11 bg-gray-50/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
          isDarkMode ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`} />
        <Moon className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
          isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`} />
      </div>
    </Button>
  );
};
