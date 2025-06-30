
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
      className="h-11 w-11 lg:h-12 lg:w-12 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-white/30 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun className={`h-5 w-5 absolute inset-0 transition-all duration-500 ${
          isDarkMode ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`} />
        <Moon className={`h-5 w-5 absolute inset-0 transition-all duration-500 ${
          isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`} />
      </div>
    </Button>
  );
};
