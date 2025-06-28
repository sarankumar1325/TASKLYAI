
import React from 'react';
import { Calendar, Clock, Star, MoreVertical, Check } from 'lucide-react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'border-green-500/30 bg-green-500/10',
  medium: 'border-yellow-500/30 bg-yellow-500/10',
  high: 'border-orange-500/30 bg-orange-500/10',
  urgent: 'border-red-500/30 bg-red-500/10',
};

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
    <div className={`glass-card hover:scale-[1.02] transition-all duration-200 cursor-pointer ${
      isCompleted ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-500/30' : ''}`}>
      <div className="flex items-start space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 p-1 rounded-full ${
            isCompleted
              ? 'bg-green-500 text-white'
              : 'border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500'
          }`}
        >
          {isCompleted && <Check className="w-3 h-3" />}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold text-lg ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {priorityIcons[task.priority]} {task.priority}
              </span>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mb-3 ${
              isCompleted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-500' : ''
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
                    className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-600 dark:text-gray-400">
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
