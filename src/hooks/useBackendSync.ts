'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface SyncResult {
  synced: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to sync Clerk user with backend database
 * Uses the same auth routes as the mobile app (/api/auth/signup)
 * This ensures the user exists in the DB after Clerk authentication
 */
export function useBackendSync(): SyncResult {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const syncAttempted = useRef(false);

  useEffect(() => {
    // Only run once per session
    if (syncAttempted.current) return;

    // Wait for Clerk to load
    if (!isUserLoaded) return;

    // No user = no sync needed
    if (!user) {
      setLoading(false);
      return;
    }

    const syncWithBackend = async () => {
      syncAttempted.current = true;
      setLoading(true);
      setError(null);

      try {
        // Get Clerk token for backend authentication
        const token = await getToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        // Call the backend signup route (same as mobile app)
        // This route creates the user in DB if not exists, or returns existing user
        const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0],
            password: '', // Password managed by Clerk
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          // If user already exists, that's fine - they're synced
          if (response.status === 400 && data.error?.includes('déjà utilisé')) {
            setSynced(true);
            return;
          }

          throw new Error(data.error || `Sync failed with status ${response.status}`);
        }

        setSynced(true);
      } catch (err) {
        console.error('Backend sync error:', err);
        setError(err instanceof Error ? err.message : 'Sync failed');
        // Still mark as "attempted" so we don't retry forever
        setSynced(false);
      } finally {
        setLoading(false);
      }
    };

    syncWithBackend();
  }, [user, isUserLoaded, getToken]);

  return { synced, loading, error };
}

export default useBackendSync;
