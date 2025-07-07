import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system' 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    const stored = localStorage.getItem('taskflowai-theme') as Theme;
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const getSystemPreference = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  const applyTheme = useCallback((currentTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const shouldBeDark = currentTheme === 'dark' || 
      (currentTheme === 'system' && getSystemPreference());

    setIsDarkMode(shouldBeDark);

    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the appropriate theme class
    root.classList.add(shouldBeDark ? 'dark' : 'light');
    
    // Store the theme preference
    localStorage.setItem('taskflowai-theme', currentTheme);
    
    // Set color scheme meta tag for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', shouldBeDark ? '#0f172a' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = shouldBeDark ? '#0f172a' : '#ffffff';
      document.head.appendChild(meta);
    }
  }, [getSystemPreference]);

  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDarkMode]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes
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

  const value: ThemeContextProps = {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
