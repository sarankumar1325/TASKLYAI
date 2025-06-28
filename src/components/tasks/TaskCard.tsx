
import React from 'react';
import { Calendar, Clock, MoreVertical, Check } from 'lucide-react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';

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

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={`task-card ${
      isCompleted ? 'task-card-completed' : ''
    } ${isOverdue ? 'task-card-overdue' : ''}`}>
      <div className="flex items-start space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 p-1 rounded-full transition-all duration-200 ${
            isCompleted
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
          }`}
        >
          {isCompleted && <Check className="w-3 h-3" />}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold text-lg transition-colors duration-200 ${
              isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>
                {priorityIcons[task.priority]} {task.priority}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mb-3 transition-colors duration-200 ${
              isCompleted 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-500 dark:text-red-400' : ''
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="flex space-x-1">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
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
};
