import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientData } from '@/utils/cachedContent';

/**
 * Hook to apply dynamic title size scaling based on client settings
 * Scales all h1 and h2 elements by the specified percentage
 */
export const useTitleScale = () => {
  const { clientSettings } = useClient();
  const cachedClient = getCachedClientData();
  
  useEffect(() => {
    const scale = clientSettings?.title_size_scale ?? cachedClient?.title_size_scale ?? 0;
    
    // Convert percentage to scale multiplier
    // -50% -> 0.5, 0% -> 1.0, 50% -> 1.5
    const multiplier = 1 + (scale / 100);

    console.info('useTitleScale: applying scale', { scale, multiplier, source: clientSettings?.title_size_scale !== undefined ? 'clientSettings' : 'cache' });
    
    // Apply the scale as a CSS custom property
    document.documentElement.style.setProperty('--title-size-scale', multiplier.toString());
  }, [clientSettings?.title_size_scale, cachedClient?.title_size_scale]);
};
