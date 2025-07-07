import React, { useState, useCallback, useEffect } from 'react';
import { X, Calendar, Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Priority, CreateTaskData } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: CreateTaskData) => Promise<void>;
  isCreating?: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = React.memo(({
  isOpen,
  onClose,
  onCreateTask,
  isCreating = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Memoized handlers
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Priority);
  }, []);

  const handleDueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  }, []);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting || isCreating) return;

    setIsSubmitting(true);
    
    try {
      await onCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, priority, dueDate, tags, isSubmitting, isCreating, onCreateTask, onClose]);

  const handleClose = useCallback(() => {
    if (!isSubmitting && !isCreating) {
      onClose();
    }
  }, [isSubmitting, isCreating, onClose]);

  if (!isOpen) return null;

  const isLoading = isSubmitting || isCreating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose} 
            disabled={isLoading}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter task title..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Add task description..."
              className="w-full resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                value={priority}
                onChange={handlePriorityChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                aria-label="Select task priority"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={handleDueDateChange}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="work, personal, urgent..."
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isCreating ? 'Creating...' : 'Creating...'}
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateTaskModal.displayName = 'CreateTaskModal';
