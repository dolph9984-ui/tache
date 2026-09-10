import { CREATE_NAV_ITEM, NAV_ITEMS } from '../../config/navigation';
import styles from './BottomNav.module.css';

const SLOTS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  CREATE_NAV_ITEM,
  NAV_ITEMS[2],
  NAV_ITEMS[3],
];

export default function BottomNav({ activeView, onNavigate, onNewTask }) {
  return (
    <nav className={styles.bottomNav} aria-label="Navigation principale">
      {SLOTS.map((item) => {
        if (item.key === 'create') {
          return (
            <button
              key={item.key}
              type="button"
              className={`${styles.tab} ${styles.createTab}`}
              onClick={onNewTask}
              aria-label={item.label}
            >
              <span className={styles.icon}>{item.icon}</span>
            </button>
          );
        }

        const isActive = activeView === item.key;

        return (
          <button
            key={item.key}
            type="button"
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onNavigate(item.key)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon}>{isActive ? item.iconActive : item.icon}</span>
          </button>
        );
      })}
    </nav>
  );
}
