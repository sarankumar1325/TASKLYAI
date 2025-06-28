
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
      className="h-9 w-9 bg-background hover:bg-accent text-muted-foreground hover:text-foreground border border-input transition-all duration-200"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${
          isDarkMode ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`} />
        <Moon className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${
          isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`} />
      </div>
    </Button>
  );
};
