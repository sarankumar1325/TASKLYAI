import React, { useState, useCallback } from 'react';
import { Search, Plus, Menu, X, Sparkles, Loader2, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/components/auth/AuthGuard';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCreating?: boolean;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  onCreateTask,
  searchQuery,
  onSearchChange,
  isCreating = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isMobile = useIsMobile();

  // Memoized handlers
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <>
      {/* Main Header */}
      <div className="sticky top-0 z-50 w-full">
        {/* Enhanced Glassmorphism Background with Animated Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/90 to-white/85 dark:from-slate-900/85 dark:via-slate-900/90 dark:to-slate-900/85 backdrop-blur-3xl border-b border-white/30 dark:border-white/10 shadow-2xl shadow-purple-500/5 dark:shadow-purple-500/20">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
            <div className="absolute top-8 right-1/3 w-1 h-1 bg-pink-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-6 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
            <div className="absolute top-6 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse opacity-50" />
        </div>
        
        {/* Header Content */}
        <div className="relative">
          <div className="container flex h-20 lg:h-24 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Mobile Menu Toggle */}
              {isMobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMobileMenuToggle}
                      className="lg:hidden h-11 w-11 bg-white/80 dark:bg-slate-800/80 hover:bg-white/95 dark:hover:bg-slate-700/95 text-gray-700 dark:text-gray-300 border border-white/50 dark:border-white/20 rounded-xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        {isMobileMenuOpen ? (
                          <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                        ) : (
                          <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/30 dark:border-white/20">
                    <p>{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Enhanced Premium Logo */}
              <div className="flex items-center space-x-3 lg:space-x-4 group cursor-pointer">
                <div className="relative">
                  {/* Main logo container */}
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white transition-transform duration-500 group-hover:rotate-12 relative z-10" />
                  </div>
                  
                  {/* Orbital particles */}
                  <div className="absolute inset-0 group-hover:animate-spin" style={{ animationDuration: '8s' }}>
                    <Star className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Zap className="absolute -bottom-1 -left-1 w-2 h-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-blue-500">
                    TaskFlowAI
                  </h1>
                  <div className="flex items-center space-x-1 -mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Premium Edition
                    </p>
                    <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Enhanced Search (Desktop) */}
            {!isMobile && (
              <div className="flex-1 max-w-2xl mx-8">
                <div className={`relative group transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                  {/* Search icon with enhanced animation */}
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                    isSearchFocused 
                      ? 'text-purple-500 scale-110 rotate-12' 
                      : 'text-gray-400 group-hover:text-purple-500 group-hover:scale-105'
                  }`} />
                  
                  <Input
                    type="text"
                    placeholder="Search tasks, projects, or anything..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className={`pl-12 pr-6 h-14 bg-white/80 dark:bg-slate-800/80 border transition-all duration-300 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-400 text-sm font-medium shadow-lg backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-700/90 hover:shadow-xl hover:shadow-purple-500/10 ${
                      isSearchFocused 
                        ? 'border-purple-500/50 bg-white/95 dark:bg-slate-800/95 shadow-2xl shadow-purple-500/20' 
                        : 'border-white/50 dark:border-white/20'
                    }`}
                  />
                  
                  {/* Enhanced search overlay with gradient */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 transition-opacity duration-300 pointer-events-none ${
                    isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  {/* Floating search indicator */}
                  {searchQuery && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 animate-pulse">
                        <Search className="w-3 h-3 mr-1" />
                        Searching...
                      </Badge>
                    </div>
                  )}
                  
                  {/* Search focus ring */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-purple-500/30 transition-opacity duration-300 pointer-events-none ${
                    isSearchFocused ? 'opacity-100 animate-pulse' : 'opacity-0'
                  }`} />
                </div>
              </div>
            )}

            {/* Right Section - Enhanced Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Create Task Button */}
              <Button
                onClick={onCreateTask}
                disabled={isCreating}
                className="h-11 lg:h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border-0 backdrop-blur-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                {/* Floating particles on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                  <div className="absolute bottom-1 right-2 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
                
                <div className="relative z-10 flex items-center">
                  {isCreating ? (
                    <Loader2 className="w-5 h-5 mr-0 sm:mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-0 sm:mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  )}
                  <span className="hidden sm:inline text-sm lg:text-base">
                    {isCreating ? 'Creating...' : 'New Task'}
                  </span>
                </div>
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
              <div className={`relative group transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                  isSearchFocused ? 'text-purple-500 scale-110' : 'text-gray-400 group-hover:text-purple-500'
                }`} />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`pl-12 pr-4 h-12 bg-white/80 dark:bg-slate-800/80 border transition-all duration-300 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-400 text-sm font-medium shadow-lg backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-700/90 ${
                    isSearchFocused 
                      ? 'border-purple-500/50 bg-white/95 dark:bg-slate-800/95 shadow-xl' 
                      : 'border-white/50 dark:border-white/20'
                  }`}
                />
                
                {/* Mobile search overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 transition-opacity duration-300 pointer-events-none ${
                  isSearchFocused ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
});

Header.displayName = 'Header';
