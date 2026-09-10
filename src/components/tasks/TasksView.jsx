import { useMemo, useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { dayLabel, formatLongDate, todayISO } from '../../utils/date';
import { PRIORITY } from '../../utils/meta';
import DayGroupCard from '../common/DayGroupCard';
import TaskRow from './TaskRow';
import styles from './TasksView.module.css';

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'À faire' },
  { key: 'done', label: 'Réalisées' },
  { key: 'missed', label: 'Non réalisées' },
  { key: 'postponed', label: 'Reportées' },
];

export default function TasksView({ initialFilter, onOpenTask }) {
  const { tasks, toggleDone, postponeToTomorrow } = useTasks();
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [sort, setSort] = useState('priority');

  const today = todayISO();

  const todayTasks = useMemo(() => {
    const filtered = tasks
      .filter((t) => t.date === today)
      .filter((t) => {
        if (filter === 'all') return true;
        if (filter === 'postponed') return !!t.postponed;
        return t.status === filter;
      });
    return [...filtered].sort((a, b) => (
      sort === 'time' ? a.time.localeCompare(b.time) : PRIORITY[a.priority].order - PRIORITY[b.priority].order
    ));
  }, [tasks, today, filter, sort]);

  const upcomingGroups = useMemo(() => {
    const future = tasks.filter((t) => t.date > today);
    const byDate = new Map();
    future.forEach((t) => {
      if (!byDate.has(t.date)) byDate.set(t.date, []);
      byDate.get(t.date).push(t);
    });
    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, items]) => ({
        date,
        label: dayLabel(date, today),
        items: [...items].sort((a, b) => a.time.localeCompare(b.time)),
      }));
  }, [tasks, today]);

  const remaining = tasks.filter((t) => t.date === today && t.status !== 'done').length;

  return (
    <div className="viewInner">
      <header className={styles.head}>
        <div className={styles.headMain}>
          <h1>Tâches</h1>
          <div className="dateLine">{formatLongDate(today)}</div>
        </div>
        <div className={styles.countBadge}>
          {remaining} restante{remaining > 1 ? 's' : ''}
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.chips} role="tablist" aria-label="Filtrer les tâches">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`${styles.chip} ${filter === f.key ? styles.active : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={styles.sortRow}>
          <span className={styles.sortLabel}>Trier</span>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.sortBtn} ${sort === 'priority' ? styles.active : ''}`}
              onClick={() => setSort('priority')}
            >
              Priorité
            </button>
            <button
              type="button"
              className={`${styles.sortBtn} ${sort === 'time' ? styles.active : ''}`}
              onClick={() => setSort('time')}
            >
              Heure
            </button>
          </div>
        </div>
      </div>

      <div className={styles.columns}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Aujourd'hui</h2>
            <span className={styles.sectionMeta}>{todayTasks.length} tâche{todayTasks.length > 1 ? 's' : ''}</span>
          </div>

          <div className={styles.list}>
            {todayTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onToggleDone={toggleDone}
                onPostpone={postponeToTomorrow}
                onOpen={(task) => onOpenTask('edit', task)}
              />
            ))}
          </div>
          {todayTasks.length === 0 && (
            <div className={styles.emptyNote}>Aucune tâche ne correspond à ce filtre.</div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>À venir</h2>
            <span className={styles.sectionMeta}>
              {upcomingGroups.length} jour{upcomingGroups.length > 1 ? 's' : ''}
            </span>
          </div>

          {upcomingGroups.length === 0 && (
            <div className={styles.emptyNote}>Rien de programmé pour l'instant.</div>
          )}
          <div className={styles.upcomingList}>
            {upcomingGroups.map((g) => (
              <DayGroupCard
                key={g.date}
                label={g.label}
                subLabel={`${g.items.length} tâche${g.items.length > 1 ? 's' : ''}`}
                items={g.items}
                onItemClick={(item) => onOpenTask('edit', item)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
