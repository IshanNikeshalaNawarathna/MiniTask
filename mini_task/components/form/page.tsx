'use client';

import { useState, useEffect } from 'react';
import { TaskFormData, Task, User } from '@/types';
import styles from './TaskForm.module.css';


interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskFormData['status']>('TODO');
  const [priority, setPriority] = useState<TaskFormData['priority']>('MEDIUM');
  const [dueDate, setDueDate] = useState<string>(''); // ✅ NEW
  const [users, setUsers] = useState<User[]>([]);


  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
      setPriority(initialData.priority);

      // format dueDate if exists
      if (initialData.dueDate) {
        setDueDate(initialData.dueDate);
      }
    }
  }, [initialData]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: TaskFormData = {
      title,
      description,
      status,
      priority, 
      dueDate: dueDate ? dueDate : null,
    };

    console.log('📝 Form submit data:', formData);

    await onSubmit(formData);
  };

  const selectClass =
    'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form
        className={styles.form}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.heading}>
          {initialData ? 'Edit Task' : 'New Task'}
        </h2>

        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={selectClass}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TaskFormData['status'])
            }
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <select
            className={selectClass}
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TaskFormData['priority'])
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Due Date ✅ */}
        <div className={styles.field}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* Assignee */}
        {/* <div className={styles.field}>
          <label className={styles.label}>Assignee</label>
          <select
            className={selectClass}
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div> */}

        {/* Buttons */}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}