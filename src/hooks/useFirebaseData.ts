import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';

export function useFirebaseData(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      off(dataRef, 'value', unsubscribe);
    };
  }, [path]);

  return { data, loading, error };
}

export default useFirebaseData;