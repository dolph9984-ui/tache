import { NAV_ITEMS } from '../../config/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar({ activeView, onNavigate, onNewTask }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} />
        <span className={styles.brandName}>Task.</span>
      </div>

      <nav className={styles.nav} aria-label="Navigation principale">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.navItem} ${activeView === item.key ? styles.active : ''}`}
            onClick={() => onNavigate(item.key)}
            aria-current={activeView === item.key ? 'page' : undefined}
          >
            <span className={styles.dot} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFoot}>
        <button type="button" className={styles.newTaskBtn} onClick={onNewTask}>
          <span className={styles.plus}>+</span>
          Nouvelle tâche
        </button>
      </div>
    </aside>
  );
}
