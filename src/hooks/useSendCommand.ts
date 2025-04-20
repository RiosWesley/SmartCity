import { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

export function useSendCommand() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const sendCommand = async (path: string, commandData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const db = getDatabase();
      const commandRef = ref(db, path);
      await set(commandRef, commandData);
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { sendCommand, loading, error, success };
}