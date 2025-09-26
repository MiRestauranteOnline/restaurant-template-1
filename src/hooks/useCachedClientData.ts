import { useEffect, useState } from 'react';

// Utility hook to access cached client data for preventing layout shifts
export const useCachedClientData = (domain?: string) => {
  const [cachedData, setCachedData] = useState<any>(null);

  useEffect(() => {
    if (!domain) return;
    
    const getCacheKey = (domain: string) => `client_styles_${domain}`;
    
    try {
      const cacheKey = getCacheKey(domain);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
        
        // Check if cache is still valid
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          setCachedData(data);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached client data:', error);
    }
  }, [domain]);

  return cachedData;
};