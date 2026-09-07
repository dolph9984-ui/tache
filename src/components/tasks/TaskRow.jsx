import StatusBadge from '../common/StatusBadge';
import PostponedTag from '../common/PostponedTag';
import styles from './TaskRow.module.css';

export default function TaskRow({ task, onToggleDone, onPostpone, onOpen }) {
  const stateClass = task.status === 'done' ? styles.done : task.status === 'missed' ? styles.missed : '';
  const canPostpone = task.status === 'pending' || task.status === 'missed';

  return (
    <div className={`${styles.task} ${styles[task.priority] || ''} ${stateClass}`} onClick={() => onOpen(task)}>
      <button
        className={styles.check}
        onClick={(e) => { e.stopPropagation(); onToggleDone(task.id); }}
        aria-label="Marquer comme réalisée"
      >
        {task.status === 'done' ? '✓' : ''}
      </button>

      <div className={styles.body}>
        <div className={styles.title}>{task.title}</div>
        <div className={styles.meta}>{task.time} · {task.duration}</div>
      </div>

      {task.postponed && <PostponedTag />}
      {task.status === 'missed' && <StatusBadge status="missed" compact={false} />}

      {canPostpone && (
        <button
          className={styles.postpone}
          onClick={(e) => { e.stopPropagation(); onPostpone(task.id); }}
          title="Reporter cette tâche à demain"
        >
          Reporter →
        </button>
      )}

      <div className={styles.chevron}>›</div>
    </div>
  );
}
