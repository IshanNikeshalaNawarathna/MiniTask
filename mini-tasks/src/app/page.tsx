'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/tasks');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Mini Tasks</h1>
      <p className={styles.subtitle}>Simple, focused task management.</p>
    </div>
  );
}
