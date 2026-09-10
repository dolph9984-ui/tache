const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.75',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const filledProps = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: 'none',
  'aria-hidden': true,
};

export const CREATE_NAV_ITEM = {
  key: 'create',
  label: 'Nouvelle tâche',
  icon: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
};

export const NAV_ITEMS = [
  {
    key: 'dashboard',
    label: 'Tableau de bord',
    shortLabel: 'Accueil',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
      </svg>
    ),
    iconActive: (
      <svg {...filledProps}>
        <path d="M12 2.1 3 9.5V20a1.5 1.5 0 0 0 1.5 1.5H9v-7h6v7h4.5A1.5 1.5 0 0 0 21 20V9.5L12 2.1z" />
      </svg>
    ),
  },
  {
    key: 'tasks',
    label: 'Tâches',
    shortLabel: 'Tâches',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    iconActive: (
      <svg {...filledProps}>
        <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6.3 8.3-2.8 2.8-1.5-1.5-1.4 1.4 2.9 2.9 4.2-4.2-1.4-1.4z" />
      </svg>
    ),
  },
  {
    key: 'archives',
    label: 'Archives',
    shortLabel: 'Archives',
    icon: (
      <svg {...iconProps}>
        <path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        <path d="M9 12h6" />
      </svg>
    ),
    iconActive: (
      <svg {...filledProps}>
        <path d="M9 4h6v2h5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6h5V4zm0 8h6v2H9v-2z" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Paramètres',
    shortLabel: 'Réglages',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3.25" />
        <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.55 1.55M18.25 18.25l1.55 1.55M2 12h2.2M19.8 12H22M4.2 19.8l1.55-1.55M18.25 5.75l1.55-1.55" />
      </svg>
    ),
    iconActive: (
      <svg {...filledProps}>
        <path d="M12 2a1 1 0 0 1 .95.68l.55 1.7 1.78.52a1 1 0 0 1 .63 1.37l-.82 1.58 1.02 1.58a1 1 0 0 1-.36 1.36l-1.52.98.02 1.86a1 1 0 0 1-1.32.92l-1.7-.55-1.7.55a1 1 0 0 1-1.32-.92l.02-1.86-1.52-.98a1 1 0 0 1-.36-1.36l1.02-1.58-.82-1.58a1 1 0 0 1 .63-1.37l1.78-.52.55-1.7A1 1 0 0 1 12 2zm0 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
      </svg>
    ),
  },
];
