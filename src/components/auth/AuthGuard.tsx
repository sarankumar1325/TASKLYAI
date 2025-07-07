import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  console.log('AuthGuard - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    console.log('Clerk is still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Initializing authentication..." />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 font-inter">
              Welcome to TaskFlowAI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-inter leading-relaxed">
              Your premium productivity companion. Sign in to manage your tasks with AI-powered insights.
            </p>
            <SignInButton mode="modal">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-inter">
                Sign In to Continue
              </Button>
            </SignInButton>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              If you're seeing this, authentication is working but you need to sign in.
            </p>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export const UserProfile: React.FC = () => {
  return (
    <div className="flex items-center">
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "h-9 w-9 ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-200",
            userButtonPopoverCard: "glass-card border-gray-200/60 dark:border-gray-700/60",
          }
        }}
      />
    </div>
  );
};
