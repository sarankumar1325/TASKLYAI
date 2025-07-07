import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, Zap, BarChart3, Copy, RefreshCw, Trash2, Brain, Cpu, Atom, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { chatWithTasks } from '@/services/groqService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isMarkdown?: boolean;
  taskStats?: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    due_today: number;
  };
}

// Enhanced markdown-to-HTML converter with better formatting
const parseMarkdown = (text: string): string => {
  return text
    // Remove excessive line breaks
    .replace(/\n{3,}/g, '\n\n')
    
    // Headers with better styling
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white border-b-2 border-purple-500 pb-2">$1</h1>')
    
    // Bold text - clean styling without showing asterisks
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-gray-900 dark:text-white">$1</span>')
    
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')
    
    // Inline code with better styling
    .replace(/`([^`]+)`/g, '<code class="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-sm font-mono text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">$1</code>')
    
    // Code blocks with syntax highlighting
    .replace(/```([\s\S]*?)```/g, '<div class="my-4"><pre class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700"><code class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">$1</code></pre></div>')
    
    // Enhanced blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-3 bg-purple-50 dark:bg-purple-900/20 text-gray-700 dark:text-gray-300 italic rounded-r-lg">$1</blockquote>')
    
    // Unordered lists with better styling
    .replace(/^- (.*$)/gm, '<li class="flex items-start ml-4 mb-2"><span class="text-purple-500 mr-2 mt-1">•</span><span class="text-gray-700 dark:text-gray-300">$1</span></li>')
    .replace(/^\* (.*$)/gm, '<li class="flex items-start ml-4 mb-2"><span class="text-purple-500 mr-2 mt-1">•</span><span class="text-gray-700 dark:text-gray-300">$1</span></li>')
    
    // Numbered lists with enhanced styling
    .replace(/^(\d+)\. (.*$)/gm, '<li class="flex items-start ml-4 mb-2"><span class="font-semibold text-purple-600 dark:text-purple-400 mr-2 min-w-[1.5rem]">$1.</span><span class="text-gray-700 dark:text-gray-300">$1</span></li>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-6">')
    
    // Enhanced emoji support
    .replace(/:\)/g, '😊')
    .replace(/:\(/g, '😔')
    .replace(/:D/g, '😃')
    .replace(/:\|/g, '😐')
    
    // Line breaks - convert single newlines to <br> for better formatting
    .replace(/\n/g, '<br>');
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount and initialize speech synthesis
  useEffect(() => {
    inputRef.current?.focus();
    
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
      speechSynthesisRef.current = window.speechSynthesis;
    }
    
    // Cleanup speech on unmount
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([{
      id: '1',
      text: `# Welcome to TaskFlowAI! 🚀

I'm your intelligent task management assistant powered by advanced AI. I can help you with:

## 📊 Task Analytics
- Analyze your productivity patterns
- Identify bottlenecks and improvements  
- Generate insights from your task data

## 🎯 Smart Recommendations
- Suggest task prioritization strategies
- Recommend time management techniques
- Help optimize your workflow

## 📋 Task Management
- Answer questions about your tasks
- Help with organization and categorization
- Provide motivation and productivity tips

> **Quick Tip:** Try asking me "What's my productivity overview?" or "How can I improve my task completion rate?"

What would you like to know about your tasks today?`,
      isUser: false,
      timestamp: new Date(),
      isMarkdown: true
    }]);
  }, []);

  const { tasks } = useSupabaseTasks();

  const callGroqChatAPI = async (message: string): Promise<{ response: string; taskStats?: { total: number; pending: number; completed: number; overdue: number; due_today: number; } }> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await chatWithTasks(message, user.id, tasks);
      return result;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const { response, taskStats } = await callGroqChatAPI(currentMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        isMarkdown: true,
        taskStats
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Response generated successfully!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please check your connection.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `# ⚠️ AI Service Issue

I'm currently experiencing some connectivity issues with the Groq AI service, but I'm working on it! 

## What's happening:
- Unable to connect to Groq API
- Your data and tasks are safe
- This is likely a temporary issue

## Quick fixes to try:
1. **Refresh the page** and try again
2. **Check your internet connection**
3. **Wait a moment** and try again (API may be temporarily busy)

> **Note:** The AI chat uses Groq's Llama 3.3 70B model for intelligent task management assistance.

