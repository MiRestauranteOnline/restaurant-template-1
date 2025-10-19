import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';

interface PageMetadataProps {
  pageType: 'home' | 'menu' | 'contact' | 'about' | 'reviews';
}

const PageMetadata = ({ pageType }: PageMetadataProps) => {
  const { pageMetadata, client } = useClient();

  useEffect(() => {
    // Find metadata for this page type
    const metadata = pageMetadata.find(m => m.page_type === pageType);

    if (!metadata) return;

    // Update document title
    if (metadata.meta_title) {
      document.title = metadata.meta_title;
    }

    // Remove existing meta tags for this page
    const existingMetaTags = document.querySelectorAll(
      'meta[name="description"], meta[name="keywords"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]'
    );
    existingMetaTags.forEach(tag => tag.remove());

    // Add meta description
    if (metadata.meta_description) {
      const metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = metadata.meta_description;
      document.head.appendChild(metaDescription);
    }

    // Add keywords
    if (metadata.keywords) {
      const metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = metadata.keywords;
      document.head.appendChild(metaKeywords);
    }

    // Add Open Graph title
    if (metadata.og_title) {
      const ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.content = metadata.og_title;
      document.head.appendChild(ogTitle);
    }

    // Add Open Graph description
    if (metadata.og_description) {
      const ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.content = metadata.og_description;
      document.head.appendChild(ogDescription);
    }

    // Add Twitter title
    if (metadata.twitter_title) {
      const twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      twitterTitle.content = metadata.twitter_title;
      document.head.appendChild(twitterTitle);
    }

    // Add Twitter description
    if (metadata.twitter_description) {
      const twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      twitterDescription.content = metadata.twitter_description;
      document.head.appendChild(twitterDescription);
    }

    // Add Open Graph site name
    if (client?.restaurant_name) {
      const ogSiteName = document.createElement('meta');
      ogSiteName.setAttribute('property', 'og:site_name');
      ogSiteName.content = client.restaurant_name;
      document.head.appendChild(ogSiteName);
    }

    // Cleanup function
    return () => {
      const metaTags = document.querySelectorAll(
        'meta[name="description"], meta[name="keywords"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"], meta[property="og:site_name"]'
      );
      metaTags.forEach(tag => tag.remove());
    };
  }, [pageMetadata, pageType, client?.restaurant_name]);

  return null;
};

export default PageMetadata;
