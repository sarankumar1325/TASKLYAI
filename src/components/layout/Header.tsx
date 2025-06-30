
import React, { useState } from 'react';
import { Search, Plus, Bell, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/components/auth/AuthGuard';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateTask,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Main Header */}
      <div className="sticky top-0 z-50 w-full">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-2xl shadow-purple-500/5 dark:shadow-purple-500/10" />
        
        {/* Header Content */}
        <div className="relative">
          <div className="container flex h-20 lg:h-24 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Left Section - Logo */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              {/* Mobile Menu Toggle */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden h-10 w-10 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-300 border border-white/30 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}

              {/* Premium Logo */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="relative group">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-3 border-white dark:border-slate-900 shadow-lg animate-pulse-soft"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    TaskFlowAI
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">Premium Edition</p>
                </div>
              </div>
            </div>

            {/* Center Section - Search (Desktop) */}
            {!isMobile && (
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 w-5 h-5 transition-colors duration-300" />
                  <Input
                    type="text"
                    placeholder="Search tasks, projects, or anything..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 pr-6 h-14 bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-400 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-xl hover:shadow-purple-500/10"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Theme Toggle */}
              <div className="relative">
                <ThemeToggle />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-11 w-11 lg:h-12 lg:w-12 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-white/30 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
              </div>
              
              {/* Create Task Button */}
              <Button
                onClick={onCreateTask}
                className="h-11 lg:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border-0 backdrop-blur-xl"
              >
                <Plus className="w-5 h-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline text-sm lg:text-base">New Task</span>
              </Button>

              {/* User Profile */}
              <div className="relative">
                <UserProfile />
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobile && (
            <div className="px-4 pb-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 w-5 h-5 transition-colors duration-300" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 pr-4 h-12 bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-400 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/70 dark:hover:bg-slate-700/70"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-24 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    TaskFlowAI
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Edition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
