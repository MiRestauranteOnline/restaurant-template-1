import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

const HeadScripts = () => {
  const { premiumFeatures, client } = useClient();

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

    // Geo Location Meta Tag
    if (client?.country_code) {
      const existingGeoMeta = document.querySelector('meta[name="geo.region"]');
      if (existingGeoMeta) existingGeoMeta.remove();

      const geoMeta = document.createElement('meta');
      geoMeta.name = 'geo.region';
      geoMeta.content = client.country_code;
      document.head.appendChild(geoMeta);
    }

    // Content Language Meta Tag
    if (client?.locale) {
      const existingLangMeta = document.querySelector('meta[http-equiv="content-language"]');
      if (existingLangMeta) existingLangMeta.remove();

      const langMeta = document.createElement('meta');
      langMeta.httpEquiv = 'content-language';
      langMeta.content = client.locale;
      document.head.appendChild(langMeta);
    }

    // Open Graph Locale Meta Tag
    if (client?.locale) {
      const existingOgLocaleMeta = document.querySelector('meta[property="og:locale"]');
      if (existingOgLocaleMeta) existingOgLocaleMeta.remove();

      const ogLocaleMeta = document.createElement('meta');
      ogLocaleMeta.setAttribute('property', 'og:locale');
      ogLocaleMeta.content = client.locale;
      document.head.appendChild(ogLocaleMeta);
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

      if (client?.country_code) {
        const geoMeta = document.querySelector('meta[name="geo.region"]');
        if (geoMeta) geoMeta.remove();
      }

      if (client?.locale) {
        const langMeta = document.querySelector('meta[http-equiv="content-language"]');
        if (langMeta) langMeta.remove();
        const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
        if (ogLocaleMeta) ogLocaleMeta.remove();
      }
    };
  }, [premiumFeatures?.google_analytics_id, premiumFeatures?.google_search_console_verification, client?.country_code, client?.locale]);

  return null; // This component doesn't render anything visible
};

export default HeadScripts;