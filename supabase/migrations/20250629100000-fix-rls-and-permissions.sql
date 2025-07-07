-- Re-enable Row Level Security on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for tasks table

-- Policy for authenticated users to view their own tasks
CREATE POLICY "authenticated_users_view_own_tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = auth.uid()::text
  );

-- Policy for authenticated users to create their own tasks
CREATE POLICY "authenticated_users_create_own_tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = auth.uid()::text
  );

-- Policy for authenticated users to update their own tasks
CREATE POLICY "authenticated_users_update_own_tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = auth.uid()::text
  );

-- Policy for authenticated users to delete their own tasks
CREATE POLICY "authenticated_users_delete_own_tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = auth.uid()::text
  );

-- Policy for service role (MCP server) to access all tasks
CREATE POLICY "service_role_full_access" 
  ON public.tasks 
  FOR ALL 
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- Grant necessary permissions to authenticated and service roles
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;

-- Ensure the table is accessible by the proper roles
GRANT USAGE ON SCHEMA public TO authenticated, service_role;

-- Add helpful comment
COMMENT ON TABLE tasks IS 'Tasks table with RLS enabled for multi-auth support (Clerk + Supabase Auth + Service Role)'; 