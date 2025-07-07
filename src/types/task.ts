export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'pending' | 'completed' | 'cancelled' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string; // ISO string from database
  completed_at?: string; // ISO string from database
  archived_at?: string; // ISO string from database
  created_at: string; // ISO string from database
  updated_at: string; // ISO string from database
  tags: string[];
  user_id: string;
  is_important?: boolean;
  is_archived?: boolean;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  tags?: string[];
  search?: string;
  isImportant?: boolean;
  isArchived?: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
  tags: string[];
  is_important?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  due_date?: string;
  tags?: string[];
  completed_at?: string;
  archived_at?: string;
  is_important?: boolean;
  is_archived?: boolean;
}
