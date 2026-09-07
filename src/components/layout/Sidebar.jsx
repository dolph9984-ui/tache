import { useState } from 'react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord' },
  { key: 'tasks', label: 'Tâches' },
  { key: 'archives', label: 'Archives' },
  { key: 'settings', label: 'Paramètres' },
];

export default function Sidebar({ activeView, onNavigate, onNewTask }) {
  // Ne sert qu'en mobile : sur bureau la nav reste toujours visible et ce
  // drapeau n'a aucun effet (voir la media query dans le CSS).
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (key) => {
    setMenuOpen(false);
    onNavigate(key);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} />
        <span className={styles.brandName}>Task.</span>
      </div>

      <button
        className={`${styles.menuToggle} ${menuOpen ? styles.open : ''}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
      >
        <span />
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`${styles.navItem} ${activeView === item.key ? styles.active : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className={styles.dot} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={`${styles.backdrop} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(false)} />

      <div className={styles.sidebarFoot}>
        <button className={styles.newTaskBtn} onClick={onNewTask}>
          <span className={styles.plus}>+</span>
          Nouvelle tâche
        </button>
      </div>
    </aside>
  );
}
