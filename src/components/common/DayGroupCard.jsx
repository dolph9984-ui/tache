import StatusBadge from './StatusBadge';
import PostponedTag from './PostponedTag';
import styles from './DayGroupCard.module.css';

/**
 * Carte d'un jour (à venir ou archivé) listant ses tâches. Utilisée à la
 * fois par la colonne "À venir" et par la vue Archives.
 */
export default function DayGroupCard({ label, subLabel, items, onItemClick, grid = false, showStatus = false }) {
  return (
    <div className={`${styles.day} ${grid ? styles.gridItem : ''}`}>
      <div className={styles.head}>
        <div className={styles.label}>{label}</div>
        <div className={styles.sub}>{subLabel}</div>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${styles[showStatus ? item.status : item.priority] || ''}`}
            onClick={() => onItemClick(item)}
          >
            <div className={styles.itemTitle}>{item.title}</div>
            {item.postponed && <PostponedTag />}
            {showStatus ? <StatusBadge status={item.status} /> : <div className={styles.itemMeta}>{item.time}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
