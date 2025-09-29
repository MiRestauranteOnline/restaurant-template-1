import { useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import { useAnalytics } from './useAnalytics';

export const useMenuSectionTracking = () => {
  const { trackMenuSectionView } = useAnalytics();

  const { observe, unobserve } = useIntersectionObserver({
    threshold: 0.5, // 50% of element must be visible
    rootMargin: '-50px 0px', // Slight margin to avoid triggering too early
    debounceMs: 1000, // 1 second debounce
    onEnter: (element) => {
      const sectionName = element.getAttribute('data-analytics-section');
      if (sectionName) {
        console.log(`📊 Menu section entered: ${sectionName}`);
      }
    },
    onExit: (element, timeSpent) => {
      const sectionName = element.getAttribute('data-analytics-section');
      if (sectionName && timeSpent > 1) { // Only track if viewed for more than 1 second
        console.log(`📊 Menu section exited: ${sectionName}, Time: ${timeSpent}s`);
        trackMenuSectionView(sectionName, timeSpent);
      }
    }
  });

  const startTracking = useCallback((container?: HTMLElement) => {
    const targetContainer = container || document;
    const sections = targetContainer.querySelectorAll('[data-analytics-section]');
    
    sections.forEach((section) => {
      observe(section as HTMLElement);
    });

    return () => {
      sections.forEach((section) => {
        unobserve(section as HTMLElement);
      });
    };
  }, [observe, unobserve]);

  // Auto-start tracking when hook is used
  useEffect(() => {
    const cleanup = startTracking();
    return cleanup;
  }, [startTracking]);

  return {
    startTracking,
    observe,
    unobserve
  };
};