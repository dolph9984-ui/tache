import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TasksContext';
import { notificationsSupported, requestNotificationPermission } from '../../hooks/useReminders';
import styles from './SettingsView.module.css';

function Row({ label, hint, children }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <div className={styles.rowLabel}>{label}</div>
        {hint && <div className={styles.rowHint}>{hint}</div>}
      </div>
      <div className={styles.rowControl}>{children}</div>
    </div>
  );
}

function Switch({ on, onToggle, disabled }) {
  return (
    <button
      className={`${styles.switch} ${on ? styles.on : ''}`}
      onClick={onToggle}
      disabled={disabled}
      role="switch"
      aria-checked={on}
    />
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className={styles.segmented}>
      {options.map((o) => (
        <button
          key={o.value}
          className={`${styles.segBtn} ${value === o.value ? styles.active : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsView() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { tasks, resetDemo } = useTasks();
  const [permission, setPermission] = useState(notificationsSupported() ? Notification.permission : 'unsupported');
  const [toast, setToast] = useState('');

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleReminderToggle = async () => {
    if (!settings.remindersEnabled) {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result !== 'granted') return;
    }
    updateSettings({ remindersEnabled: !settings.remindersEnabled });
  };

  const exportTasks = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes-taches.json';
    a.click();
    URL.revokeObjectURL(url);
    flash('Export généré.');
  };

  const handleResetDemo = () => {
    if (window.confirm('Remplacer vos tâches actuelles par le jeu de données de démonstration ?')) {
      resetDemo();
      flash('Données de démonstration restaurées.');
    }
  };

  return (
    <div className="viewInner">
      <h1>Paramètres</h1>
      <div className="dateLine">Rappels, préférences et données de l'application</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Rappels &amp; notifications</div>

        <Row
          label="Rappels avant chaque tâche"
          hint={
            permission === 'denied'
              ? "Notifications bloquées par le navigateur — autorisez-les dans les paramètres du site pour activer cette option."
              : "Reçoit une notification quelques minutes avant l'heure prévue d'une tâche à faire."
          }
        >
          <Switch on={settings.remindersEnabled} onToggle={handleReminderToggle} disabled={permission === 'denied' || permission === 'unsupported'} />
        </Row>

        <Row label="Délai de rappel">
          <select
            className={styles.select}
            value={settings.reminderMinutesBefore}
            disabled={!settings.remindersEnabled}
            onChange={(e) => updateSettings({ reminderMinutesBefore: Number(e.target.value) })}
          >
            {[5, 10, 15, 30, 60].map((m) => <option key={m} value={m}>{m} min avant</option>)}
          </select>
        </Row>

        <Row
          label="Récapitulatif quotidien"
          hint={
            permission !== 'granted'
              ? "Activez d'abord les rappels ci-dessus pour autoriser les notifications."
              : "Un résumé des tâches à faire, envoyé chaque jour à l'heure choisie."
          }
        >
          <Switch
            on={settings.dailyRecapEnabled}
            disabled={permission !== 'granted'}
            onToggle={() => updateSettings({ dailyRecapEnabled: !settings.dailyRecapEnabled })}
          />
        </Row>

        <Row label="Heure du récapitulatif">
          <input
            type="time"
            className={styles.timeInput}
            value={settings.dailyRecapTime}
            disabled={!settings.dailyRecapEnabled}
            onChange={(e) => updateSettings({ dailyRecapTime: e.target.value })}
          />
        </Row>

        <Row label="Son des notifications">
          <Switch on={settings.notificationSound} onToggle={() => updateSettings({ notificationSound: !settings.notificationSound })} />
        </Row>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Préférences de tâches</div>

        <Row label="Priorité par défaut" hint="Présélectionnée à la création d'une nouvelle tâche.">
          <Segmented
            value={settings.defaultPriority}
            onChange={(v) => updateSettings({ defaultPriority: v })}
            options={[{ value: 'normale', label: 'Normale' }, { value: 'important', label: 'Important' }, { value: 'urgent', label: 'Urgent' }]}
          />
        </Row>

        <Row label="Tri par défaut" hint="Ordre appliqué à la liste « Aujourd'hui ».">
          <Segmented
            value={settings.defaultSort}
            onChange={(v) => updateSettings({ defaultSort: v })}
            options={[{ value: 'priority', label: 'Priorité' }, { value: 'time', label: 'Heure' }]}
          />
        </Row>

        <Row label="Unité de durée par défaut">
          <Segmented
            value={settings.defaultDurationUnit}
            onChange={(v) => updateSettings({ defaultDurationUnit: v })}
            options={[{ value: 'min', label: 'min' }, { value: 'h', label: 'h' }]}
          />
        </Row>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Apparence</div>
        <Row label="Thème">
          <Segmented
            value={settings.theme}
            onChange={(v) => updateSettings({ theme: v })}
            options={[{ value: 'system', label: 'Système' }, { value: 'light', label: 'Clair' }, { value: 'dark', label: 'Sombre' }]}
          />
        </Row>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Données</div>
        <Row label="Exporter mes tâches" hint="Télécharge toutes les tâches actuelles au format JSON.">
          <button className={styles.btn} onClick={exportTasks}>Exporter</button>
        </Row>
        <Row label="Réinitialiser les données de démonstration" hint="Remplace vos tâches par le jeu de données d'exemple.">
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleResetDemo}>Réinitialiser</button>
        </Row>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => { resetSettings(); flash('Paramètres réinitialisés.'); }}>Réinitialiser les paramètres</button>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
