import { useMemo, useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { dayLabel, todayISO } from '../../utils/date';
import DayGroupCard from '../common/DayGroupCard';
import styles from './ArchivesView.module.css';

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'done', label: 'Réalisées' },
  { key: 'missed', label: 'Non réalisées' },
];

export default function ArchivesView({ onOpenTask }) {
  const { tasks } = useTasks();
  const [filter, setFilter] = useState('all');
  const today = todayISO();

  const groups = useMemo(() => {
    const past = tasks.filter((t) => t.date < today);
    const byDate = new Map();
    past.forEach((t) => {
      if (!byDate.has(t.date)) byDate.set(t.date, []);
      byDate.get(t.date).push(t);
    });
    return [...byDate.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => {
        const doneCount = items.filter((i) => i.status === 'done').length;
        const missedCount = items.filter((i) => i.status === 'missed').length;
        const visible = items.filter((i) => filter === 'all' || i.status === filter);
        return { date, items: visible, doneCount, missedCount };
      })
      .filter((g) => g.items.length > 0);
  }, [tasks, today, filter]);

  return (
    <div className="viewInner">
      <h1>Archives</h1>
      <div className="dateLine">Historique des jours précédents</div>

      <div className={styles.chips}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.chip} ${filter === f.key ? styles.active : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {groups.map((g) => (
          <DayGroupCard
            key={g.date}
            grid
            showStatus
            label={dayLabel(g.date, today)}
            subLabel={`${g.doneCount} réalisée${g.doneCount > 1 ? 's' : ''} · ${g.missedCount} non réalisée${g.missedCount > 1 ? 's' : ''}`}
            items={g.items}
            onItemClick={(item) => onOpenTask('view', item)}
          />
        ))}
      </div>
      {groups.length === 0 && (
        <div className="emptyNote">
          <div className="emptyNoteTitle">Aucun résultat</div>
          <p className="emptyNoteDetail">Aucune tâche archivée ne correspond à ce filtre.</p>
        </div>
      )}
    </div>
  );
}
