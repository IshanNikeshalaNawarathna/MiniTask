'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from '@/lib/api';
import { Task, TaskFormData } from '@/types';
import TaskCard from '@/components/card/page';
import TaskForm from '@/components/form/page';
import styles from './tasks.module.css';

type FilterStatus = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const role = (user?.role || 'USER').toUpperCase();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  // ✅ LOAD TASKS (single source of truth)
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetchTasks(
        page,
        5,
        filter === 'ALL' ? undefined : filter
      );

      setTasks(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  // ✅ Initial load
  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  // ✅ POLLING (fixed)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadTasks(); // ✅ correct
    }, 5000); // 5s is better

    return () => clearInterval(interval);
  }, [user, loadTasks]);

  // ✅ FILTER COUNTS
  const counts: Record<FilterStatus, number> = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  const filteredTasks =
    filter === 'ALL'
      ? tasks
      : tasks.filter((t) => t.status === filter);

  // ✅ CREATE / UPDATE
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
      loadTasks();
    } catch {
      setError('Failed to save task.');
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ DELETE (optimistic)
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    const prevTasks = tasks;

    // instant UI update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
    } catch {
      setError('Failed to delete task.');
      setTasks(prevTasks); // rollback
    }
  };

  // ✅ EDIT
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // ✅ MARK DONE (optimistic 🚀)
  const handleDone = async (id: string) => {
    const prevTasks = tasks;

    // instant UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'DONE' } : t
      )
    );

    try {
      await updateTask(id, { status: 'DONE' });
    } catch {
      setError('Failed to mark task as done.');
      setTasks(prevTasks); // rollback
    }
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  if (!user) return null;

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Tasks</h1>
          <p className={styles.subtitle}>
            {counts.ALL} total · {counts.DONE} completed
          </p>
        </div>

        {role === 'ADMIN' && (
          <button className={styles.addBtn} onClick={handleCreate}>
            + New Task
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as FilterStatus[]).map((s) => (
          <button
            key={s}
            className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
            onClick={() => {
              setPage(0);
              setFilter(s);
            }}
          >
            {s === 'ALL'
              ? 'All'
              : s === 'TODO'
              ? 'To Do'
              : s === 'IN_PROGRESS'
              ? 'In Progress'
              : 'Done'}

            <span className={styles.count}>{counts[s]}</span>
          </button>
        ))}
      </div>


      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📋</p>
          <p className={styles.emptyText}>No tasks found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              role={role}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDone={handleDone}
              onCreate={handleCreate}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(undefined);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}