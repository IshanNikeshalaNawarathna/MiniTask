'use client';

import { useState, useEffect } from 'react';
import { TaskFormData, Task } from '@/types';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskFormData['status']>('todo');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, status });
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>
          {initialData ? 'Edit Task' : 'New Task'}
        </h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-title">Title</label>
          <input
            id="task-title"
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task (optional)"
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskFormData['status'])}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={isLoading || !title.trim()}>
            {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
