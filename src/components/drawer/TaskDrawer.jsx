import { useEffect, useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { dayLabel, todayISO } from '../../utils/date';
import { PRIORITY_LIST } from '../../utils/meta';
import styles from './TaskDrawer.module.css';

function parseDuration(str) {
  if (!str) return { value: '', unit: 'min' };
  const [value, unit] = str.trim().split(' ');
  return { value: value === '—' ? '' : value, unit: unit === 'h' ? 'h' : 'min' };
}

const EMPTY_FORM = { title: '', description: '', date: todayISO(), time: '', durationValue: '', durationUnit: 'min', priority: 'urgent' };

export default function TaskDrawer({ open, mode, task, defaultPriority, defaultDurationUnit, onClose, onSave, onDelete, onPostpone }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [note, setNote] = useState({ text: '', error: false });

  useEffect(() => {
    if (!open) return;
    setNote({ text: '', error: false });
    if (mode === 'create') {
      setForm({ ...EMPTY_FORM, date: todayISO(), priority: defaultPriority || 'urgent', durationUnit: defaultDurationUnit || 'min' });
    } else if (task) {
      const d = parseDuration(task.duration);
      setForm({
        title: task.title,
        description: task.description || '',
        date: task.date,
        time: task.time === '—' ? '' : task.time,
        durationValue: d.value,
        durationUnit: d.unit,
        priority: task.priority,
      });
    }
  }, [open, mode, task, defaultPriority, defaultDurationUnit]);

  if (mode === 'view' && !task) return null;

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const title = isView ? task.title : isEdit ? 'Modifier la tâche' : 'Nouvelle tâche';
  const subtitle = isView
    ? ''
    : isEdit
      ? (task.date === todayISO() ? "Tâche d'aujourd'hui" : dayLabel(task.date))
      : 'Sera ajoutée à votre liste';

  const handleSubmit = () => {
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setNote({ text: 'Donnez un titre à la tâche.', error: true });
      return;
    }
    const duration = `${form.durationValue.trim() || '—'} ${form.durationUnit}`;
    onSave({
      title: trimmedTitle,
      description: form.description.trim(),
      date: form.date,
      time: form.time || '—',
      duration,
      priority: form.priority,
    });
    setNote({ text: isEdit ? 'Modifications enregistrées.' : 'Tâche créée.', error: false });
    setTimeout(onClose, 800);
  };

  const handlePostpone = () => {
    onPostpone(task.id);
    setNote({ text: 'Tâche reportée à demain.', error: false });
    setTimeout(onClose, 700);
  };

  const canPostpone = isEdit && (task.status === 'pending' || task.status === 'missed');

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.drawer}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {isView ? (
              <div className="dateLine">{dayLabel(task?.date)} · {task?.time}</div>
            ) : (
              <div className="dateLine">{subtitle}</div>
            )}
          </div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.field}>
          <label>Titre</label>
          <input
            type="text" readOnly={isView} value={form.title}
            placeholder="Ex. Réviser le chapitre 3"
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className={styles.field}>
          <label>Description (optionnel)</label>
          <textarea
            readOnly={isView} value={isView ? (form.description || 'Aucune description.') : form.description}
            placeholder="Notes ou sous-étapes"
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {isView ? (
          <div className={styles.field}>
            <label>Statut</label>
            <StatusBadge status={task.status} />
          </div>
        ) : (
          <>
            <div className={styles.field}>
              <label>Date &amp; heure</label>
              <div className={styles.dateRow}>
                <div>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label>Durée estimée</label>
              <div className={styles.durationRow}>
                <input
                  type="text" value={form.durationValue} placeholder="30"
                  onChange={(e) => setForm((f) => ({ ...f, durationValue: e.target.value }))}
                />
                <div className={styles.unitToggle}>
                  {['min', 'h'].map((u) => (
                    <button
                      key={u}
                      className={`${styles.unitBtn} ${form.durationUnit === u ? styles.active : ''}`}
                      onClick={() => setForm((f) => ({ ...f, durationUnit: u }))}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label>Priorité</label>
              <div className={styles.priorityRow}>
                {PRIORITY_LIST.map((p) => (
                  <button
                    key={p.key}
                    className={`${styles.priorityBtn} ${form.priority === p.key ? styles.active : ''}`}
                    style={form.priority === p.key ? { background: p.color, borderColor: p.color } : {}}
                    onClick={() => setForm((f) => ({ ...f, priority: p.key }))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {canPostpone && (
              <div className={styles.postponeRow}>
                <button className={styles.postponeBtn} onClick={handlePostpone}>Reporter à demain →</button>
              </div>
            )}

            <button className={styles.submit} onClick={handleSubmit}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer la tâche'}
            </button>
            {isEdit && (
              <button className={styles.deleteLink} onClick={() => { onDelete(task.id); onClose(); }}>
                Supprimer la tâche
              </button>
            )}
          </>
        )}

        {note.text && <div className={`${styles.confirmNote} ${note.error ? styles.error : ''}`}>{note.text}</div>}
      </div>
    </div>
  );
}
