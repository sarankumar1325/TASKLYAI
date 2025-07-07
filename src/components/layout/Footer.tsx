import React from 'react';
import { Sparkles, Github, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto border-t border-white/10 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl footer-component">
      {/* Pixelated Animation Background */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 overflow-hidden pixelated-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        {/* Pixelated Grid Effect */}
        <div className="pixelated-grid absolute inset-0"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  TaskFlowAI
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Edition</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Elevate your productivity with AI-powered task management. 
              Beautiful, intuitive, and intelligent.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2">
              {['Dashboard', 'Today', 'Important', 'Completed', 'Settings'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1 transform"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-4">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-white/10 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>by TaskFlowAI Team</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 TaskFlowAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
