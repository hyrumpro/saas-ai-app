'use client';

import { useQuery } from '@tanstack/react-query';
import { appwriteClient } from '@/lib/appwrite-client';
import type { Models } from 'appwrite';

export function useSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ['subscription', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      const { databases } = appwriteClient;
      const result = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        'profiles',
        userId,
      );
      return (result as Models.Document & { subscriptionTier?: string });
    },
    staleTime: 1000 * 60 * 5,
  });
}
