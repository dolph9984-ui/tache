// ---------- Métadonnées partagées : priorités et statuts ----------
// Un seul endroit pour libellés/couleurs/ordre : évite les libellés
// divergents ("en cours" vs "à faire") dispersés dans les composants.

export const PRIORITY = {
  urgent: { key: 'urgent', label: 'Urgent', order: 0, color: 'var(--urgent)', bg: 'var(--urgent-bg)' },
  important: { key: 'important', label: 'Important', order: 1, color: 'var(--important)', bg: 'var(--important-bg)' },
  normale: { key: 'normale', label: 'Normale', order: 2, color: 'var(--normal)', bg: 'var(--normal-bg)' },
};

export const PRIORITY_LIST = Object.values(PRIORITY);

// Palette dédiée aux statuts (distincte de la palette de priorité
// ci-dessus), validée avec le validateur du skill dataviz : 4 teintes,
// contrôle CVD par paires (ΔE >= 6, bande WARN acceptée car chaque
// couleur est toujours accompagnée d'une icône + d'un libellé, jamais
// de la couleur seule).
export const STATUS = {
  done: { key: 'done', label: 'Réalisées', singular: 'Réalisée', color: 'var(--done)', bg: 'var(--done-bg)', icon: '✓' },
  pending: { key: 'pending', label: 'À faire', singular: 'À faire', color: 'var(--pending)', bg: 'var(--pending-bg)', icon: '○' },
  missed: { key: 'missed', label: 'Non réalisées', singular: 'Non réalisée', color: 'var(--missed)', bg: 'var(--missed-bg)', icon: '✕' },
};

export const STATUS_LIST = Object.values(STATUS);

// "Reportée" n'est pas un statut exclusif (une tâche reportée reste par
// ailleurs à faire, réalisée ou non réalisée) : c'est un évènement qu'on
// affiche à part, jamais comme 4e part d'un même anneau de statuts.
export const POSTPONED = { key: 'postponed', label: 'Reportées', singular: 'Reportée', color: 'var(--postponed)', bg: 'var(--postponed-bg)', icon: '↻' };
