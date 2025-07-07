import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getSidebarWidth = () => {
    return isCollapsed ? 80 : 256; // 20 = w-20, 64 = w-64 in pixels
  };

  const getSidebarClass = () => {
    return isCollapsed ? 'pl-20' : 'pl-64';
  };

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    getSidebarWidth,
    getSidebarClass,
  };
};
