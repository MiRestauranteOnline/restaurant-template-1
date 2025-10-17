import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientData } from '@/utils/cachedContent';

/**
 * Hook to apply dynamic hero overlay opacity based on client settings
 * Applies opacity value (0-100) as a CSS custom property
 */
export const useHeroOverlay = () => {
  const { clientSettings } = useClient();
  const cachedClient = getCachedClientData();
  
  useEffect(() => {
    const opacity = clientSettings?.hero_overlay_opacity ?? cachedClient?.hero_overlay_opacity ?? 70;
    
    // Convert percentage to decimal (0-1)
    // 0% -> 0, 70% -> 0.7, 100% -> 1
    const opacityDecimal = opacity / 100;

    console.info('useHeroOverlay: applying opacity', { opacity, opacityDecimal, source: clientSettings?.hero_overlay_opacity !== undefined ? 'clientSettings' : 'cache' });
    
    // Apply the opacity as a CSS custom property
    document.documentElement.style.setProperty('--hero-overlay-opacity', opacityDecimal.toString());
  }, [clientSettings?.hero_overlay_opacity, cachedClient?.hero_overlay_opacity]);
};
