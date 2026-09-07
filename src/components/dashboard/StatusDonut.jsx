import { STATUS_LIST } from '../../utils/meta';
import styles from './StatusDonut.module.css';

const SIZE = 176;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3; // px de fond visible entre deux tranches (repère "surface gap")

/** Anneau de statuts : le premier élément visuel du tableau de bord. */
export default function StatusDonut({ counts }) {
  const total = STATUS_LIST.reduce((sum, s) => sum + (counts[s.key] || 0), 0);
  const donePct = total ? Math.round(((counts.done || 0) / total) * 100) : 0;
  const segmentCount = STATUS_LIST.filter((s) => (counts[s.key] || 0) > 0).length;

  let cumulative = 0;
  const segments = STATUS_LIST.map((s) => {
    const value = counts[s.key] || 0;
    const fraction = total ? value / total : 0;
    const arcLength = fraction * CIRCUMFERENCE;
    // Pas de coupure quand une seule tranche occupe tout l'anneau.
    const visibleLength = segmentCount > 1 ? Math.max(0, arcLength - GAP) : arcLength;
    const seg = {
      key: s.key,
      color: s.color,
      dasharray: `${visibleLength} ${CIRCUMFERENCE}`,
      offset: -cumulative * CIRCUMFERENCE,
    };
    cumulative += fraction;
    return seg;
  });

  return (
    <div className={styles.wrap}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--surface-alt)" strokeWidth={STROKE} />
        {total > 0 && segments.map((seg) => (
          seg.dasharray.startsWith('0 ') ? null : (
            <circle
              key={seg.key}
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )
        ))}
      </svg>
      <div className={styles.center}>
        <div className={styles.pct}>{donePct}%</div>
        <div className={styles.label}>réalisé</div>
      </div>
    </div>
  );
}
