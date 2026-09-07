import { STATUS, POSTPONED } from '../../utils/meta';
import styles from './TrendChart.module.css';

const SERIES = [
  { key: 'done', cls: 'done' },
  { key: 'pending', cls: 'pending' },
  { key: 'missed', cls: 'missed' },
];

/**
 * Répartition des statuts jour par jour (ou semaine par semaine) sur la
 * période choisie, avec un repère pour les tâches reportées — un second
 * diagramme qui complète l'anneau du dessus en montrant l'évolution dans
 * le temps plutôt qu'un instantané.
 */
export default function TrendChart({ buckets, periodLabel }) {
  if (!buckets.length) return null;
  const maxTotal = Math.max(1, ...buckets.map((b) => b.done + b.pending + b.missed));

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Répartition par {periodLabel}</div>

      <div className={styles.chart}>
        {buckets.map((b, i) => {
          const total = b.done + b.pending + b.missed;
          return (
            <div className={styles.col} key={i}>
              {b.postponed > 0 && <span className={styles.dot} title={`${b.postponed} tâche${b.postponed > 1 ? 's' : ''} reportée${b.postponed > 1 ? 's' : ''}`} />}
              {total === 0 ? (
                <div className={styles.empty} />
              ) : (
                <div className={styles.bar} style={{ height: `${(total / maxTotal) * 100}%` }} title={`${b.label} — ${b.done} réalisée(s), ${b.pending} à faire, ${b.missed} non réalisée(s)`}>
                  {SERIES.filter((s) => b[s.key] > 0).map((s) => (
                    <div
                      key={s.key}
                      className={`${styles.seg} ${styles[s.cls]}`}
                      style={{ flex: b[s.key] }}
                    />
                  ))}
                </div>
              )}
              <div className={styles.label}>{b.label}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        {SERIES.map((s) => (
          <span className={styles.legendItem} key={s.key}>
            <span className={styles.swatch} style={{ background: STATUS[s.key].color }} />
            {STATUS[s.key].label}
          </span>
        ))}
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.dot}`} style={{ background: POSTPONED.color }} />
          {POSTPONED.label}
        </span>
      </div>
    </div>
  );
}
