import { useEffect, useState, useRef } from 'react';

interface StatItem {
  number: string;
  label: string;
}

/**
 * Hook to dynamically calculate font size for stat numbers based on container width
 * and the longest text to ensure all stats fit properly
 */
export const useAdaptiveStatsFontSize = (stats: Record<string, StatItem>) => {
  const [fontSize, setFontSize] = useState<number>(48); // Default to text-5xl equivalent
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateFontSize = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get all stat number elements
      const statElements = container.querySelectorAll('[data-stat-number]');
      if (statElements.length === 0) return;

      // Find the longest text
      let longestText = '';
      statElements.forEach((element) => {
        const text = element.textContent || '';
        if (text.length > longestText.length) {
          longestText = text;
        }
      });

      // Get container width (approximate width of one stat box)
      const containerWidth = container.offsetWidth / 3; // 3 columns
      const availableWidth = containerWidth * 0.8; // 80% to leave padding

      // Calculate font size using canvas for accurate measurement
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      // Start with a large font size and reduce until it fits
      let testSize = 80;
      const minSize = 24;
      
      // Get the font family from computed styles
      const computedStyle = window.getComputedStyle(statElements[0]);
      const fontFamily = computedStyle.fontFamily;

      while (testSize > minSize) {
        context.font = `bold ${testSize}px ${fontFamily}`;
        const metrics = context.measureText(longestText);
        
        if (metrics.width <= availableWidth) {
          break;
        }
        testSize -= 2;
      }

      setFontSize(testSize);
    };

    // Calculate on mount and window resize
    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);

    // Small delay to ensure fonts are loaded
    const timeout = setTimeout(calculateFontSize, 100);

    return () => {
      window.removeEventListener('resize', calculateFontSize);
      clearTimeout(timeout);
    };
  }, [stats]);

  return { fontSize, containerRef };
};
