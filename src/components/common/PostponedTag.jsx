import { POSTPONED } from '../../utils/meta';
import styles from './StatusBadge.module.css';

/** Petit repère pour une tâche qui a été reportée au moins une fois. */
export default function PostponedTag({ compact = true }) {
  return (
    <span className={styles.badge} style={{ color: POSTPONED.color, background: POSTPONED.bg }} title="Cette tâche a été reportée">
      <span className={styles.icon}>{POSTPONED.icon}</span>
      {!compact && POSTPONED.singular}
    </span>
  );
}
