import React, { lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Debug logging
console.log('App.tsx loaded');

// Test mode - set to true to bypass authentication
const TEST_MODE = false;

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Today = lazy(() => import("./pages/Today"));
const Completed = lazy(() => import("./pages/Completed"));
const Important = lazy(() => import("./pages/Important"));
const Upcoming = lazy(() => import("./pages/Upcoming"));
const Archive = lazy(() => import("./pages/Archive"));
const AIChat = lazy(() => import("./pages/AIChat"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component for Suspense fallback
const PageLoader = () => {
  console.log('PageLoader rendering');
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Test component to verify rendering
const TestComponent = () => {
  console.log('TestComponent rendering');
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 glass-card max-w-md">
        <h1 className="text-3xl font-bold mb-4">TaskFlowAI Test Mode</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          If you can see this, the app is loading correctly!
        </p>
        <p className="text-sm text-gray-500">
          Check the browser console for debug logs.
        </p>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    console.log('App component mounted');
    console.log('Test mode:', TEST_MODE);
  }, []);

  const appContent = (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/today" element={<Today />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/important" element={<Important />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {TEST_MODE ? (
              <TestComponent />
            ) : (
              <AuthGuard>
                {appContent}
              </AuthGuard>
            )}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
