import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addMonths,
  daysInMonth,
  formatShortDate,
  fromISO,
  monthYearLabel,
  normalizeRange,
  startOfMonth,
  todayISO,
  toISO,
  weekdayIndexMonFirst,
} from '../../utils/date';
import styles from './TaskCalendar.module.css';

const WEEKDAYS = [
  { key: 'mon', label: 'L' },
  { key: 'tue', label: 'M' },
  { key: 'wed', label: 'M' },
  { key: 'thu', label: 'J' },
  { key: 'fri', label: 'V' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'D' },
];

function isInRange(iso, from, to) {
  if (!from || !to) return false;
  return iso >= from && iso <= to;
}

export default function TaskCalendar({
  open,
  onClose,
  mode = 'single',
  selectedDate,
  rangeFrom = '',
  rangeTo = '',
  datesWithTasks = [],
  onSelectDate,
  onSelectRange,
  anchorRef,
}) {
  const panelRef = useRef(null);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selectedDate || rangeFrom || todayISO()));
  const [pendingFrom, setPendingFrom] = useState('');

  useEffect(() => {
    if (open) {
      setViewMonth(startOfMonth(selectedDate || rangeFrom || todayISO()));
      setPendingFrom('');
    }
  }, [open, selectedDate, rangeFrom]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [open, onClose, anchorRef]);

  const today = todayISO();
  const taskDates = useMemo(() => new Set(datesWithTasks), [datesWithTasks]);
  const isRange = mode === 'range';
  const activeFrom = isRange ? (pendingFrom || rangeFrom) : selectedDate;
  const activeTo = isRange ? rangeTo : '';

  const cells = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const leading = weekdayIndexMonFirst(first);
    const totalDays = daysInMonth(viewMonth);
    const grid = [];

    for (let i = 0; i < leading; i += 1) {
      grid.push({ key: `pad-${i}`, empty: true });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const d = fromISO(first);
      d.setDate(day);
      const iso = toISO(d);
      const inRange = isRange && activeFrom && activeTo && isInRange(iso, activeFrom, activeTo);
      const isRangeStart = isRange && activeFrom && iso === activeFrom;
      const isRangeEnd = isRange && activeTo && iso === activeTo;
      const isRangeAnchor = isRangeStart || isRangeEnd;
      grid.push({
        key: iso,
        iso,
        day,
        hasTasks: taskDates.has(iso),
        isToday: iso === today,
        isSelected: !isRange && iso === selectedDate,
        inRange,
        isRangeStart,
        isRangeEnd,
        isRangeAnchor,
      });
    }
    return grid;
  }, [viewMonth, taskDates, today, selectedDate, isRange, activeFrom, activeTo]);

  const handleDayClick = (iso) => {
    if (!isRange) {
      onSelectDate?.(iso);
      onClose();
      return;
    }

    const start = pendingFrom || (rangeFrom && !rangeTo ? rangeFrom : '');

    if (!start || (rangeFrom && rangeTo && !pendingFrom)) {
      setPendingFrom(iso);
      onSelectRange?.(iso, '');
      return;
    }

    const { from, to } = normalizeRange(start, iso);
    onSelectRange?.(from, to);
    setPendingFrom('');
    onClose();
  };

  const rangeStart = pendingFrom || rangeFrom;
  const rangeHint = isRange ? (() => {
    if (rangeFrom && rangeTo) {
      return rangeFrom === rangeTo
        ? `Le ${formatShortDate(rangeFrom)}`
        : `Du ${formatShortDate(rangeFrom)} au ${formatShortDate(rangeTo)}`;
    }
    if (rangeStart) return `Du ${formatShortDate(rangeStart)} au …`;
    return 'Du … au …';
  })() : null;

  if (!open) return null;

  return (
    <div className={styles.panel} ref={panelRef} role="dialog" aria-label="Choisir une date">
      <div className={styles.nav}>
        <button type="button" className={styles.navBtn} onClick={() => setViewMonth(addMonths(viewMonth, -1))} aria-label="Mois précédent">
          ‹
        </button>
        <div className={styles.monthLabel}>{monthYearLabel(viewMonth)}</div>
        <button type="button" className={styles.navBtn} onClick={() => setViewMonth(addMonths(viewMonth, 1))} aria-label="Mois suivant">
          ›
        </button>
      </div>

      {isRange && (
        <div className={styles.rangeBar}>
          <div className={styles.rangeSlot}>
            <span className={styles.rangeKey}>Du</span>
            <span className={styles.rangeVal}>{rangeStart ? formatShortDate(rangeStart) : '…'}</span>
          </div>
          <span className={styles.rangeSep} aria-hidden="true">→</span>
          <div className={styles.rangeSlot}>
            <span className={styles.rangeKey}>Au</span>
            <span className={styles.rangeVal}>{rangeTo ? formatShortDate(rangeTo) : '…'}</span>
          </div>
        </div>
      )}

      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <span key={w.key} className={styles.weekday}>{w.label}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((cell) => (
          cell.empty ? (
            <span key={cell.key} className={styles.pad} aria-hidden="true" />
          ) : (
            <button
              key={cell.key}
              type="button"
              className={[
                styles.day,
                cell.isToday ? styles.today : '',
                cell.isSelected ? styles.selected : '',
                cell.hasTasks ? styles.hasTasks : '',
                cell.inRange ? styles.inRange : '',
                cell.isRangeAnchor ? styles.rangeAnchor : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleDayClick(cell.iso)}
            >
              <span className={styles.dayNum}>{cell.day}</span>
              {cell.hasTasks && <span className={styles.dot} aria-hidden="true" />}
            </button>
          )
        ))}
      </div>

      {rangeHint && <div className={styles.hint}>{rangeHint}</div>}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.footerBtn}
          onClick={() => {
            if (isRange) {
              onSelectRange?.(today, today);
              setPendingFrom('');
            } else {
              onSelectDate?.(today);
            }
            onClose();
          }}
        >
          Aujourd&apos;hui
        </button>
        {isRange && (rangeFrom || rangeTo) && (
          <button
            type="button"
            className={styles.footerBtn}
            onClick={() => {
              onSelectRange?.('', '');
              setPendingFrom('');
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}

export function CalendarTrigger({ active, onClick, label, btnRef }) {
  return (
    <button
      ref={btnRef}
      type="button"
      className={`${styles.trigger} ${active ? styles.triggerActive : ''}`}
      onClick={onClick}
      aria-label="Choisir une date"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
      {label && <span className={styles.triggerLabel}>{label}</span>}
    </button>
  );
}
