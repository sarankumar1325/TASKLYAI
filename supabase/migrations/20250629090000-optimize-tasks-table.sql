-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_is_important ON tasks(is_important);
CREATE INDEX IF NOT EXISTS idx_tasks_is_archived ON tasks(is_archived);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_important ON tasks(user_id, is_important);
CREATE INDEX IF NOT EXISTS idx_tasks_user_archived ON tasks(user_id, is_archived);

-- Full-text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_tasks_title_gin ON tasks USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_tasks_description_gin ON tasks USING gin(to_tsvector('english', description));

-- Add constraints for data integrity
ALTER TABLE tasks 
ADD CONSTRAINT check_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD CONSTRAINT check_status CHECK (status IN ('pending', 'completed', 'archived')),
ADD CONSTRAINT check_due_date_future CHECK (due_date IS NULL OR due_date >= created_at);

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'User tasks with AI-powered management features';
COMMENT ON COLUMN tasks.user_id IS 'Reference to the user who owns this task';
COMMENT ON COLUMN tasks.title IS 'Task title - required field';
COMMENT ON COLUMN tasks.description IS 'Optional task description';
COMMENT ON COLUMN tasks.priority IS 'Task priority level: low, medium, high, urgent';
COMMENT ON COLUMN tasks.status IS 'Task status: pending, completed, archived';
COMMENT ON COLUMN tasks.due_date IS 'Optional due date for the task';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for categorizing tasks';
COMMENT ON COLUMN tasks.is_important IS 'Flag to mark important tasks';
COMMENT ON COLUMN tasks.is_archived IS 'Flag to mark archived tasks'; 