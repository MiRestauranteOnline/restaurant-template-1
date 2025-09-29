import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useMenuSectionTracking } from '@/hooks/useMenuSectionTracking';

interface AnalyticsContextType {
  track: ReturnType<typeof useAnalytics>['track'];
  trackPageView: ReturnType<typeof useAnalytics>['trackPageView'];
  trackButtonClick: ReturnType<typeof useAnalytics>['trackButtonClick'];
  trackMenuSectionView: ReturnType<typeof useAnalytics>['trackMenuSectionView'];
  trackMenuDownload: ReturnType<typeof useAnalytics>['trackMenuDownload'];
  trackScrollDepth: ReturnType<typeof useAnalytics>['trackScrollDepth'];
  uploadEvents: ReturnType<typeof useAnalytics>['uploadEvents'];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const analytics = useAnalytics();
  
  // Initialize menu section tracking
  useMenuSectionTracking();

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};