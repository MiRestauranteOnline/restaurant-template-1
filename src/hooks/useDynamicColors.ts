import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

// Utility function to convert hex to HSL
const hexToHsl = (hex: string) => {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

export const useDynamicColors = () => {
  const { clientSettings } = useClient();
  
  useEffect(() => {
    // Get primary color from database or use default gold
    const primaryColor = clientSettings?.primary_color || '#FFD700';
    
    // Convert hex to HSL
    const hslColor = hexToHsl(primaryColor);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary', hslColor);
    document.documentElement.style.setProperty('--accent', hslColor);
    
    // Update gradients to use the new primary color
    const [h, s, l] = hslColor.split(' ');
    const lighterL = Math.min(parseInt(l.replace('%', '')) + 10, 90);
    const darkerL = Math.max(parseInt(l.replace('%', '')) - 10, 10);
    
    const gradientPrimary = `linear-gradient(135deg, hsl(${h} ${s} ${l}) 0%, hsl(${h} ${s} ${lighterL}%) 100%)`;
    document.documentElement.style.setProperty('--gradient-primary', gradientPrimary);
    
  }, [clientSettings?.primary_color]);
  
  return clientSettings?.primary_color || '#FFD700';
};