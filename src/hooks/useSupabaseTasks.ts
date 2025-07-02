import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Task, Status, Priority, CreateTaskData, UpdateTaskData, TaskFilters } from '@/types/task';
import { toast } from 'sonner';

export const useSupabaseTasks = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        return;
      }

      // Cast the data to proper Task type
      const typedTasks: Task[] = (data || []).map(task => ({
        ...task,
        priority: task.priority as Priority,
        status: task.status as Status,
        tags: task.tags || []
      }));

      setTasks(typedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Search tasks with advanced functionality
  const searchTasks = async (query: string): Promise<Task[]> => {
    if (!query.trim()) {
      return tasks;
    }

    const searchLower = query.toLowerCase();
    
    return tasks.filter(task => {
      // Search in title
      if (task.title.toLowerCase().includes(searchLower)) return true;
      
      // Search in description
      if (task.description?.toLowerCase().includes(searchLower)) return true;
      
      // Search in tags
      if (task.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;
      
      // Search in priority
      if (task.priority.toLowerCase().includes(searchLower)) return true;
      
      // Search in status
      if (task.status.toLowerCase().includes(searchLower)) return true;
      
      return false;
    });
  };

  // Chat with AI about tasks
  const chatWithAI = async (message: string): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-tasks', {
        body: {
          message,
          userId: user.id,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to get AI response');
      }

      return data.response || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  };

  // Create a new task
  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    if (!user) {
      toast.error('Please sign in to create tasks');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskData,
            user_id: user.id,
            status: 'pending' as Status,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        toast.error('Failed to create task');
        return null;
      }

      // Cast the returned data to proper Task type
      const newTask: Task = {
        ...data,
        priority: data.priority as Priority,
        status: data.status as Status,
        tags: data.tags || []
      };

      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  };

  // Update a task
  const updateTask = async (taskId: string, updates: UpdateTaskData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        return false;
      }

      // Cast the returned data to proper Task type
      const updatedTask: Task = {
        ...data,
        priority: data.priority as Priority,
        status: data.status as Status,
        tags: data.tags || []
      };

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
        return false;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    const isCompleted = task.status === 'completed';
    const updates: UpdateTaskData = {
      status: isCompleted ? 'pending' : 'completed',
      completed_at: isCompleted ? undefined : new Date().toISOString(),
    };

    return await updateTask(taskId, updates);
  };

  // Filter tasks
  const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      if (filters.status && !filters.status.includes(task.status)) return false;
      if (filters.priority && !filters.priority.includes(task.priority)) return false;
      if (filters.tags && !filters.tags.some(tag => task.tags.includes(tag))) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  };

  // Get tasks by status
  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks for today
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

  // Get important tasks
  const getImportantTasks = () => {
    return tasks.filter(task => 
      task.priority === 'high' || task.priority === 'urgent'
    );
  };

  // Get upcoming tasks
  const getUpcomingTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.due_date) return false;
      return new Date(task.due_date) > now;
    }).sort((a, b) => 
      new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    );
  };

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    filterTasks,
    searchTasks,
    chatWithAI,
    getTasksByStatus,
    getTasksForToday,
    getImportantTasks,
    getUpcomingTasks,
    refetch: fetchTasks,
  };
};
