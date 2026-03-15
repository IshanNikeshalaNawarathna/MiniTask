'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchTask, updateTask } from '@/lib/api';
import { Task, TaskFormData } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './edit.module.css';

export default function EditTaskPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskFormData['status']>('todo');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTask(taskId);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
      } catch {
        setError('Task not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateTask(taskId, { title, description, status });
      router.push('/tasks');
    } catch {
      setError('Failed to update task.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;
  if (!user) return null;
  if (!task && !loading) {
    return (
      <div className="page-container">
        <ErrorMessage message={error || 'Task not found'} />
        <button className={styles.backBtn} onClick={() => router.push('/tasks')}>
          ← Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => router.push('/tasks')}>
        ← Back to Tasks
      </button>

      <div className={styles.card}>
        <h1 className={styles.heading}>Edit Task</h1>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                color: 'var(--text)',
                background: 'var(--bg)',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-status">Status</label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskFormData['status'])}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                color: 'var(--text)',
                background: 'var(--bg)',
              }}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push('/tasks')}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving || !title.trim()} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
