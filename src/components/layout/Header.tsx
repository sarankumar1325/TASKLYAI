
import React from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/components/auth/AuthGuard';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background border-input focus:ring-2 focus:ring-primary/20 font-geist placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 bg-background hover:bg-accent text-muted-foreground hover:text-foreground border border-input"
          >
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onCreateTask}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 font-geist"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>

          <UserProfile />
        </div>
      </div>
    </div>
  );
};
