import { addDays, dayMonthShort, daysBetween, weekdayShort } from './date';

/**
 * Construit les segments (jours ou semaines) affichés par le graphique de
 * tendance du tableau de bord, avec pour chacun le nombre de tâches par
 * statut ET le nombre de tâches reportées pendant ce segment (comptées par
 * date de report `lastPostponedAt`, pas par date de la tâche elle-même).
 */
export function buildTrendBuckets(tasks, period, today) {
  if (period === 'jour') return [];

  const ranges = period === 'semaine'
    ? Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i - 6);
      return { from: date, to: date, label: weekdayShort(date) };
    })
    : Array.from({ length: 5 }, (_, i) => {
      const from = addDays(today, (i - 5) * 6 + 1);
      const to = i === 4 ? today : addDays(from, 5);
      return { from, to, label: dayMonthShort(from) };
    });

  return ranges.map((r) => bucketForRange(tasks, r.from, r.to, r.label));
}

function bucketForRange(tasks, from, to, label) {
  const inRange = (date) => date >= from && date <= to;
  const scoped = tasks.filter((t) => inRange(t.date));
  return {
    label,
    done: scoped.filter((t) => t.status === 'done').length,
    pending: scoped.filter((t) => t.status === 'pending').length,
    missed: scoped.filter((t) => t.status === 'missed').length,
    postponed: tasks.filter((t) => t.postponed && t.lastPostponedAt && inRange(t.lastPostponedAt)).length,
  };
}

/** Segments pour une plage personnalisée (tableau de bord). */
export function buildTrendBucketsForRange(tasks, from, to) {
  const span = daysBetween(from, to) + 1;
  if (span <= 1) return [];

  if (span <= 14) {
    return Array.from({ length: span }, (_, i) => {
      const date = addDays(from, i);
      return bucketForRange(tasks, date, date, span <= 7 ? weekdayShort(date) : dayMonthShort(date));
    });
  }

  const bucketCount = Math.min(5, Math.ceil(span / 7));
  const chunk = Math.ceil(span / bucketCount);
  return Array.from({ length: bucketCount }, (_, i) => {
    const segFrom = addDays(from, i * chunk);
    const segTo = i === bucketCount - 1 ? to : addDays(from, (i + 1) * chunk - 1);
    return bucketForRange(tasks, segFrom, segTo, dayMonthShort(segFrom));
  });
}
