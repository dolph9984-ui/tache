# Fait. — gestion de tâches anti-procrastination

Application React (Vite) de suivi de tâches quotidiennes, pensée pour
mettre en avant les **statuts** (Réalisées / À faire / Non réalisées)
comme moteur de motivation.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrez l'URL affichée (par défaut http://localhost:5173).

```bash
npm run build    # build de production dans dist/
npm run preview  # sert le build de production
npm run lint     # oxlint
```

## Architecture

```
src/
  main.jsx                 point d'entrée
  App.jsx                  orchestration : navigation, tiroir de tâche
  styles/
    variables.css           tokens de couleur (clair + sombre)
    global.css               reset, polices, classes utilitaires partagées
  context/
    TasksContext.jsx         source de vérité des tâches (CRUD, report, done)
    SettingsContext.jsx      préférences persistées + application du thème
  hooks/
    useLocalStorage.js        persistance générique
    useReminders.js           planifie les rappels et le récap quotidien
  utils/
    date.js                   helpers de date (ISO, libellés FR)
    meta.js                   libellés/couleurs des priorités et statuts
  data/
    seed.js                   jeu de données de démo (relatif à "aujourd'hui")
  components/
    layout/Sidebar.jsx
    common/                   Fab, StatusBadge, DayGroupCard (partagés)
    dashboard/                Dashboard, StatusDonut (anneau SVG des statuts)
    tasks/                    TasksView, TaskRow
    archives/                 ArchivesView
    settings/                 SettingsView (rappels, apparence, données)
    drawer/                   TaskDrawer (création / édition / consultation)
```

**Modèle de données unifié** : une seule liste de tâches, chacune datée
en ISO (`date`). "Aujourd'hui", "À venir" et "Archives" ne sont que des
filtres sur cette liste par rapport à la date du jour — reporter une
tâche revient simplement à changer son champ `date`.

## Fonctionnalités clés

- **Statuts mis en valeur** : anneau de progression sur le tableau de
  bord, cartes de statut colorées, badges sur chaque tâche, indicateur
  de série ("🔥 X jours sans tâche non réalisée").
- **"À faire"** remplace toute notion d'« en cours » : une tâche est soit
  *à faire*, soit *réalisée*, soit *non réalisée* (basculée
  automatiquement si son heure est dépassée sans action).
- **Report d'une tâche** : bouton "Reporter →" sur chaque tâche à faire
  ou non réalisée (report à demain en un clic), ou modification libre
  de la date/heure dans le tiroir de détail.
- **Paramètres** : rappels par tâche (délai configurable), récapitulatif
  quotidien programmé, thème clair/sombre/système, préférences par
  défaut (priorité, tri, unité de durée), export JSON et réinitialisation
  des données de démonstration.

## Limites assumées

- Pas de backend : tout est persisté dans le `localStorage` du navigateur.
- Les rappels utilisent l'API `Notification` du navigateur via
  `setTimeout` : ils ne se déclenchent que si l'onglet reste ouvert (pas
  de push en arrière-plan).

L'ancienne maquette monofichier est conservée dans [`legacy/`](legacy/)
à titre de référence.
