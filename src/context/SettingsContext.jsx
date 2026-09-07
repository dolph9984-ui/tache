import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SETTINGS } from '../data/seed';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('faitapp.settings.v1', DEFAULT_SETTINGS);

  // Applique le thème choisi sur la racine du document ; "system" retire
  // l'attribut pour laisser prefers-color-scheme décider (voir variables.css).
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light' || settings.theme === 'dark') {
      root.dataset.theme = settings.theme;
    } else {
      delete root.dataset.theme;
    }
  }, [settings.theme]);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  const value = useMemo(() => ({ settings, updateSettings, resetSettings }), [settings, updateSettings, resetSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
