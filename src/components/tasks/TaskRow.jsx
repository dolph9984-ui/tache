import StatusFlag from '../common/StatusFlag';
import { formatShortDate } from '../../utils/date';
import { PRIORITY } from '../../utils/meta';
import styles from './TaskRow.module.css';

export default function TaskRow({ task, onToggleDone, onPostpone, onOpen, showDate = false }) {
  const stateClass = task.status === 'done' ? styles.done : task.status === 'missed' ? styles.missed : '';
  const canPostpone = task.status === 'pending' || task.status === 'missed';
  const priorityMeta = PRIORITY[task.priority];

  return (
    <div className={`${styles.task} ${styles[task.priority] || ''} ${stateClass}`} onClick={() => onOpen(task)}>
      <button
        type="button"
        className={styles.check}
        onClick={(e) => { e.stopPropagation(); onToggleDone(task.id); }}
        aria-label="Marquer comme réalisée"
      >
        {task.status === 'done' ? '✓' : ''}
      </button>

      <div className={styles.content}>
        <div className={styles.primary}>
          <div className={styles.titleBlock}>
            <div className={styles.title}>{task.title}</div>
            {task.description?.trim() && (
              <div className={styles.noteExcerpt}>{task.description.trim()}</div>
            )}
          </div>

          <div className={styles.metaRow}>
            {showDate && (
              <span className={styles.metaItem}>{formatShortDate(task.date)}</span>
            )}
            <span className={styles.metaItem}>{task.time}</span>
            <span className={styles.metaItem}>{task.duration}</span>
            {priorityMeta && (
              <span
                className={styles.priorityTag}
                style={{ color: priorityMeta.color, background: priorityMeta.bg }}
              >
                {priorityMeta.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.side}>
        <StatusFlag status={task.status} postponed={task.postponed} />
        <div className={styles.actions}>
          {canPostpone && (
            <button
              type="button"
              className={styles.postpone}
              onClick={(e) => { e.stopPropagation(); onPostpone(task.id); }}
              title="Reporter cette tâche à demain"
            >
              Reporter
            </button>
          )}
          <span className={styles.chevron} aria-hidden="true">›</span>
        </div>
      </div>
    </div>
  );
}
