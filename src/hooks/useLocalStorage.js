import { useEffect, useRef, useState } from 'react';

/** État persistant dans localStorage, avec valeur initiale paresseuse. */
export function useLocalStorage(key, getInitial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      // stockage indisponible ou corrompu : on repart de la valeur par défaut
    }
    return typeof getInitial === 'function' ? getInitial() : getInitial;
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota dépassé ou navigation privée : on ignore silencieusement
    }
  }, [key, value]);

  return [value, setValue];
}
