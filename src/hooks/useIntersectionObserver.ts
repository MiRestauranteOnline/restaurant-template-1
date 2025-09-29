import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  onEnter?: (element: HTMLElement) => void;
  onExit?: (element: HTMLElement, timeSpent: number) => void;
  debounceMs?: number;
}

export const useIntersectionObserver = ({
  threshold = 0.5,
  rootMargin = '0px',
  onEnter,
  onExit,
  debounceMs = 500
}: UseIntersectionObserverOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<HTMLElement, number>>(new Map());
  const timeoutsRef = useRef<Map<HTMLElement, NodeJS.Timeout>>(new Map());

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      
      if (entry.isIntersecting) {
        // Element entered viewport
        const enterTime = Date.now();
        elementsRef.current.set(element, enterTime);
        
        // Clear any existing timeout for this element
        const existingTimeout = timeoutsRef.current.get(element);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Debounced onEnter call
        const timeout = setTimeout(() => {
          onEnter?.(element);
        }, debounceMs);
        
        timeoutsRef.current.set(element, timeout);
      } else {
        // Element left viewport
        const enterTime = elementsRef.current.get(element);
        if (enterTime) {
          const timeSpent = Date.now() - enterTime;
          elementsRef.current.delete(element);
          
          // Clear timeout
          const timeout = timeoutsRef.current.get(element);
          if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(element);
          }
          
          // Only call onExit if element was visible for meaningful time
          if (timeSpent > debounceMs) {
            onExit?.(element, Math.round(timeSpent / 1000)); // Convert to seconds
          }
        }
      }
    });
  }, [onEnter, onExit, debounceMs]);

  const observe = useCallback((element: HTMLElement) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin
      });
    }
    
    observerRef.current.observe(element);
  }, [handleIntersection, threshold, rootMargin]);

  const unobserve = useCallback((element: HTMLElement) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
    
    // Clean up references
    elementsRef.current.delete(element);
    const timeout = timeoutsRef.current.get(element);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    elementsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { observe, unobserve, disconnect };
};