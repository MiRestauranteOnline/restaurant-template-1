import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

const FaviconManager = () => {
  const { client } = useClient();

  useEffect(() => {
    if (!client?.favicon_url) return;

    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Determine file type from URL
    const url = client.favicon_url;
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
      if (client?.favicon_url) {
        const favicons = document.querySelectorAll(`link[href="${client.favicon_url}"]`);
        favicons.forEach(link => link.remove());
      }
    };
  }, [client?.favicon_url]);

  return null; // This component doesn't render anything visible
};

export default FaviconManager;
