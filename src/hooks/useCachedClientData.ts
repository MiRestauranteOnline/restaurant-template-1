import { useEffect, useState } from 'react';

// Utility hook to access cached client data for preventing layout shifts
export const useCachedClientData = (subdomain?: string) => {
  const [cachedData, setCachedData] = useState<any>(null);

  useEffect(() => {
    if (!subdomain) return;
    
    const getCacheKey = (subdomain: string) => `client_styles_${subdomain}`;
    
    try {
      const cacheKey = getCacheKey(subdomain);
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
  }, [subdomain]);

  return cachedData;
};