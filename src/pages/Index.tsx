import React, { useState, useMemo, useCallback } from 'react';
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
import { LoadingSpinner, TaskListSkeleton } from '@/components/ui/loading-spinner';
import { useDebounce } from '@/hooks/useDebounce';

const Index = () => {
  const { 
    tasks, 
    loading, 
    error,
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    archiveTask,
    searchTasks,
    isCreating,
    isUpdating,
    isDeleting
  } = useSupabaseTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const { getSidebarClass } = useSidebar();

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized filtered tasks with debounced search
  const displayedTasks = useMemo(async () => {
    if (debouncedSearchQuery.trim()) {
      return await searchTasks(debouncedSearchQuery);
    }
    return tasks;
  }, [tasks, debouncedSearchQuery, searchTasks]);

  // Use state to handle async filtered tasks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    const updateFilteredTasks = async () => {
      if (debouncedSearchQuery.trim()) {
        setIsSearching(true);
        const result = await displayedTasks;
        setFilteredTasks(result);
        setIsSearching(false);
      } else {
        setFilteredTasks(tasks);
      }
    };
    updateFilteredTasks();
  }, [displayedTasks, tasks, debouncedSearchQuery]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleCreateTask = useCallback(async (taskData: CreateTaskData) => {
    await createTask(taskData);
    setIsCreateModalOpen(false);
  }, [createTask]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleToggleComplete = useCallback(async (taskId: string) => {
    await toggleTaskComplete(taskId);
  }, [toggleTaskComplete]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    await deleteTask(taskId);
  }, [deleteTask]);

  const handleUpdateTask = useCallback(async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
    handleCloseEditModal();
  }, [updateTask, handleCloseEditModal]);

  const handleArchiveTask = useCallback(async (taskId: string) => {
    await archiveTask(taskId);
    handleCloseEditModal();
  }, [archiveTask, handleCloseEditModal]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Loading TaskFlowAI..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Failed to load your tasks. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
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
          isCreating={isCreating}
        />
        
        <main className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-inter">
              All Tasks
            </h1>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              {isSearching ? 'Searching...' : `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''} found`}
              {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
            </p>
          </div>
          
          {isSearching ? (
            <TaskListSkeleton count={3} />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          )}
        </main>

        {/* Footer with Pixelated Animation */}
        <Footer />
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
        isCreating={isCreating}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateTask={handleUpdateTask}
        onArchiveTask={handleArchiveTask}
        task={editingTask}
        isUpdating={isUpdating}
      />

      <AIChat />
    </div>
  );
};

export default Index;
