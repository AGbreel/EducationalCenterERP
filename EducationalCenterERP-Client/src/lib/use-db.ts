import { useCallback, useEffect, useState } from "react";
import { emptyDb, fetchDb, type DB } from "./data";

export function useDb() {
  const [db, setDb] = useState<DB>(emptyDb);
  const [loading, setLoading] = useState(true);

  const sync = useCallback(async () => {
    try {
      setDb(await fetchDb());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void sync();
    const handler = () => void sync();
    window.addEventListener("db-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("db-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [sync]);

  return Object.assign(db, { loading, refresh: sync });
}
