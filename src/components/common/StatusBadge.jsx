import { STATUS } from '../../utils/meta';
import styles from './StatusBadge.module.css';

/** Petit badge coloré qui rend le statut d'une tâche immédiatement lisible. */
export default function StatusBadge({ status, compact = false }) {
  const meta = STATUS[status];
  if (!meta) return null;
  return (
    <span className={styles.badge} style={{ color: meta.color, background: meta.bg }}>
      <span className={styles.icon}>{meta.icon}</span>
      {!compact && meta.singular}
    </span>
  );
}
