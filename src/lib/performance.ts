import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private isEnabled = process.env.NODE_ENV === 'development';

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => void {
    if (!this.isEnabled) return () => {};

    const start = performance.now();
    return () => this.endTimer(label, start);
  }

  private endTimer(label: string, start: number): void {
    const duration = performance.now() - start;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    this.metrics.get(label)!.push(duration);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [label, durations] of this.metrics.entries()) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      result[label] = { avg, min, max, count: durations.length };
    }
    
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  logMetrics(): void {
    if (!this.isEnabled) return;
    
    const metrics = this.getMetrics();
    console.group('Performance Metrics');
    for (const [label, stats] of Object.entries(metrics)) {
      console.log(`${label}:`, {
        average: `${stats.avg.toFixed(2)}ms`,
        min: `${stats.min.toFixed(2)}ms`,
        max: `${stats.max.toFixed(2)}ms`,
        count: stats.count
      });
    }
    console.groupEnd();
  }
}

// React performance hooks
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  React.useEffect(() => {
    const endTimer = monitor.startTimer(`${componentName} render`);
    return endTimer;
  });
};

// Higher-order component for performance monitoring
export const withPerformanceMonitor = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformanceMonitor = React.forwardRef<any, P>((props, ref) => {
    usePerformanceMonitor(displayName);
    
    return <WrappedComponent {...props} ref={ref} />;
  });
  
  WithPerformanceMonitor.displayName = `withPerformanceMonitor(${displayName})`;
  
  return WithPerformanceMonitor;
};

// Utility to measure async operations
export const measureAsync = async <T>(
  label: string,
  operation: () => Promise<T>
): Promise<T> => {
  const monitor = PerformanceMonitor.getInstance();
  const endTimer = monitor.startTimer(label);
  
  try {
    const result = await operation();
    return result;
  } finally {
    endTimer();
  }
};

// Utility to measure sync operations
export const measureSync = <T>(
  label: string,
  operation: () => T
): T => {
  const monitor = PerformanceMonitor.getInstance();
  const endTimer = monitor.startTimer(label);
  
  try {
    const result = operation();
    return result;
  } finally {
    endTimer();
  }
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance(); 