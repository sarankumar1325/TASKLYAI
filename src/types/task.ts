
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'pending' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string; // ISO string from database
  completed_at?: string; // ISO string from database
  created_at: string; // ISO string from database
  updated_at: string; // ISO string from database
  tags: string[];
  user_id: string;
}

export interface TaskFilters {
  status?: Status[];
  priority?: Priority[];
  tags?: string[];
  search?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
  tags: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  due_date?: string;
  tags?: string[];
  completed_at?: string;
}
