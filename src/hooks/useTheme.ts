
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return 'system';
    
    const saved = localStorage.getItem('taskflowai-theme') as Theme;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to get system preference
  const getSystemPreference = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Function to apply theme to DOM
  const applyTheme = useCallback((currentTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const shouldBeDark = currentTheme === 'dark' || 
      (currentTheme === 'system' && getSystemPreference());

    setIsDarkMode(shouldBeDark);

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add appropriate theme class
    root.classList.add(shouldBeDark ? 'dark' : 'light');
    
    // Store the current theme
    localStorage.setItem('taskflowai-theme', currentTheme);
    
    // Add smooth transition for theme changes
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Remove transition after it completes
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }, [getSystemPreference]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // Toggle between light and dark (not system)
  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDarkMode]);

  // Set specific theme
  const setThemeMode = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return { 
    theme, 
    isDarkMode, 
    toggleTheme, 
    setTheme: setThemeMode,
    systemPreference: getSystemPreference()
  };
};
