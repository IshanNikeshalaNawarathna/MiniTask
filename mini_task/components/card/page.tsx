'use client';

import { Task } from '@/types';
import styles from './TaskCard.module.css';
import { updateTaskStatus } from '@/lib/api';
import { useEffect } from 'react';

type Role = 'USER' | 'ADMIN';

interface TaskCardProps {
  task: Task;
  role: Role;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDone: (taskId: string) => void;
  onCreate: () => void;
}

const statusLabels: Record<Task['status'], string> = {
  'TODO': 'To Do',
  'IN_PROGRESS': 'In Progress',
  'DONE': 'Done',
};



export default function TaskCard({
  task,
  role,
  onEdit,
  onDelete,
  onDone,
  onCreate,
}: TaskCardProps) {
  return (
    <div className={styles.card}>

      {/* HEADER */}
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={`${styles.badge} ${styles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {/* DESCRIPTION */}
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {/* FOOTER */}
      <div className={styles.footer}>
        <span className={styles.date}>
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>

        {/* ACTIONS */}
        <div className={styles.actions}>

          {/* USER */}
          {role === 'USER' && task.status !== 'DONE' && (
            <button
              className={`${styles.btn} ${styles.doneBtn}`}
              onClick={() => updateTaskStatus(task.id).then(() => onDone(task.id))}
            >
              Done
            </button>
          )}

          {/* ADMIN */}
          {role === 'ADMIN' && (
            <>
              <button
                className={`${styles.btn} ${styles.editBtn}`}
                onClick={() => onEdit(task)}
              >
                Edit
              </button>

              <button
                className={`${styles.btn} ${styles.deleteBtn}`}
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>

              <button
                className={`${styles.btn} ${styles.createBtn}`}
                onClick={onCreate}
              >
                Create
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}