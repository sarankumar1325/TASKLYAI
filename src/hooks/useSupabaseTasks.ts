import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Task, Status, Priority, CreateTaskData, UpdateTaskData, TaskFilters } from '@/types/task';
import { toast } from 'sonner';
import { chatWithTasks, ChatResponse } from '@/services/groqService';

// Query keys for better cache management
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useSupabaseTasks = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch tasks with React Query
  const {
    data: tasks = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async (): Promise<Task[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to load tasks');
      }

      return (data || []).map(task => ({
        ...task,
        priority: task.priority as Priority,
        status: task.status as Status,
        tags: task.tags || []
      }));
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create task mutation with optimistic updates
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: CreateTaskData): Promise<Task> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          status: 'pending' as Status,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task');
      }

      return {
        ...data,
        priority: data.priority as Priority,
        status: data.status as Status,
        tags: data.tags || []
      };
    },
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      // Optimistically update to the new value
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        ...newTask,
        user_id: user?.id || '',
        status: 'pending' as Status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: newTask.priority || 'medium',
        tags: newTask.tags || [],
        is_important: newTask.is_important || false,
        is_archived: false,
      };

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) => [optimisticTask, ...old]);

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to create task');
    },
    onSuccess: () => {
      toast.success('Task created successfully');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: UpdateTaskData }): Promise<Task> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
      }

      return {
        ...data,
        priority: data.priority as Priority,
        status: data.status as Status,
        tags: data.tags || []
      };
    },
    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
        old.map(task => task.id === taskId ? { ...task, ...updates } : task)
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to update task');
    },
    onSuccess: () => {
      toast.success('Task updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
      }
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
        old.filter(task => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Search tasks with debouncing
  const searchTasks = async (query: string): Promise<Task[]> => {
    if (!query.trim()) return tasks;

    const searchLower = query.toLowerCase();
    
    return tasks.filter(task => {
      if (task.title.toLowerCase().includes(searchLower)) return true;
      if (task.description?.toLowerCase().includes(searchLower)) return true;
      if (task.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;
      if (task.priority.toLowerCase().includes(searchLower)) return true;
      if (task.status.toLowerCase().includes(searchLower)) return true;
      return false;
    });
  };

  // Chat with AI about tasks using Groq API
  const chatWithAI = async (message: string): Promise<ChatResponse> => {
    if (!user) throw new Error('User not authenticated');

    try {
      return await chatWithTasks(message, user.id, tasks);
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    const newStatus: Status = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      await updateTaskMutation.mutateAsync({ 
        taskId, 
        updates: { status: newStatus } 
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Archive task
  const archiveTask = async (taskId: string): Promise<boolean> => {
    try {
      await updateTaskMutation.mutateAsync({ 
        taskId, 
        updates: { is_archived: true } 
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Filter tasks by various criteria
  const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.isImportant !== undefined && task.is_important !== filters.isImportant) return false;
      if (filters.isArchived !== undefined && task.is_archived !== filters.isArchived) return false;
      return true;
    });
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate < tomorrow;
    });
  };

  const getImportantTasks = () => {
    return tasks.filter(task => task.is_important);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate > today;
    });
  };

  return {
    tasks,
    loading,
    error,
    refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: (taskId: string, updates: UpdateTaskData) => 
      updateTaskMutation.mutateAsync({ taskId, updates }),
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTaskComplete,
    archiveTask,
    searchTasks,
    chatWithAI,
    filterTasks,
    getTasksByStatus,
    getTasksForToday,
    getImportantTasks,
    getUpcomingTasks,
    // Mutation states for UI feedback
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
