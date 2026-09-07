import { useEffect, useRef } from 'react';
import { toDateTime, todayISO } from '../utils/date';

const MAX_TIMEOUT = 2_147_483_647; // limite native de setTimeout

function notify(title, body, silent) {
  try {
    // eslint-disable-next-line no-new
    new Notification(title, { body, silent });
  } catch {
    // permission révoquée entre-temps, ou Notification indisponible
  }
}

function msUntil(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1);
  return target.getTime() - Date.now();
}

export function notificationsSupported() {
  return typeof Notification !== 'undefined';
}

export function requestNotificationPermission() {
  if (!notificationsSupported()) return Promise.resolve('unsupported');
  return Notification.requestPermission();
}

/**
 * Programme les rappels par tâche et le récapitulatif quotidien, en
 * respectant les Paramètres. Tout tourne côté navigateur (setTimeout) :
 * les rappels ne se déclenchent que si cet onglet reste ouvert — limite
 * assumée d'une maquette sans backend/push.
 */
export function useReminders(tasks, settings) {
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // Rappels par tâche du jour.
  useEffect(() => {
    if (!settings.remindersEnabled || !notificationsSupported() || Notification.permission !== 'granted') return;

    const today = todayISO();
    const now = Date.now();
    const minutesBefore = settings.reminderMinutesBefore;
    const ids = tasks
      .filter((t) => t.date === today && t.status === 'pending')
      .map((t) => {
        const dt = toDateTime(t.date, t.time);
        if (!dt) return null;
        const delay = dt.getTime() - minutesBefore * 60_000 - now;
        if (delay <= 0 || delay > MAX_TIMEOUT) return null;
        return setTimeout(() => {
          notify(`Rappel : ${t.title}`, `Prévue à ${t.time} · dans ${minutesBefore} min`, !settings.notificationSound);
        }, delay);
      })
      .filter(Boolean);

    return () => ids.forEach(clearTimeout);
  }, [tasks, settings.remindersEnabled, settings.reminderMinutesBefore, settings.notificationSound]);

  // Récapitulatif quotidien, se reprogramme lui-même chaque jour.
  useEffect(() => {
    if (!settings.dailyRecapEnabled || !notificationsSupported() || Notification.permission !== 'granted') return undefined;

    let timeoutId;
    const schedule = () => {
      const delay = msUntil(settings.dailyRecapTime);
      if (delay == null) return;
      timeoutId = setTimeout(() => {
        const pendingToday = tasksRef.current.filter((t) => t.date === todayISO() && t.status === 'pending').length;
        const body = pendingToday
          ? `${pendingToday} tâche${pendingToday > 1 ? 's' : ''} à faire aujourd'hui.`
          : 'Aucune tâche à faire pour le moment — belle journée.';
        notify('Récapitulatif du jour', body, !settings.notificationSound);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [settings.dailyRecapEnabled, settings.dailyRecapTime, settings.notificationSound]);
}
