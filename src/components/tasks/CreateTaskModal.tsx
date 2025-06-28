
import React, { useState } from 'react';
import { X, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Priority, CreateTaskData } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: CreateTaskData) => Promise<void>;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags('');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-card w-full max-w-md animate-scale-in relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-geist">Create New Task</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-geist">
              Task Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="glass border-0 focus:ring-2 focus:ring-purple-500/50 font-geist"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-geist">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task description..."
              className="glass border-0 focus:ring-2 focus:ring-purple-500/50 resize-none font-geist"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-geist">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full glass border-0 rounded-lg p-2 focus:ring-2 focus:ring-purple-500/50 font-geist"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-geist">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass border-0 focus:ring-2 focus:ring-purple-500/50 font-geist"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-geist">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, urgent..."
              className="glass border-0 focus:ring-2 focus:ring-purple-500/50 font-geist"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 glass-button font-geist"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-geist"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
