'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✓</span> Mini Tasks
        </Link>

        <div className={styles.right}>
          {user ? (
            <>
              <Link href="/tasks" className={styles.navLink}>My Tasks</Link>
              <span className={styles.userName}>{user.name}</span>
              <button onClick={logout} className={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>Login</Link>
              <Link href="/register" className={styles.navLinkPrimary}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
