
import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { Task, CreateTaskData } from '@/types/task';

const Today = () => {
  const { 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    getTasksForToday 
  } = useSupabaseTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  const handleCreateTask = async (taskData: CreateTaskData) => {
    // Set due date to today if not specified
    const today = new Date();
    await createTask({
      ...taskData,
      due_date: taskData.due_date || today.toISOString(),
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="pl-64">
        <Header
          onCreateTask={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="container max-w-screen-2xl px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-geist">
              Today's Tasks
            </h1>
            <p className="text-muted-foreground font-geist">
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

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateTask={updateTask}
        task={editingTask}
      />
    </div>
  );
};

export default Today;
