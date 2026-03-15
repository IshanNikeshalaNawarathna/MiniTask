import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
