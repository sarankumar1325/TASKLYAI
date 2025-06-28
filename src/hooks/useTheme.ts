
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('taskflowai-theme');
    if (saved) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('taskflowai-theme', JSON.stringify(isDarkMode));
    
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Add theme transition class for smooth switching
    root.classList.add('animate-theme-transition');
    
    // Remove transition class after animation
    const timer = setTimeout(() => {
      root.classList.remove('animate-theme-transition');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return { isDarkMode, toggleTheme };
};
