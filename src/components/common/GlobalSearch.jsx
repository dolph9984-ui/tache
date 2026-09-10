import styles from './GlobalSearch.module.css';

export default function GlobalSearch({ value, onChange, className = '', compact = false }) {
  return (
    <label className={[styles.wrap, compact && styles.compact, className].filter(Boolean).join(' ')}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        placeholder="Rechercher une tâche…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Rechercher une tâche"
      />
    </label>
  );
}
