import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string) {
  const [value, setValue] = useState<T | null>(() => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
