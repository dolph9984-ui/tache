import { useMemo, useRef, useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { addDays, formatLongDate, formatShortDate, normalizeRange, todayISO } from '../../utils/date';
import { STATUS_LIST, POSTPONED } from '../../utils/meta';
import { buildTrendBuckets, buildTrendBucketsForRange } from '../../utils/trend';
import TaskCalendar, { CalendarTrigger } from '../tasks/TaskCalendar';
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

function formatRangeLabel(from, to) {
  if (!from && !to) return null;
  if (from && !to) return `Du ${formatShortDate(from)} au …`;
  if (!from && to) return `Du ${formatShortDate(to)} au …`;
  const { from: f, to: t } = normalizeRange(from, to);
  if (f === t) return `Le ${formatShortDate(f)}`;
  return `Du ${formatShortDate(f)} au ${formatShortDate(t)}`;
}

export default function Dashboard({ onGoToTasks }) {
  const { tasks } = useTasks();
  const [period, setPeriod] = useState('jour');
  const [rangeFrom, setRangeFrom] = useState('');
  const [rangeTo, setRangeTo] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarBtnRef = useRef(null);
  const today = todayISO();

  const customRangeActive = !!(rangeFrom || rangeTo);

  const datesWithTasks = useMemo(
    () => [...new Set(tasks.map((t) => t.date))],
    [tasks],
  );

  const { lowerBound, upperBound } = useMemo(() => {
    if (customRangeActive) {
      const { from, to } = normalizeRange(rangeFrom, rangeTo);
      if (from && to) return { lowerBound: from, upperBound: to };
      const single = from || to;
      return { lowerBound: single, upperBound: single };
    }
    const days = PERIODS.find((p) => p.key === period).days;
    return { lowerBound: addDays(today, -(days - 1)), upperBound: today };
  }, [customRangeActive, rangeFrom, rangeTo, period, today]);

  const counts = useMemo(() => {
    const inRange = (date) => date >= lowerBound && date <= upperBound;
    const scoped = tasks.filter((t) => inRange(t.date));
    return {
      done: scoped.filter((t) => t.status === 'done').length,
      pending: scoped.filter((t) => t.status === 'pending').length,
      missed: scoped.filter((t) => t.status === 'missed').length,
      postponed: tasks.filter((t) => t.postponed && t.lastPostponedAt && inRange(t.lastPostponedAt)).length,
    };
  }, [tasks, lowerBound, upperBound]);

  const trendBuckets = useMemo(() => {
    if (customRangeActive) return buildTrendBucketsForRange(tasks, lowerBound, upperBound);
    return buildTrendBuckets(tasks, period, today);
  }, [tasks, period, today, customRangeActive, lowerBound, upperBound]);

  const streak = useMemo(() => computeStreak(tasks.filter((t) => t.date < today), today), [tasks, today]);

  const total = counts.done + counts.pending + counts.missed;
  const headline = total === 0
    ? "Aucune tâche sur cette période — c'est le moment d'en planifier une."
    : counts.missed === 0
      ? `${counts.done}/${total} tâche${total > 1 ? 's' : ''} réalisée${counts.done > 1 ? 's' : ''}, aucune non réalisée. Continuez comme ça.`
      : `${counts.missed} tâche${counts.missed > 1 ? 's' : ''} non réalisée${counts.missed > 1 ? 's' : ''} sur cette période — l'heure prévue est dépassée sans action.`;

  const periodLabel = customRangeActive
    ? (lowerBound === upperBound
      ? formatLongDate(lowerBound)
      : `Du ${formatLongDate(lowerBound)} au ${formatLongDate(upperBound)}`)
    : null;

  const calendarLabel = customRangeActive ? formatRangeLabel(rangeFrom, rangeTo) : null;

  const handleSelectRange = (from, to) => {
    setRangeFrom(from);
    setRangeTo(to);
  };

  const clearRange = () => {
    setRangeFrom('');
    setRangeTo('');
  };

  return (
    <div className="viewInner">
      <div className={styles.head}>
        <div>
          <h1>Bonjour</h1>
          <div className="dateLine">{formatLongDate(today)}</div>
        </div>
        <button className={styles.link} type="button" onClick={() => onGoToTasks('all')}>Voir mes tâches d'aujourd'hui</button>
      </div>

      <div className={styles.periodRow}>
        <div className={styles.periodTabs} role="tablist" aria-label="Période des statistiques">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={!customRangeActive && period === p.key}
              className={`${styles.periodTab} ${!customRangeActive && period === p.key ? styles.active : ''}`}
              onClick={() => {
                clearRange();
                setPeriod(p.key);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.calendarWrap}>
          <CalendarTrigger
            btnRef={calendarBtnRef}
            active={calendarOpen || customRangeActive}
            label={calendarLabel}
            onClick={() => setCalendarOpen((o) => !o)}
          />
          <TaskCalendar
            mode="range"
            open={calendarOpen}
            onClose={() => setCalendarOpen(false)}
            rangeFrom={rangeFrom}
            rangeTo={rangeTo}
            datesWithTasks={datesWithTasks}
            onSelectRange={handleSelectRange}
            anchorRef={calendarBtnRef}
          />
        </div>
      </div>

      {periodLabel && (
        <div className={styles.rangeHint}>Statistiques du {periodLabel}</div>
      )}

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

      <TrendChart buckets={trendBuckets} periodLabel={period === 'semaine' && !customRangeActive ? 'jour' : 'semaine'} />

      <div className={styles.foot}>
        Astuce : une tâche « Non réalisée » peut être reportée d'un clic depuis la vue Tâches, sans perdre son historique.
      </div>
    </div>
  );
}
