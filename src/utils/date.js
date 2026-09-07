// ---------- Helpers de date (tout en ISO "yyyy-mm-dd" en local, sans backend) ----------

export function todayISO() {
  return toISO(new Date());
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISO(iso) {
  // midi local pour éviter les décalages de fuseau horaire sur l'affichage
  return new Date(`${iso}T12:00:00`);
}

export function addDays(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function daysBetween(isoA, isoB) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((fromISO(isoB) - fromISO(isoA)) / msPerDay);
}

export function formatLongDate(iso) {
  return fromISO(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatShortDate(iso) {
  return fromISO(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Libellé très court pour l'axe d'un graphique ("jeu.", "ven."). */
export function weekdayShort(iso) {
  const label = fromISO(iso).toLocaleDateString('fr-FR', { weekday: 'short' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Libellé court "3 sept." pour l'axe d'un graphique. */
export function dayMonthShort(iso) {
  return fromISO(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** Étiquette humaine pour un groupe de jour ("Aujourd'hui", "Demain", ou date longue). */
export function dayLabel(iso, todayIso = todayISO()) {
  const diff = daysBetween(todayIso, iso);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  if (diff === -1) return 'Hier';
  return formatLongDate(iso);
}

export function currentHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function nowISO() {
  return todayISO();
}

/** Combine une date ISO + heure "HH:MM" en Date exploitable, ou null si l'heure est absente. */
export function toDateTime(iso, time) {
  if (!time || time === '—') return null;
  const dt = fromISO(iso);
  const [h, m] = time.split(':').map(Number);
  dt.setHours(h, m, 0, 0);
  return dt;
}
