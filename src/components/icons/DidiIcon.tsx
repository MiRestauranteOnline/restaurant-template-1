import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useDynamicColors } from '@/hooks/useDynamicColors';

interface DidiIconProps {
  className?: string;
  size?: number;
}

export const DidiIcon: React.FC<DidiIconProps> = ({ className = "", size = 64 }) => {
  const theme = useTheme();
  const primaryColor = useDynamicColors();
  
  // Use primary color in bright mode, original branding in dark mode
  const fillColor = theme === 'bright' ? `hsl(var(--primary))` : '#FF6B35';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified DiDi logo - circular background with "D" */}
      <circle cx="50" cy="50" r="48" fill={fillColor} />
      <path 
        d="M25 20 L25 80 L50 80 C65 80 75 70 75 50 C75 30 65 20 50 20 Z M35 30 L50 30 C58 30 65 37 65 50 C65 63 58 70 50 70 L35 70 Z" 
        fill="white"
      />
    </svg>
  );
};