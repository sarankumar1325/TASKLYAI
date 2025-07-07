import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { AIChat } from '@/components/ai/AIChat';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSidebar } from '@/hooks/useSidebar';
import { Task, CreateTaskData } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';

const Upcoming = () => {
  const { 
    tasks,
    loading,
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    archiveTask,
    searchTasks 
  } = useSupabaseTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const { getSidebarClass } = useSidebar();

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.due_date) return false;
      return new Date(task.due_date) > now;
    }).sort((a, b) => 
      new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    );
  }, [tasks]);

  const filteredTasks = useMemo(async () => {
    if (searchQuery.trim()) {
      const allSearchResults = await searchTasks(searchQuery);
      const now = new Date();
      return allSearchResults.filter(task => {
        if (!task.due_date) return false;
        return new Date(task.due_date) > now;
      });
    }
    return upcomingTasks;
  }, [upcomingTasks, searchQuery, searchTasks]);

  // Use state to handle async filtered tasks
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

  React.useEffect(() => {
    const updateFilteredTasks = async () => {
      const result = await filteredTasks;
      setDisplayedTasks(result);
    };
    updateFilteredTasks();
  }, [filteredTasks]);

  const handleCreateTask = async (taskData: CreateTaskData) => {
    // Set due date to tomorrow if not specified
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await createTask({
      ...taskData,
      due_date: taskData.due_date || tomorrow.toISOString(),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-inter">Loading upcoming tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      
      <div className={`${!isMobile ? getSidebarClass() : ''} min-h-screen transition-all duration-300`}>
        <Header
          onCreateTask={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-inter">
              Upcoming Tasks
            </h1>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              {displayedTasks.length} upcoming task{displayedTasks.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <TaskList
            tasks={displayedTasks}
            onToggleComplete={toggleTaskComplete}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        </main>

        {/* Footer with Pixelated Animation */}
        <Footer />
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
        onArchiveTask={archiveTask}
        task={editingTask}
      />

      <AIChat />
    </div>
  );
};

export default Upcoming;