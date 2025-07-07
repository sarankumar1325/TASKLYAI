import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskListSkeleton } from '@/components/ui/loading-spinner';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const TaskList: React.FC<TaskListProps> = React.memo(({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  isUpdating = false,
  isDeleting = false,
}) => {
  if (isUpdating || isDeleting) {
    return <TaskListSkeleton count={3} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first task to get started with TaskFlowAI
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
});

TaskList.displayName = 'TaskList';
