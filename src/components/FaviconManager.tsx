import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientData } from '@/utils/cachedContent';

const FaviconManager = () => {
  const { client } = useClient();

  useEffect(() => {
    // Try to use cached favicon first, then fall back to client data
    const cachedData = getCachedClientData();
    const faviconUrl = client?.favicon_url || cachedData?.favicon_url;
    
    if (!faviconUrl) return;

    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Determine file type from URL
    const url = faviconUrl;
    const extension = url.split('.').pop()?.toLowerCase();
    
    let mimeType = 'image/x-icon'; // default
    if (extension === 'png') mimeType = 'image/png';
    else if (extension === 'svg') mimeType = 'image/svg+xml';
    else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
    else if (extension === 'gif') mimeType = 'image/gif';

    // Add new favicon links
    const createFaviconLink = (sizes?: string) => {
      const link = document.createElement('link');
      link.rel = sizes ? 'icon' : 'icon';
      link.type = mimeType;
      link.href = url;
      if (sizes) link.setAttribute('sizes', sizes);
      return link;
    };

    // Add multiple sizes for better browser support
    document.head.appendChild(createFaviconLink());
    document.head.appendChild(createFaviconLink('16x16'));
    document.head.appendChild(createFaviconLink('32x32'));
    
    // Apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = url;
    document.head.appendChild(appleTouchIcon);

    // Cleanup function
    return () => {
      if (faviconUrl) {
        const favicons = document.querySelectorAll(`link[href="${faviconUrl}"]`);
        favicons.forEach(link => link.remove());
      }
    };
  }, [client?.favicon_url]); // Keep dependency on client data to update when it loads

  return null; // This component doesn't render anything visible
};

export default FaviconManager;
