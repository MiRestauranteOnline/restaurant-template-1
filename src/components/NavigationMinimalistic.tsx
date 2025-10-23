import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedNavigationData, getCachedAdminContent, getCachedClientSettings } from '@/utils/cachedContent';
import { useAnalyticsContext } from '@/components/AnalyticsProvider';

const NavigationMinimalistic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { client, clientSettings, adminContent } = useClient();
  const { trackButtonClick } = useAnalyticsContext();

  // Get cached navigation data to prevent layout shifts
  const cachedNav = getCachedNavigationData();
  const cachedAdmin = getCachedAdminContent();
  const cachedSettings = getCachedClientSettings();
  
  // Get navigation labels from admin content
  const navHomeText = (adminContent as any)?.nav_home_text || (cachedAdmin as any)?.nav_home_text || 'Inicio';
  const navAboutText = (adminContent as any)?.nav_about_text || (cachedAdmin as any)?.nav_about_text || 'Sobre Nosotros';
  const navMenuText = (adminContent as any)?.nav_menu_text || (cachedAdmin as any)?.nav_menu_text || 'Menú';
  const navReviewsText = (adminContent as any)?.nav_reviews_text || (cachedAdmin as any)?.nav_reviews_text || 'Reseñas';
  const navContactText = (adminContent as any)?.nav_contact_text || (cachedAdmin as any)?.nav_contact_text || 'Contacto';
  
  const hasReviews = (adminContent as any)?.homepage_reviews_enabled || cachedNav?.has_reviews || false;
  const showDeliveryInNav = cachedNav?.delivery_services?.length > 0;
  const logoUrl = adminContent?.header_logo_url || cachedAdmin?.header_logo_url;
  const customCtaText = clientSettings?.custom_cta_button_text || cachedSettings?.custom_cta_button_text;
  const customCtaLink = clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: navHomeText, href: '/' },
    { label: navAboutText, href: '/nosotros' },
    { label: navMenuText, href: '/menu' },
    { label: navReviewsText, href: '/resenas' },
    { label: navContactText, href: '/contacto' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            {logoUrl ? (
              <img src={logoUrl} alt={client?.restaurant_name || 'Restaurant'} className="h-8" />
            ) : (
              <span className="text-2xl font-heading font-light tracking-wide">
                {client?.restaurant_name || 'Restaurant'}
              </span>
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm tracking-[0.2em] uppercase text-foreground/70 hover:text-accent transition-colors ${
                  link.href === '/resenas' && !hasReviews ? 'invisible' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
            {customCtaText && customCtaLink && (
              <Button 
                className="btn-primary px-6 py-2 text-xs rounded-none tracking-wider uppercase"
                onClick={() => {
                  trackButtonClick('cta', { source: 'navigation_desktop', text: customCtaText });
                  if (customCtaLink.startsWith('#')) {
                    document.querySelector(customCtaLink)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.open(customCtaLink, '_blank');
                  }
                }}
              >
                {customCtaText}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-[0.2em] uppercase text-foreground/70 hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {customCtaText && customCtaLink && (
                <Button 
                  className="btn-primary px-6 py-2 text-xs rounded-none tracking-wider uppercase w-full"
                  onClick={() => {
                    trackButtonClick('cta', { source: 'navigation_mobile', text: customCtaText });
                    setIsMobileMenuOpen(false);
                    if (customCtaLink.startsWith('#')) {
                      document.querySelector(customCtaLink)?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.open(customCtaLink, '_blank');
                    }
                  }}
                >
                  {customCtaText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationMinimalistic;
