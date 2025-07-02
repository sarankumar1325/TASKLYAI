import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { AIChat } from '@/components/ai/AIChat';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { Task, CreateTaskData } from '@/types/task';
import { useIsMobile } from '@/hooks/use-mobile';

const Important = () => {
  const { 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    getImportantTasks,
    searchTasks 
  } = useSupabaseTasks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const importantTasks = useMemo(() => {
    return getImportantTasks();
  }, [getImportantTasks]);

  const filteredTasks = useMemo(async () => {
    if (searchQuery.trim()) {
      const allSearchResults = await searchTasks(searchQuery);
      return allSearchResults.filter(task => 
        task.priority === 'high' || task.priority === 'urgent'
      );
    }
    return importantTasks;
  }, [importantTasks, searchQuery, searchTasks]);

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
    // Set priority to high for important tasks
    await createTask({
      ...taskData,
      priority: taskData.priority || 'high',
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
      {!isMobile && <Sidebar />}
      
      <div className={`${!isMobile ? 'pl-64' : ''} min-h-screen`}>
        <Header
          onCreateTask={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-inter">
              Important Tasks
            </h1>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              {displayedTasks.length} important task{displayedTasks.length !== 1 ? 's' : ''}
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

      <AIChat />
    </div>
  );
};

export default Important;