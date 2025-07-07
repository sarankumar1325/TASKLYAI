import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AIChat: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenAIChat = () => {
    navigate('/ai-chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleOpenAIChat}
        className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 group"
        title="Open AI Chat"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
      </Button>
    </div>
  );
};
