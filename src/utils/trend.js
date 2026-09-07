import { addDays, dayMonthShort, weekdayShort } from './date';

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

  return ranges.map((r) => {
    const inRange = (date) => date >= r.from && date <= r.to;
    const scoped = tasks.filter((t) => inRange(t.date));
    return {
      label: r.label,
      done: scoped.filter((t) => t.status === 'done').length,
      pending: scoped.filter((t) => t.status === 'pending').length,
      missed: scoped.filter((t) => t.status === 'missed').length,
      postponed: tasks.filter((t) => t.postponed && t.lastPostponedAt && inRange(t.lastPostponedAt)).length,
    };
  });
}
