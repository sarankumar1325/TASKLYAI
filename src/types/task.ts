
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  userId: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface TaskFilters {
  status?: Status[];
  priority?: Priority[];
  tags?: string[];
  search?: string;
}
