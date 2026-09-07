import { addDays, todayISO } from '../utils/date';

// ---------- Jeu de données de démonstration ----------
// Un seul tableau de tâches, chacune datée en ISO. "Aujourd'hui", "À venir"
// et "Archives" ne sont que des filtres sur ce tableau par rapport à la
// date du jour — plus de listes parallèles à synchroniser à la main.
let nextId = 1;
const id = () => nextId++;

export function createSeedTasks() {
  const today = todayISO();
  const d = (offset) => addDays(today, offset);

  return [
    // Aujourd'hui
    { id: id(), title: 'Envoyer le rapport client', description: "Compiler les chiffres de la semaine et l'envoyer à l'équipe direction avant midi.", date: d(0), time: '08:30', duration: '20 min', priority: 'urgent', status: 'missed' },
    { id: id(), title: 'Réviser le chapitre 3', description: 'Relire les notes de cours et refaire les exercices 4 à 9.', date: d(0), time: '10:00', duration: '45 min', priority: 'important', status: 'done' },
    { id: id(), title: 'Appeler la banque', description: 'Demander où en est le virement envoyé la semaine dernière.', date: d(0), time: '14:00', duration: '15 min', priority: 'urgent', status: 'pending' },
    { id: id(), title: 'Ranger le bureau', description: '', date: d(0), time: '17:30', duration: '20 min', priority: 'normale', status: 'pending', postponed: true, lastPostponedAt: d(-1) },
    { id: id(), title: 'Lire 10 pages', description: "Reprendre le roman là où je m'étais arrêté, chapitre 6.", date: d(0), time: '21:00', duration: '30 min', priority: 'normale', status: 'pending' },

    // À venir
    { id: id(), title: 'Préparer la présentation', description: 'Finaliser les 12 slides et répéter une fois à voix haute.', date: d(1), time: '09:00', duration: '1 h', priority: 'important', status: 'pending' },
    { id: id(), title: 'Rendez-vous dentiste', description: '', date: d(1), time: '16:30', duration: '30 min', priority: 'urgent', status: 'pending' },
    { id: id(), title: 'Livrer le rapport mensuel', description: 'Version finale à envoyer au responsable avant 11h.', date: d(2), time: '11:00', duration: '20 min', priority: 'urgent', status: 'pending' },
    { id: id(), title: 'Réunion de suivi de projet', description: '', date: d(5), time: '10:00', duration: '45 min', priority: 'normale', status: 'pending' },

    // Archives (jours passés)
    { id: id(), title: "Préparer la réunion d'équipe", description: "Slides + ordre du jour envoyés à l'équipe.", date: d(-1), time: '09:00', duration: '30 min', priority: 'important', status: 'done' },
    { id: id(), title: 'Payer la facture internet', description: '', date: d(-1), time: '12:00', duration: '5 min', priority: 'normale', status: 'done' },
    { id: id(), title: 'Trier les e-mails en retard', description: 'Boîte de réception à vider, environ 40 messages.', date: d(-1), time: '15:00', duration: '40 min', priority: 'normale', status: 'missed', postponed: true, lastPostponedAt: d(-2) },

    { id: id(), title: 'Sortir courir 30 min', description: '', date: d(-2), time: '07:00', duration: '30 min', priority: 'normale', status: 'done' },
    { id: id(), title: 'Appeler grand-mère', description: '', date: d(-2), time: '19:00', duration: '15 min', priority: 'important', status: 'done' },

    { id: id(), title: 'Réviser le budget du mois', description: 'Comparer les dépenses réelles au prévisionnel.', date: d(-3), time: '10:00', duration: '30 min', priority: 'important', status: 'missed', postponed: true, lastPostponedAt: d(-3) },
    { id: id(), title: 'Nettoyer la voiture', description: '', date: d(-3), time: '14:00', duration: '30 min', priority: 'normale', status: 'missed' },
    { id: id(), title: 'Lire un chapitre', description: '', date: d(-3), time: '21:00', duration: '20 min', priority: 'normale', status: 'done' },
  ];
}

export function nextTaskId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export const DEFAULT_SETTINGS = {
  theme: 'system', // 'system' | 'light' | 'dark'
  remindersEnabled: false,
  reminderMinutesBefore: 15,
  dailyRecapEnabled: false,
  dailyRecapTime: '08:00',
  notificationSound: true,
  defaultPriority: 'normale',
  defaultSort: 'priority', // 'priority' | 'time'
  defaultDurationUnit: 'min',
};
