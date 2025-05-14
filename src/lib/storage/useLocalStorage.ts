import { useCallback, useEffect, useReducer } from 'react';

type StorageHook<T> = [T | null, (value: T | null) => void];

function useStorageState<T>(initialValue: T | null = null): StorageHook<T> {
  return useReducer(
    (_: T | null, action: T | null = null): T | null => action,
    initialValue
  ) as StorageHook<T>;
}

function setStorageItem(key: string, value: unknown) {
  const serializedValue = value !== null ? JSON.stringify(value) : null;

  try {
    if (serializedValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, serializedValue);
    }
  } catch (e) {
    console.error('Local storage is unavailable:', e);
  }
}

export function useLocalStorage<T>(key: string): StorageHook<T> {
  const [state, setState] = useStorageState<T>();

  useEffect(() => {
    let value: string | null = null;

    try {
      if (typeof localStorage !== 'undefined') {
        value = localStorage.getItem(key);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }

    if (value) {
      try {
        const parsedValue = JSON.parse(value) as T;
        setState(parsedValue);
      } catch (e) {
        console.error('Error parsing stored value:', e);
        setState(null);
      }
    } else {
      setState(null);
    }
  }, [key, setState]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItem(key, value);
    },
    [key, setState]
  );

  return [state, setValue];
}