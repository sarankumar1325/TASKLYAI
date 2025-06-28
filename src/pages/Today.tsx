
import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types/task';

const Today = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    getTasksForToday 
  } = useTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const todayTasks = useMemo(() => {
    const tasks = getTasksForToday();
    if (searchQuery) {
      return tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return tasks;
  }, [getTasksForToday, searchQuery]);

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    tags: string[];
  }) => {
    // Set due date to today if not specified
    const today = new Date();
    createTask({
      ...taskData,
      dueDate: taskData.dueDate || today,
    });
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
    // TODO: Implement edit functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="pl-72">
        <Header
          onCreateTask={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        <main className="px-4 pb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Today's Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} due today
            </p>
          </div>
          
          <TaskList
            tasks={todayTasks}
            onToggleComplete={toggleTaskComplete}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        </main>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Today;
