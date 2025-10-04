import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedNavigationData, getCachedAdminContent, getCachedClientSettings } from '@/utils/cachedContent';

const NavigationMinimalistic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { client, clientSettings, adminContent } = useClient();

  // Get cached navigation data to prevent layout shifts
  const cachedNav = getCachedNavigationData();
  const cachedAdmin = getCachedAdminContent();
  const cachedSettings = getCachedClientSettings();
  
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
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    ...(hasReviews ? [{ label: 'Reviews', href: '/reviews' }] : []),
    ...(showDeliveryInNav ? [{ label: 'Delivery', href: '/#delivery' }] : []),
    { label: 'Contact', href: '/contact' },
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
                className="text-sm tracking-[0.2em] uppercase text-foreground/70 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            {customCtaText && customCtaLink && (
              <Button 
                className="btn-primary px-6 py-2 text-xs rounded-none tracking-wider uppercase"
                onClick={() => {
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
