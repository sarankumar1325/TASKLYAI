import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { AnimatedCheckbox } from '@/components/ui/animated-checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityIcons: Record<Priority, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  urgent: '🔴',
};

export const TaskCard: React.FC<TaskCardProps> = React.memo(({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Memoized computed values
  const isCompleted = useMemo(() => task.status === 'completed', [task.status]);
  const isOverdue = useMemo(() => {
    if (!task.due_date || isCompleted) return false;
    return new Date(task.due_date) < new Date();
  }, [task.due_date, isCompleted]);

  // Memoized formatted dates
  const formattedDueDate = useMemo(() => {
    if (!task.due_date) return null;
    return new Date(task.due_date).toLocaleDateString();
  }, [task.due_date]);

  const formattedCreatedDate = useMemo(() => {
    return new Date(task.created_at).toLocaleDateString();
  }, [task.created_at]);

  // Memoized visible tags
  const visibleTags = useMemo(() => {
    return task.tags.slice(0, 3);
  }, [task.tags]);

  const hasMoreTags = useMemo(() => {
    return task.tags.length > 3;
  }, [task.tags.length]);

  // Optimized event handlers
  const handleToggleComplete = useCallback(async () => {
    setIsCompleting(true);
    
    // Add micro animation delay
    setTimeout(() => {
      onToggleComplete(task.id);
      setIsCompleting(false);
    }, 200);
  }, [onToggleComplete, task.id]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  }, [onDelete, task.id]);

  return (
    <div className={cn(
      'task-card group',
      isCompleted && 'task-card-completed animate-task-complete',
      isOverdue && 'task-card-overdue',
      isCompleting && 'animate-confetti'
    )}>
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <AnimatedCheckbox
            checked={isCompleted}
            onChange={handleToggleComplete}
            className="hover:scale-110 transition-transform duration-200"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn(
              'font-semibold text-lg transition-all duration-300 font-inter',
              isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
            )}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105',
                `priority-${task.priority}`
              )}>
                {priorityIcons[task.priority]} {task.priority}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem 
                    onClick={handleEdit}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Task</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Task</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {task.description && (
            <p className={cn(
              'text-sm mb-3 transition-all duration-300 font-inter leading-relaxed',
              isCompleted 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-600 dark:text-gray-300'
            )}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {formattedDueDate && (
                <div className={cn(
                  'flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200',
                  isOverdue 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {formattedDueDate}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedCreatedDate}</span>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="flex space-x-1">
                {visibleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 font-inter hover:scale-105 transition-transform duration-200"
                  >
                    {tag}
                  </span>
                ))}
                {hasMoreTags && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border border-gray-200 dark:border-gray-600 font-inter hover:scale-105 transition-transform duration-200">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
