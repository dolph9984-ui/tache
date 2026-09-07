import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createSeedTasks, nextTaskId } from '../data/seed';
import { addDays, currentHHMM, todayISO } from '../utils/date';

const TasksContext = createContext(null);

/**
 * Une tâche encore "pending" dont la date/heure est passée devient
 * automatiquement "missed" — c'est ce qui fait vivre les statuts au fil
 * du temps plutôt que de dépendre d'un état figé au chargement.
 */
function normalize(tasks) {
  const today = todayISO();
  const now = currentHHMM();
  let changed = false;
  const next = tasks.map((t) => {
    if (t.status !== 'pending') return t;
    const isPastDay = t.date < today;
    const isTodayPastTime = t.date === today && t.time && t.time !== '—' && t.time <= now;
    if (isPastDay || isTodayPastTime) {
      changed = true;
      return { ...t, status: 'missed' };
    }
    return t;
  });
  return changed ? next : tasks;
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('faitapp.tasks.v1', createSeedTasks);

  // Normalise au montage, puis toutes les 30s (une tâche du jour peut
  // franchir son heure pendant que l'app reste ouverte).
  useEffect(() => {
    setTasks((prev) => normalize(prev));
    const t = setInterval(() => setTasks((prev) => normalize(prev)), 30_000);
    return () => clearInterval(t);
  }, [setTasks]);

  const addTask = useCallback((fields) => {
    setTasks((prev) => [...prev, { id: nextTaskId(prev), status: 'pending', ...fields }]);
  }, [setTasks]);

  const updateTask = useCallback((id, fields) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } : t)));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  const toggleDone = useCallback((id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      return { ...t, status: t.status === 'done' ? 'pending' : 'done' };
    }));
  }, [setTasks]);

  /**
   * Reporte une tâche "à faire" ou "non réalisée" à demain, même heure.
   * Garde une trace (`postponed` + `lastPostponedAt`) pour que le
   * tableau de bord puisse continuer à la signaler, même une fois
   * redevenue une tâche "à faire" normale.
   */
  const postponeToTomorrow = useCallback((id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      return { ...t, date: addDays(todayISO(), 1), status: 'pending', postponed: true, lastPostponedAt: todayISO() };
    }));
  }, [setTasks]);

  const resetDemo = useCallback(() => {
    setTasks(createSeedTasks());
  }, [setTasks]);

  const value = useMemo(() => ({
    tasks, addTask, updateTask, deleteTask, toggleDone, postponeToTomorrow, resetDemo,
  }), [tasks, addTask, updateTask, deleteTask, toggleDone, postponeToTomorrow, resetDemo]);

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
}
