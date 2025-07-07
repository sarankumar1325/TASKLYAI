import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      <div
        className={cn(
          'border-2 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-inter animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loader for content
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
      className
    )}
  />
);

// Task card skeleton
export const TaskCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="flex items-start space-x-4">
      <Skeleton className="w-5 h-5 rounded mt-1" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

// Task list skeleton
export const TaskListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <TaskCardSkeleton key={index} />
    ))}
  </div>
); 