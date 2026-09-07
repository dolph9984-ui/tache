import styles from './Fab.module.css';

export default function Fab({ onClick }) {
  return (
    <button className={styles.fab} aria-label="Nouvelle tâche" onClick={onClick}>+</button>
  );
}
