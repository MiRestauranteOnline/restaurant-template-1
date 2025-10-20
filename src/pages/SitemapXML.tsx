import { useEffect } from 'react';
import { useClient } from '@/contexts/ClientContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const SitemapXML = () => {
  const { client, adminContent, menuItems, reviews, loading } = useClient();

  useEffect(() => {
    if (loading || !client) return;

    // Determine base URL
    const baseUrl = client?.domain && client?.domain_verified
      ? `https://${client.domain}`
      : client?.subdomain
        ? `https://${client.subdomain}.lovable.app`
        : window.location.origin;

    const today = new Date().toISOString().split('T')[0];

    // Always include homepage and contact
    const urls = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: today },
      { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7', lastmod: today },
    ];

    // Add menu page if menu items exist
    if (menuItems && menuItems.length > 0) {
      urls.push({ loc: `${baseUrl}/menu`, changefreq: 'weekly', priority: '0.8', lastmod: today });
    }

    // Add about page if visible in admin content
    if (adminContent?.about_page_about_section_visible) {
      urls.push({ loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.7', lastmod: today });
    }

    // Add reviews page if reviews exist
    if (reviews && reviews.length > 0) {
      urls.push({ loc: `${baseUrl}/reviews`, changefreq: 'weekly', priority: '0.6', lastmod: today });
    }

    // Generate XML sitemap (proper format for search engines)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    // Replace page content with XML
    document.open();
    document.write(xml);
    document.close();
    
    // Set proper XML content type
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Type';
    meta.content = 'application/xml; charset=utf-8';
    if (document.head) {
      document.head.appendChild(meta);
    }
  }, [client, adminContent, menuItems, reviews, loading]);

  if (loading) return <LoadingSpinner />;

  return null;
};

export default SitemapXML;
