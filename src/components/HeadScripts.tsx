import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

const HeadScripts = () => {
  const { premiumFeatures } = useClient();

  useEffect(() => {
    // Google Analytics 4 Script
    if (premiumFeatures?.google_analytics_id) {
      // Remove existing GA scripts to prevent duplicates
      const existingGAScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${premiumFeatures.google_analytics_id}"]`);
      const existingGAConfig = document.querySelector('script[data-ga-config="true"]');
      
      if (existingGAScript) existingGAScript.remove();
      if (existingGAConfig) existingGAConfig.remove();

      // Add GA4 script
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${premiumFeatures.google_analytics_id}`;
      document.head.appendChild(gaScript);

      // Add GA4 config script
      const gaConfigScript = document.createElement('script');
      gaConfigScript.setAttribute('data-ga-config', 'true');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${premiumFeatures.google_analytics_id}');
      `;
      document.head.appendChild(gaConfigScript);
    }

    // Google Search Console Verification Meta Tag
    if (premiumFeatures?.google_search_console_verification) {
      // Remove existing GSC meta tag to prevent duplicates
      const existingGSCMeta = document.querySelector('meta[name="google-site-verification"]');
      if (existingGSCMeta) existingGSCMeta.remove();

      // Add GSC verification meta tag
      const gscMeta = document.createElement('meta');
      gscMeta.name = 'google-site-verification';
      gscMeta.content = premiumFeatures.google_search_console_verification;
      document.head.appendChild(gscMeta);
    }

    // Cleanup function to remove scripts when component unmounts or data changes
    return () => {
      if (premiumFeatures?.google_analytics_id) {
        const gaScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${premiumFeatures.google_analytics_id}"]`);
        const gaConfigScript = document.querySelector('script[data-ga-config="true"]');
        if (gaScript) gaScript.remove();
        if (gaConfigScript) gaConfigScript.remove();
      }
      
      if (premiumFeatures?.google_search_console_verification) {
        const gscMeta = document.querySelector('meta[name="google-site-verification"]');
        if (gscMeta) gscMeta.remove();
      }
    };
  }, [premiumFeatures?.google_analytics_id, premiumFeatures?.google_search_console_verification]);

  return null; // This component doesn't render anything visible
};

export default HeadScripts;