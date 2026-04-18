import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProgressContextType {
  progress: Record<string, number>;
  setProgress: (songId: string, value: number) => void;
}

const ProgressContext = createContext<ProgressContextType>({
  progress: {},
  setProgress: () => {},
});

const STORAGE_KEY = "@alshami_progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<Record<string, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setProgressState(JSON.parse(data));
        } catch (_) {}
      }
    });
  }, []);

  const setProgress = useCallback((songId: string, value: number) => {
    setProgressState((prev) => {
      const next = { ...prev, [songId]: Math.max(prev[songId] ?? 0, value) };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
