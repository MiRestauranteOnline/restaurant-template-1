// PROTECTED: Theme functionality - DO NOT modify the core logic
// Only styling and UI improvements are allowed

import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

export const useTheme = () => {
  const { client } = useClient();
  
  useEffect(() => {
    // PROTECTED: Dynamic theme switching based on database value
    const theme = client?.theme || 'dark';
    
    // Remove existing theme classes
    document.documentElement.classList.remove('dark', 'bright', 'light');
    
    // Apply the theme from database
    if (theme === 'bright') {
      document.documentElement.classList.add('bright');
    } else {
      // Default to dark theme (no class needed as it's the root styles)
      document.documentElement.classList.remove('bright');
    }
  }, [client?.theme]);
  
  return client?.theme || 'dark';
};