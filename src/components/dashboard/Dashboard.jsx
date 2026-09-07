import { useMemo, useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { addDays, formatLongDate, todayISO } from '../../utils/date';
import { STATUS_LIST, POSTPONED } from '../../utils/meta';
import { buildTrendBuckets } from '../../utils/trend';
import StatusDonut from './StatusDonut';
import TrendChart from './TrendChart';
import styles from './Dashboard.module.css';

const PERIODS = [
  { key: 'jour', label: 'Jour', days: 1 },
  { key: 'semaine', label: 'Semaine', days: 7 },
  { key: 'mois', label: 'Mois', days: 30 },
];

function computeStreak(tasks, today) {
  const byDate = new Map();
  tasks.forEach((t) => {
    if (!byDate.has(t.date)) byDate.set(t.date, { done: 0, missed: 0 });
    const day = byDate.get(t.date);
    if (t.status === 'missed') day.missed += 1;
    else if (t.status === 'done') day.done += 1;
  });
  let streak = 0;
  let cursor = addDays(today, -1);
  while (byDate.has(cursor)) {
    const day = byDate.get(cursor);
    if (day.missed > 0) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export default function Dashboard({ onGoToTasks }) {
  const { tasks } = useTasks();
  const [period, setPeriod] = useState('jour');
  const today = todayISO();

  const lowerBound = useMemo(() => addDays(today, -(PERIODS.find((p) => p.key === period).days - 1)), [today, period]);

  const counts = useMemo(() => {
    const scoped = tasks.filter((t) => t.date >= lowerBound && t.date <= today);
    return {
      done: scoped.filter((t) => t.status === 'done').length,
      pending: scoped.filter((t) => t.status === 'pending').length,
      missed: scoped.filter((t) => t.status === 'missed').length,
      postponed: tasks.filter((t) => t.postponed && t.lastPostponedAt >= lowerBound && t.lastPostponedAt <= today).length,
    };
  }, [tasks, lowerBound, today]);

  const trendBuckets = useMemo(() => buildTrendBuckets(tasks, period, today), [tasks, period, today]);

  const streak = useMemo(() => computeStreak(tasks.filter((t) => t.date < today), today), [tasks, today]);

  const total = counts.done + counts.pending + counts.missed;
  const headline = total === 0
    ? "Aucune tâche sur cette période — c'est le moment d'en planifier une."
    : counts.missed === 0
      ? `${counts.done}/${total} tâche${total > 1 ? 's' : ''} réalisée${counts.done > 1 ? 's' : ''}, aucune non réalisée. Continuez comme ça.`
      : `${counts.missed} tâche${counts.missed > 1 ? 's' : ''} non réalisée${counts.missed > 1 ? 's' : ''} sur cette période — l'heure prévue est dépassée sans action.`;

  return (
    <div className="viewInner">
      <div className={styles.head}>
        <div>
          <h1>Bonjour</h1>
          <div className="dateLine">{formatLongDate(today)}</div>
        </div>
        <button className={styles.link} onClick={() => onGoToTasks('all')}>Voir mes tâches d'aujourd'hui</button>
      </div>

      <div className={styles.periodTabs}>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`${styles.periodTab} ${period === p.key ? styles.active : ''}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.overview}>
        <StatusDonut counts={counts} />
        <div className={styles.overviewText}>
          <div className={styles.headline}>{headline}</div>
          {streak > 0 && (
            <div className={styles.streak}>🔥 {streak} jour{streak > 1 ? 's' : ''} sans tâche non réalisée</div>
          )}
        </div>
      </div>

      <div className={styles.statGrid}>
        {[...STATUS_LIST, POSTPONED].map((s) => (
          <div
            key={s.key}
            className={styles.statCard}
            style={{ background: s.bg, borderColor: s.color }}
            onClick={() => onGoToTasks(s.key)}
          >
            <div className={styles.statTop}>
              <span className={styles.statIcon} style={{ color: s.color }}>{s.icon}</span>
              <span className={styles.statLabel} style={{ color: s.color }}>{s.label}</span>
            </div>
            <div className={styles.statNum} style={{ color: 'var(--ink)' }}>{counts[s.key]}</div>
          </div>
        ))}
      </div>

      <TrendChart buckets={trendBuckets} periodLabel={period === 'semaine' ? 'jour' : 'semaine'} />

      <div className={styles.foot}>
        Astuce : une tâche « Non réalisée » peut être reportée d'un clic depuis la vue Tâches, sans perdre son historique.
      </div>
    </div>
  );
}
