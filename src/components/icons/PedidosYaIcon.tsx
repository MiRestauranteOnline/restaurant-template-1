import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useDynamicColors } from '@/hooks/useDynamicColors';

interface PedidosYaIconProps {
  className?: string;
  size?: number;
}

export const PedidosYaIcon: React.FC<PedidosYaIconProps> = ({ className = "", size = 64 }) => {
  const theme = useTheme();
  const primaryColor = useDynamicColors();
  
  // Use primary color in bright mode, original branding in dark mode
  const fillColor = theme === 'bright' ? `hsl(var(--primary))` : '#FFD700';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified PedidosYa logo - circular background with "P" */}
      <circle cx="50" cy="50" r="48" fill={fillColor} />
      <path 
        d="M25 20 L25 80 L35 80 L35 55 L55 55 C65 55 72 48 72 38 C72 28 65 20 55 20 Z M35 30 L55 30 C58 30 62 32 62 38 C62 44 58 45 55 45 L35 45 Z" 
        fill="white"
      />
    </svg>
  );
};