**Technical details:** ${error.message}`,
        isUser: false,
        timestamp: new Date(),
        isMarkdown: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refocus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    // Remove HTML tags for cleaner copy
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
    navigator.clipboard.writeText(cleanText);
    toast.success('Copied to clipboard!');
  };

  const speakMessage = (messageId: string, text: string) => {
    if (!speechSynthesisRef.current || !speechSupported) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }

    // Stop any currently speaking message
    if (speakingMessageId) {
      speechSynthesisRef.current.cancel();
      setSpeakingMessageId(null);
    }

    // Clean text for speech (remove HTML tags and markdown)
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, '') // Remove HTML entities
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s/g, '') // Remove header markdown
      .replace(/>\s/g, '') // Remove blockquote markdown
      .replace(/[-*]\s/g, '') // Remove list markdown
      .replace(/\d+\.\s/g, '') // Remove numbered list markdown
      .trim();

    if (!cleanText) {
      toast.error('No text to speak');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure speech settings
    utterance.rate = 1.75; // High-speed playback to maximize engagement
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Natural') ||
      voice.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      toast.success('🔊 Playing AI response');
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = (event) => {
      setSpeakingMessageId(null);
      toast.error('Error playing speech: ' + event.error);
    };

    // Start speaking
    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current && speakingMessageId) {
      speechSynthesisRef.current.cancel();
      setSpeakingMessageId(null);
      toast.success('🔇 Speech stopped');
    }
  };

  const clearChat = () => {
    setMessages(messages.slice(0, 1)); // Keep welcome message
    toast.success('Chat cleared!');
    inputRef.current?.focus();
  };

  const quickPrompts = [
    "What's my productivity overview?",
    "Show me my overdue tasks",
    "How can I improve my task completion rate?",
    "What should I focus on today?",
    "Analyze my task patterns",
    "Suggest productivity improvements"
  ];

  const sendQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Sidebar />
      
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Header
          onCreateTask={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-inter">
                    TaskFlowAI Chat
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-inter text-sm sm:text-base">
                    Your intelligent task management assistant
                  </p>
                </div>
                <div className="flex-1" />
                <div className="flex space-x-2">
                  {/* Global Voice Control */}
                  {speechSupported && speakingMessageId && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600 hidden sm:flex animate-pulse"
                    >
                      <VolumeX className="w-4 h-4 mr-2" />
                      Stop Speaking
                    </Button>
                  )}
                  
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 hidden sm:flex"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </Button>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 sm:hidden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => sendQuickPrompt(prompt)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-white/60 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{prompt}</span>
                    <span className="sm:hidden">{prompt.split(' ')[0]}...</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Container */}
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 ai-chat-messages" style={{ height: 'calc(100vh - 400px)', minHeight: '400px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-full sm:max-w-4xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                      }`}>
                        {message.isUser ? (
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-2xl p-3 sm:p-4 shadow-lg border max-w-[85%] sm:max-w-none ${
                        message.isUser
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-300'
                          : 'bg-white/95 dark:bg-slate-800/95 text-gray-900 dark:text-white border-white/30 dark:border-white/10 backdrop-blur-sm'
                      }`}>
                        {/* Message Content */}
                        {message.isMarkdown && !message.isUser ? (
                          <div 
                            className="prose prose-sm sm:prose max-w-none dark:prose-invert prose-purple leading-relaxed ai-chat-message"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
                            style={{
                              lineHeight: '1.6',
                              fontSize: '14px'
                            }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.text}</p>
                        )}

                        {/* Task Stats */}
                        {message.taskStats && (
                          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center space-x-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Task Overview</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-white dark:bg-slate-800 text-xs">
                                Total: {message.taskStats.total}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs">
                                Pending: {message.taskStats.pending}
                              </Badge>
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
                                Completed: {message.taskStats.completed}
                              </Badge>
                              {message.taskStats.overdue > 0 && (
                                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs">
                                  Overdue: {message.taskStats.overdue}
                                </Badge>
                              )}
                              {message.taskStats.due_today > 0 && (
                                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs">
                                  Due Today: {message.taskStats.due_today}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {!message.isUser && (
                          <div className="flex justify-end mt-3 space-x-2">
                            {/* Text-to-Speech Button */}
                            {speechSupported && (
                              <Button
                                onClick={() => 
                                  speakingMessageId === message.id 
                                    ? stopSpeaking() 
                                    : speakMessage(message.id, message.text)
                                }
                                variant="ghost"
                                size="sm"
                                className={`h-6 px-2 text-xs transition-colors ${
                                  speakingMessageId === message.id
                                    ? 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                              >
                                {speakingMessageId === message.id ? (
                                  <>
                                    <Pause className="w-3 h-3 mr-1" />
                                    Stop
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3 mr-1" />
                                    Listen
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {/* Copy Button */}
                            <Button
                              onClick={() => copyToClipboard(message.text)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            TaskFlowAI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Fixed and Always Visible */}
              <div className="border-t border-white/20 dark:border-white/10 p-4 sm:p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex space-x-2 sm:space-x-3">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your tasks, request analytics, or get productivity advice..."
                    className="flex-1 bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-white/20 rounded-xl h-10 sm:h-12 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent ai-chat-input"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 sm:px-6 h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Press Enter to send • AI responses may take a few seconds • Powered by Groq Llama 3.3 70B
                  </p>
                  {speechSupported && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      🔊 Click "Listen" on AI messages to hear responses
                    </p>
                  )}
                  {speakingMessageId && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 animate-pulse">
                      🎵 Currently speaking...
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AIChat; 