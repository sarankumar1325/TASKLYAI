
import { useState, useEffect } from 'react';
import { Task, Priority, Status, TaskFilters } from '@/types/task';

// Mock data for initial development
const generateMockTasks = (): Task[] => [
  {
    id: '1',
    title: 'Design TaskFlowAI Dashboard',
    description: 'Create a modern, glassmorphism-styled dashboard with intuitive navigation and beautiful animations.',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2024-07-02'),
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-06-28'),
    tags: ['design', 'ui/ux', 'dashboard'],
    userId: 'user1',
  },
  {
    id: '2',
    title: 'Implement AI Integration',
    description: 'Integrate Google Gemini API for intelligent task suggestions and natural language queries.',
    priority: 'urgent',
    status: 'todo',
    dueDate: new Date('2024-07-05'),
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-06-28'),
    tags: ['ai', 'api', 'backend'],
    userId: 'user1',
  },
  {
    id: '3',
    title: 'Setup Authentication',
    description: 'Configure Clerk authentication with Google, GitHub, and Discord OAuth providers.',
    priority: 'medium',
    status: 'completed',
    createdAt: new Date('2024-06-27'),
    updatedAt: new Date('2024-06-28'),
    tags: ['auth', 'security'],
    userId: 'user1',
  },
  {
    id: '4',
    title: 'Write Documentation',
    description: 'Create comprehensive documentation for the TaskFlowAI application.',
    priority: 'low',
    status: 'todo',
    dueDate: new Date('2024-07-10'),
    createdAt: new Date('2024-06-28'),
    updatedAt: new Date('2024-06-28'),
    tags: ['documentation', 'readme'],
    userId: 'user1',
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setTasks(generateMockTasks());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const createTask = (taskData: {
    title: string;
    description: string;
    priority: Priority;
    dueDate?: Date;
    tags: string[];
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'todo' : 'completed',
            updatedAt: new Date()
          }
        : task
    ));
  };

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

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  };

  const getImportantTasks = () => {
    return tasks.filter(task => 
      task.priority === 'high' || task.priority === 'urgent'
    );
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) > now;
    }).sort((a, b) => 
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    );
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    filterTasks,
    getTasksByStatus,
    getTasksForToday,
    getImportantTasks,
    getUpcomingTasks,
  };
};
