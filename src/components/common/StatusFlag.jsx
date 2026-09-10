import { POSTPONED, STATUS } from '../../utils/meta';
import styles from './StatusFlag.module.css';

/** Drapeau latéral coloré pour identifier le statut d'une tâche. */
export default function StatusFlag({ status, postponed = false }) {
  const meta = STATUS[status];
  if (!meta) return null;

  return (
    <div className={styles.wrap}>
      {postponed && (
        <span
          className={styles.flag}
          style={{ '--flag-bg': POSTPONED.bg, '--flag-color': POSTPONED.color }}
          title={POSTPONED.singular}
        >
          <span className={styles.icon}>{POSTPONED.icon}</span>
          <span className={styles.label}>{POSTPONED.singular}</span>
        </span>
      )}
      <span
        className={styles.flag}
        style={{ '--flag-bg': meta.bg, '--flag-color': meta.color }}
        title={meta.singular}
      >
        <span className={styles.icon}>{meta.icon}</span>
        <span className={styles.label}>{meta.singular}</span>
      </span>
    </div>
  );
}
