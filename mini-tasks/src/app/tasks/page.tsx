'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchTasks, createTask, deleteTask, updateTask } from '@/lib/api';
import { Task, TaskFormData } from '@/types';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import styles from './tasks.module.css';

type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done';

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  // Filtered tasks
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  // Status counts
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  // Create / Update
  const handleFormSubmit = async (data: TaskFormData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      setShowForm(false);
      setEditingTask(undefined);
      await loadTasks();
    } catch {
      setError('Failed to save task.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      await loadTasks();
    } catch {
      setError('Failed to delete task.');
    }
  };

  // Edit
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  if (authLoading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="page-container">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Tasks</h1>
          <p className={styles.subtitle}>{counts.all} total · {counts.done} completed</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => { setEditingTask(undefined); setShowForm(true); }}
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {(['all', 'todo', 'in-progress', 'done'] as FilterStatus[]).map((s) => (
          <button
            key={s}
            className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s === 'todo' ? 'To Do' : s === 'in-progress' ? 'In Progress' : 'Done'}
            <span className={styles.count}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Error */}
      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading tasks..." />
      ) : filteredTasks.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📋</p>
          <p className={styles.emptyText}>
            {filter === 'all'
              ? 'No tasks yet. Create your first one!'
              : `No ${filter === 'todo' ? 'to-do' : filter === 'in-progress' ? 'in-progress' : 'completed'} tasks.`}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingTask(undefined); }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}
