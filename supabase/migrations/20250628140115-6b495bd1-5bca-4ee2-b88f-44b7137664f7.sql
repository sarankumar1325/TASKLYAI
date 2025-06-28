
-- Create tasks table with proper user authentication
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  tags TEXT[] DEFAULT '{}',
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
