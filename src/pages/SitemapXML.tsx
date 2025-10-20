import { useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { BookOpen, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const SitemapXML = () => {
  const { client, adminContent, menuItems, reviews, loading } = useClient();

  const sitemapData = useMemo(() => {
    if (loading || !client) return null;

    // Determine base URL
    const baseUrl = client?.domain && client?.domain_verified
      ? `https://${client.domain}`
      : client?.subdomain
        ? `https://${client.subdomain}.lovable.app`
        : window.location.origin;

    const today = new Date().toISOString().split('T')[0];

    // Always include homepage and contact
    const urls = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0, lastmod: today, label: 'Home' },
      { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.7, lastmod: today, label: 'Contact' },
    ];

    // Add menu page if menu items exist
    if (menuItems && menuItems.length > 0) {
      urls.push({ loc: `${baseUrl}/menu`, changefreq: 'weekly', priority: 0.8, lastmod: today, label: 'Menu' });
    }

    // Add about page if visible in admin content
    if (adminContent?.about_page_about_section_visible) {
      urls.push({ loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.7, lastmod: today, label: 'About' });
    }

    // Add reviews page if reviews exist
    if (reviews && reviews.length > 0) {
      urls.push({ loc: `${baseUrl}/reviews`, changefreq: 'weekly', priority: 0.6, lastmod: today, label: 'Reviews' });
    }

    const highPriorityCount = urls.filter(u => u.priority >= 0.8).length;

    return { urls, baseUrl, highPriorityCount };
  }, [client, adminContent, menuItems, reviews, loading]);

  if (loading) return <LoadingSpinner />;
  if (!sitemapData) return <LoadingSpinner />;

  const { urls, baseUrl, highPriorityCount } = sitemapData;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-cyan-400">Sitemap</h1>
          </div>
          <p className="text-gray-400 text-lg">
            XML Sitemap for {client?.restaurant_name || 'Mi Restaurante Online'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#142030] border border-cyan-900/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{urls.length}</div>
            <div className="text-sm text-gray-400">Total URLs</div>
          </div>
          <div className="bg-[#142030] border border-cyan-900/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{highPriorityCount}</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </div>
          <div className="bg-[#142030] border border-cyan-900/30 rounded-lg p-6 col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{client?.restaurant_name?.slice(0, 2) || 'MR'}</div>
            <div className="text-sm text-gray-400">Site Pages</div>
          </div>
        </div>

        {/* Main Pages Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-cyan-400">Main Pages</h2>
          </div>
          
          <div className="space-y-4">
            {urls.map((url, index) => (
              <div 
                key={index}
                className="bg-[#142030] border border-cyan-900/30 rounded-lg p-6 hover:border-cyan-700/50 transition-colors"
              >
                <a 
                  href={url.loc}
                  className="text-cyan-400 hover:text-cyan-300 text-lg font-medium mb-3 block break-all"
                >
                  {url.loc}
                </a>
                <div className="flex flex-wrap gap-6 text-sm">
                  <span className="text-gray-400">
                    <span className={url.priority >= 0.8 ? 'text-cyan-400' : 'text-yellow-500'}>
                      Priority: {url.priority.toFixed(1)}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Update: <span className="text-gray-300">{url.changefreq}</span>
                  </span>
                  <span className="text-gray-400">
                    Modified: <span className="text-gray-300">{url.lastmod}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>This sitemap is dynamically generated based on available content.</p>
          <p className="mt-2">Last updated: {new Date().toISOString().split('T')[0]}</p>
        </div>
      </div>
    </div>
  );
};

export default SitemapXML;
