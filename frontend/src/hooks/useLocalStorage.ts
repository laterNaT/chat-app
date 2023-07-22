import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string) {
  const [value, setValue] = useState<T | null>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error("Error parsing localStorage with key ", key, error);
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage with key ", key, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
