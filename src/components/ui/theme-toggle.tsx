
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useThemeContext } from '@/components/providers/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-11 w-11 lg:h-12 lg:w-12 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 border border-white/40 dark:border-white/20 rounded-xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-purple-500/20 relative overflow-hidden group"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon container with enhanced animations */}
          <div className="relative z-10 w-5 h-5 lg:w-6 lg:h-6">
            <Sun className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isDarkMode 
                ? 'scale-0 rotate-180 opacity-0' 
                : 'scale-100 rotate-0 opacity-100'
            }`} />
            <Moon className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isDarkMode 
                ? 'scale-100 rotate-0 opacity-100' 
                : 'scale-0 -rotate-180 opacity-0'
            }`} />
          </div>
          
          {/* Subtle pulse effect */}
          <div className="absolute inset-0 rounded-xl bg-purple-500/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Theme switch indicator */}
          <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-purple-400' : 'bg-amber-400'
          }`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-white/10">
        <p className="text-sm font-medium">
          Switch to {isDarkMode ? 'light' : 'dark'} mode
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
