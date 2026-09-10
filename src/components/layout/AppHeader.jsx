import GlobalSearch from '../common/GlobalSearch';
import styles from './AppHeader.module.css';

export default function AppHeader({ searchQuery, onSearchChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true" />
        <span className={styles.brandName}>Task.</span>
      </div>
      <GlobalSearch value={searchQuery} onChange={onSearchChange} className={styles.search} />
    </header>
  );
}
