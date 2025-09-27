import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientSettings, getCachedNavigationData, getFastLoadCachedContent, getCachedClientData } from '@/utils/cachedContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { client, clientSettings, reviews, adminContent, loading } = useClient();
  const location = useLocation();

  // Get cached settings and navigation data to prevent layout shifts
  const cachedSettings = getCachedClientSettings();
  const cachedNavData = getCachedNavigationData();
  const fastLoadData = getFastLoadCachedContent();
  const cachedClient = getCachedClientData();

  // Prevent text-to-logo shift: prefer fast-load data, then cached, then live data
  const logoUrl = adminContent?.header_logo_url; // Use only live database data
  const isLoadingAdmin = !logoUrl && loading;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseNavItems = [
    { label: (adminContent as any)?.navigation_home_label || 'Inicio', href: '/' },
    { label: (adminContent as any)?.navigation_about_label || 'Sobre Nosotros', href: '/about' },
    { label: (adminContent as any)?.navigation_menu_label || 'Menú', href: '/menu' },
    { label: (adminContent as any)?.navigation_reviews_label || 'Reseñas', href: '/reviews' },
    { label: (adminContent as any)?.navigation_contact_label || 'Contacto', href: '/contact' },
  ];

  // Determine if Reviews link should be visible - prioritize cached/explicit config to prevent shifts
  const explicitReviewsConfig = (clientSettings as any)?.other_customizations?.show_reviews_nav;
  const cachedHasReviews = cachedNavData?.has_reviews;
  const currentHasReviews = reviews && reviews.length > 0;
  
  // Use explicit config if set, otherwise use cached value, otherwise use current data
  // Default to FALSE to prevent "show then hide" layout shift on first load
  const showReviewsLink = explicitReviewsConfig !== undefined 
    ? explicitReviewsConfig 
    : cachedHasReviews !== undefined 
      ? cachedHasReviews 
      : currentHasReviews || false; // Conservative default: don't show until confirmed

  // Always render all nav items to prevent layout shifts
  const navItems = baseNavItems;

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  // ====================================
  // 🔒 PROTECTED DYNAMIC FUNCTIONALITY 
  // ====================================
  // DO NOT MODIFY: This section fetches delivery data from Supabase database
  // Clients can configure delivery URLs and navigation visibility through admin panel
  
  const getDeliveryServices = () => {
    // First try to use cached delivery services to prevent layout shifts
    if (cachedNavData?.delivery_services && cachedNavData.delivery_services.length > 0 && (!client || !clientSettings)) {
      return cachedNavData.delivery_services;
    }
    
    const clientDelivery = (client as any)?.delivery;
    const settingsDelivery = (clientSettings as any)?.delivery_info;

    if (!clientDelivery && !settingsDelivery) {
      return cachedNavData?.delivery_services || [];
    }

    const fromClient = !!clientDelivery;

    const services = [
      {
        name: 'Rappi',
        url: fromClient ? clientDelivery?.rappi : settingsDelivery?.rappi?.url,
        show: fromClient ? true : settingsDelivery?.rappi?.show_in_nav !== false,
      },
      {
        name: 'PedidosYa',
        url: fromClient ? clientDelivery?.pedidos_ya : settingsDelivery?.pedidosya?.url,
        show: fromClient ? true : settingsDelivery?.pedidosya?.show_in_nav !== false,
      },
      {
        name: 'DiDi Food',
        url: fromClient ? clientDelivery?.didi_food : settingsDelivery?.didi?.url,
        show: fromClient ? true : settingsDelivery?.didi?.show_in_nav !== false,
      },
    ];

    return services.filter((service) => service.url && service.show);
  };
  
  // ====================================
  // END PROTECTED SECTION  
  // ====================================

  const deliveryServices = getDeliveryServices();
  const showDeliveryMenu = deliveryServices.length > 0;

  // Get header background settings with cached fallbacks
  const headerBackgroundEnabled = clientSettings?.header_background_enabled ?? cachedSettings?.header_background_enabled ?? false;
  const headerBackgroundStyle = clientSettings?.header_background_style ?? cachedSettings?.header_background_style ?? 'dark';
  
  // Dynamic header background logic
  const getHeaderBackground = () => {
    if (!headerBackgroundEnabled) {
      return isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent';
    }
    
    // When header background is enabled, use explicit dark/bright classes
    if (headerBackgroundStyle === 'bright') {
      return 'header-bg-bright';
    } else {
      return 'header-bg-dark';
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${getHeaderBackground()}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 🔒 PROTECTED: Dynamic restaurant name from Supabase - DO NOT MODIFY LOGIC */}
          {/* Fixed height container to prevent layout shift */}
          <div className="nav-logo-container flex-shrink-0">
            <a href="/" className="block h-full" aria-label="Ir al inicio">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${client?.restaurant_name || 'Restaurant'} Logo`}
                  className="h-full w-auto max-w-[200px] object-contain"
                  width="200"
                  height="48"
                  style={{ aspectRatio: '200/48' }}
                />
              ) : isLoadingAdmin ? (
                <div className="h-10 md:h-12 w-32 bg-foreground/10 rounded animate-pulse" />
              ) : (
                <h1 className="text-xl md:text-2xl font-heading font-bold text-gradient h-full flex items-center">
                  {client?.restaurant_name || 'Restaurant'}
                </h1>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`transition-colors duration-300 font-medium ${
                  isActivePage(item.href) 
                    ? 'text-accent font-bold' 
                    : 'text-foreground/80 hover:text-accent'
                } ${item.href === '/reviews' && !showReviewsLink ? 'invisible' : ''}`}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {item.label}
              </a>
            ))}
            
            {/* Delivery Dropdown */}
            {showDeliveryMenu && (
              <DropdownMenu>
                <DropdownMenuTrigger className="font-medium text-foreground/80 hover:text-accent transition-colors duration-300 flex items-center cursor-pointer">
                  Delivery <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border border-border">
                  {deliveryServices.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <a 
                        href={service.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {service.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* 🔒 PROTECTED: Dynamic phone/WhatsApp from Supabase - DO NOT MODIFY LOGIC */}
            <div className="flex items-center space-x-3">
              {(client?.phone || cachedClient?.phone) && !(clientSettings?.hide_phone_button_menu ?? cachedSettings?.hide_phone_button_menu ?? false) && (
                <Button 
                  className="btn-ghost px-4 py-2 rounded-full text-sm"
                  onClick={() => {
                    const phoneNumber = client?.phone ? 
                      `${client.phone_country_code || '+51'}${client.phone}` : 
                      `${cachedClient?.phone_country_code || '+51'}${cachedClient?.phone}`;
                    window.open(`tel:${phoneNumber}`, '_self');
                  }}
                >
                  {(adminContent as any)?.call_button_label || 'Llamar'}
                </Button>
              )}
              {(client?.whatsapp || cachedClient?.whatsapp) && !(clientSettings?.hide_whatsapp_button_menu ?? cachedSettings?.hide_whatsapp_button_menu ?? false) && (
                <Button 
                  className="btn-primary px-6 py-2 rounded-full"
                  onClick={() => {
                    const whatsappNumber = client?.whatsapp ? 
                      `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                      `${cachedClient?.whatsapp_country_code?.replace('+', '') || '51'}${cachedClient?.whatsapp}`;
                    const message = adminContent?.whatsapp_general_message || 'Hola, me gustaría hacer una reserva';
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  {(adminContent as any)?.whatsapp_button_label || 'WhatsApp'}
                </Button>
              )}
              {(clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link) && (
                <Button 
                  className="btn-secondary px-6 py-2 rounded-full"
                  onClick={() => {
                    const link = clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link;
                    if (link?.startsWith('http')) {
                      window.open(link, '_blank');
                    } else if (link?.startsWith('#')) {
                      document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = link || '#';
                    }
                  }}
                >
                  {clientSettings?.custom_cta_button_text || cachedSettings?.custom_cta_button_text || 'CTA'}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 transition-colors duration-300 ${
                    isActivePage(item.href) 
                      ? 'text-accent font-bold' 
                      : 'text-foreground/80 hover:text-accent'
                  }`}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Delivery Services */}
              {showDeliveryMenu && (
                <div className="px-3 py-2">
                  <div className="font-medium text-foreground/80 mb-2">Delivery</div>
                  {deliveryServices.map((service) => (
                    <a
                      key={service.name}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2 pl-4 text-foreground/70 hover:text-accent transition-colors flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
              
              {/* 🔒 PROTECTED: Dynamic phone/WhatsApp from Supabase - DO NOT MODIFY LOGIC */}
              <div className="px-3 py-2 space-y-2">
                {(client?.phone || cachedClient?.phone) && !(clientSettings?.hide_phone_button_menu ?? cachedSettings?.hide_phone_button_menu ?? false) && (
                  <Button 
                    className="btn-ghost w-full rounded-full"
                    onClick={() => {
                      const phoneNumber = client?.phone ? 
                        `${client.phone_country_code || '+51'}${client.phone}` : 
                        `${cachedClient?.phone_country_code || '+51'}${cachedClient?.phone}`;
                      window.open(`tel:${phoneNumber}`, '_self');
                    }}
                >
                  {(adminContent as any)?.call_button_label || 'Llamar'}
                </Button>
                )}
                {(client?.whatsapp || cachedClient?.whatsapp) && !(clientSettings?.hide_whatsapp_button_menu ?? cachedSettings?.hide_whatsapp_button_menu ?? false) && (
                  <Button 
                    className="btn-primary w-full rounded-full"
                    onClick={() => {
                      const whatsappNumber = client?.whatsapp ? 
                        `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                        `${cachedClient?.whatsapp_country_code?.replace('+', '') || '51'}${cachedClient?.whatsapp}`;
                      const message = adminContent?.whatsapp_general_message || 'Hola, me gustaría hacer una reserva';
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                >
                  {(adminContent as any)?.whatsapp_button_label || 'WhatsApp'}
                </Button>
                )}
                {(clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link) && (
                  <Button 
                    className="btn-secondary w-full rounded-full"
                    onClick={() => {
                      const link = clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link;
                      if (link?.startsWith('http')) {
                        window.open(link, '_blank');
                      } else if (link?.startsWith('#')) {
                        document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = link || '#';
                      }
                    }}
                  >
                    {clientSettings?.custom_cta_button_text || cachedSettings?.custom_cta_button_text || 'CTA'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;