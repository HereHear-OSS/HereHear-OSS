import { useEffect, useState } from 'react';
import { ensureAnonymousSession } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function useAnonymousSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    ensureAnonymousSession()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}

