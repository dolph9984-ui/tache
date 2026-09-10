import { useMemo, useRef, useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { dayLabel, formatLongDate, todayISO } from '../../utils/date';
import { PRIORITY } from '../../utils/meta';
import TaskCalendar, { CalendarTrigger } from './TaskCalendar';
import TaskRow from './TaskRow';
import styles from './TasksView.module.css';

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'À faire' },
  { key: 'done', label: 'Réalisées' },
  { key: 'missed', label: 'Non réalisées' },
  { key: 'postponed', label: 'Reportées' },
];

function matchesFilter(task, filter) {
  if (filter === 'all') return true;
  if (filter === 'postponed') return !!task.postponed;
  return task.status === filter;
}

function sortTasks(list, sort) {
  return [...list].sort((a, b) => {
    if (sort === 'time') return a.time.localeCompare(b.time);
    const order = PRIORITY[a.priority].order - PRIORITY[b.priority].order;
    if (order !== 0) return order;
    return a.time.localeCompare(b.time);
  });
}

export default function TasksView({ initialFilter, searchQuery = '', onOpenTask }) {
  const { tasks, toggleDone, postponeToTomorrow } = useTasks();
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [sort, setSort] = useState('priority');
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarBtnRef = useRef(null);

  const today = todayISO();
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const datesWithTasks = useMemo(
    () => [...new Set(tasks.map((t) => t.date))],
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    const scoped = isSearching
      ? tasks
      : tasks.filter((t) => t.date === selectedDate);

    const filtered = scoped.filter((t) => matchesFilter(t, filter));

    if (isSearching) {
      const matched = filtered.filter((t) => {
        const hay = `${t.title} ${t.description || ''}`.toLowerCase();
        return hay.includes(trimmedQuery);
      });
      return sortTasks(matched, sort).sort((a, b) => a.date.localeCompare(b.date) || 0);
    }

    return sortTasks(filtered, sort);
  }, [tasks, isSearching, selectedDate, filter, sort, trimmedQuery]);

  const remainingOnDay = tasks.filter((t) => t.date === selectedDate && t.status !== 'done').length;

  const sectionTitle = isSearching
    ? 'Résultats'
    : dayLabel(selectedDate, today);

  const emptyCopy = isSearching
    ? { title: 'Aucun résultat', detail: 'Essayez un autre mot-clé ou vérifiez l\'orthographe.' }
    : filter === 'all'
      ? { title: 'Journée libre', detail: `Aucune tâche prévue pour ${formatLongDate(selectedDate).toLowerCase()}.` }
      : { title: 'Aucun résultat', detail: 'Aucune tâche ne correspond à ce filtre.' };

  return (
    <div className="viewInner">
      <header className={styles.head}>
        <div className={styles.headMain}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>{sectionTitle}</h1>
            {!isSearching && selectedDate !== today && (
              <button
                type="button"
                className={styles.todayLink}
                onClick={() => setSelectedDate(today)}
              >
                Aujourd&apos;hui
              </button>
            )}
          </div>
          <div className="dateLine">
            {isSearching
              ? `${visibleTasks.length} tâche${visibleTasks.length > 1 ? 's' : ''} trouvée${visibleTasks.length > 1 ? 's' : ''}`
              : formatLongDate(selectedDate)}
          </div>
        </div>

        <div className={styles.headActions}>
          {!isSearching && (
            <div className={styles.countBadge}>
              {remainingOnDay} restante{remainingOnDay > 1 ? 's' : ''}
            </div>
          )}
          <div className={styles.calendarWrap}>
            <CalendarTrigger
              btnRef={calendarBtnRef}
              active={calendarOpen}
              onClick={() => setCalendarOpen((o) => !o)}
            />
            <TaskCalendar
              open={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              selectedDate={selectedDate}
              datesWithTasks={datesWithTasks}
              onSelectDate={setSelectedDate}
              anchorRef={calendarBtnRef}
            />
          </div>
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

      <section className={styles.section}>
        <div className={styles.list}>
          {visibleTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              showDate={isSearching || t.date !== selectedDate}
              onToggleDone={toggleDone}
              onPostpone={postponeToTomorrow}
              onOpen={(task) => onOpenTask('edit', task)}
            />
          ))}
          {visibleTasks.length === 0 && (
            <div className="emptyNote">
              <div className="emptyNoteTitle">{emptyCopy.title}</div>
              <p className="emptyNoteDetail">{emptyCopy.detail}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
