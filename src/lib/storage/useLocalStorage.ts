import { useCallback, useEffect, useReducer } from 'react';

type UseStorageHook<T> = [T | null, (value: T | null) => void];

function useAsyncState<T>(initialValue: T | null = null): UseStorageHook<T> {
  return useReducer(
    (_: T | null, action: T | null = null): T | null => action,
    initialValue
  ) as UseStorageHook<T>;
}

async function setStorageItemAsync(key: string, value: any) {
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

export function useSecureStorage<T>(key: string): UseStorageHook<T> {
  const [state, setState] = useAsyncState<T>();

  useEffect(() => {
    const getItem = async () => {
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
          const parsedValue = JSON.parse(value);
          setState(parsedValue);
        } catch (e) {
          console.error('Error parsing stored value:', e);
          setState(null);
        }
      } else {
        setState(null);
      }
    };

    getItem();
  }, [key]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
