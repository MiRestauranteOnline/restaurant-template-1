import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientSettings, getCachedNavigationData, getFastLoadCachedContent, getCachedClientData } from '@/utils/cachedContent';
import { useAnalyticsContext } from '@/components/AnalyticsProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NavigationRustic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { client, clientSettings, reviews, adminContent, loading } = useClient();
  const { trackButtonClick } = useAnalyticsContext();
  const location = useLocation();

  const cachedSettings = getCachedClientSettings();
  const cachedNavData = getCachedNavigationData();
  const fastLoadData = getFastLoadCachedContent();
  const cachedClient = getCachedClientData();

  const logoUrl = adminContent?.header_logo_url;
  const isLoadingAdmin = !logoUrl && loading;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseNavItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Nosotros', href: '/about' },
    { label: 'Menú', href: '/menu' },
    { label: 'Reseñas', href: '/reviews' },
    { label: 'Contacto', href: '/contact' },
  ];

  const explicitReviewsConfig = (clientSettings as any)?.other_customizations?.show_reviews_nav;
  const cachedHasReviews = cachedNavData?.has_reviews;
  const currentHasReviews = reviews && reviews.length > 0;
  
  const showReviewsLink = explicitReviewsConfig !== undefined 
    ? explicitReviewsConfig 
    : cachedHasReviews !== undefined 
      ? cachedHasReviews 
      : currentHasReviews || false;

  const navItems = baseNavItems;

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  // ====================================
  // 🔒 PROTECTED DYNAMIC FUNCTIONALITY 
  // ====================================
  const getDeliveryServices = () => {
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

  const headerBackgroundEnabled = clientSettings?.header_background_enabled ?? cachedSettings?.header_background_enabled ?? false;
  const headerBackgroundStyle = clientSettings?.header_background_style ?? cachedSettings?.header_background_style ?? 'dark';
  
  const getHeaderBackground = () => {
    if (!headerBackgroundEnabled) {
      return isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent';
    }
    
    if (headerBackgroundStyle === 'bright') {
      return 'header-bg-bright';
    } else {
      return 'header-bg-dark';
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${getHeaderBackground()}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* 🔒 PROTECTED: Dynamic restaurant name from Supabase - DO NOT MODIFY LOGIC */}
          <div className="nav-logo-container flex-shrink-0">
            <a href="/" className="block h-full" aria-label="Ir al inicio">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${client?.restaurant_name || 'Restaurant'} Logo`}
                  className="h-full w-auto max-w-[240px] object-contain transition-transform hover:scale-105 duration-300"
                  width="240"
                  height="56"
                  style={{ aspectRatio: '240/56' }}
                />
              ) : isLoadingAdmin ? (
                <div className="h-12 md:h-14 w-36 bg-foreground/10 rounded animate-pulse" />
              ) : (
                <div className="text-2xl md:text-3xl font-heading font-bold text-gradient h-full flex items-center transition-all hover:scale-105 duration-300">
                  {client?.restaurant_name || 'Restaurant'}
                </div>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                  isActivePage(item.href) 
                    ? 'text-accent bg-accent/10 font-bold' 
                    : 'text-foreground/80 hover:text-accent hover:bg-accent/5'
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
                <DropdownMenuTrigger className="px-4 py-2 rounded-lg font-medium text-sm text-foreground/80 hover:text-accent hover:bg-accent/5 transition-all duration-300 flex items-center cursor-pointer">
                  Delivery <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border border-border shadow-xl">
                  {deliveryServices.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <a 
                        href={service.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer hover:bg-accent/10"
                      >
                        {service.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
            
          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* 🔒 PROTECTED: Dynamic phone/WhatsApp from Supabase - DO NOT MODIFY LOGIC */}
            {(client?.phone || cachedClient?.phone) && !(clientSettings?.hide_phone_button_menu ?? cachedSettings?.hide_phone_button_menu ?? false) && (
              <Button 
                className="btn-ghost px-5 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all"
                onClick={() => {
                  trackButtonClick('phone', { source: 'navigation_desktop' });
                  const phoneNumber = client?.phone ? 
                    `${client.phone_country_code || '+51'}${client.phone}` : 
                    `${cachedClient?.phone_country_code || '+51'}${cachedClient?.phone}`;
                  window.open(`tel:${phoneNumber}`, '_self');
                }}
              >
                Llamar
              </Button>
            )}
            {(client?.whatsapp || cachedClient?.whatsapp) && !(clientSettings?.hide_whatsapp_button_menu ?? cachedSettings?.hide_whatsapp_button_menu ?? false) && (
              <Button 
                className="btn-primary px-6 py-2 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
                onClick={() => {
                  trackButtonClick('whatsapp', { source: 'navigation_desktop' });
                  const whatsappNumber = client?.whatsapp ? 
                    `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                    `${cachedClient?.whatsapp_country_code?.replace('+', '') || '51'}${cachedClient?.whatsapp}`;
                  const message = adminContent?.whatsapp_general_message || 'Hola, me gustaría hacer una reserva';
                  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                WhatsApp
              </Button>
            )}
            {(clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link) && (
              <Button 
                className="btn-secondary px-6 py-2 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:bg-accent/10 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border shadow-lg rounded-b-2xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActivePage(item.href) 
                      ? 'text-accent bg-accent/10 font-bold' 
                      : 'text-foreground/80 hover:text-accent hover:bg-accent/5'
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
                <div className="pt-2">
                  <div className="px-4 py-2 font-medium text-sm text-foreground/60 uppercase tracking-wider">Delivery</div>
                  <div className="space-y-1">
                    {deliveryServices.map((service) => (
                      <a
                        key={service.name}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 pl-8 rounded-xl text-foreground/70 hover:text-accent hover:bg-accent/5 transition-all flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {service.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 🔒 PROTECTED: Dynamic phone/WhatsApp from Supabase - DO NOT MODIFY LOGIC */}
              <div className="pt-4 space-y-3">
                {(client?.phone || cachedClient?.phone) && !(clientSettings?.hide_phone_button_menu ?? cachedSettings?.hide_phone_button_menu ?? false) && (
                  <Button 
                    className="btn-ghost w-full rounded-xl py-3 text-base hover:scale-105 transition-all"
                    onClick={() => {
                      trackButtonClick('phone', { source: 'navigation_mobile' });
                      const phoneNumber = client?.phone ? 
                        `${client.phone_country_code || '+51'}${client.phone}` : 
                        `${cachedClient?.phone_country_code || '+51'}${cachedClient?.phone}`;
                      window.open(`tel:${phoneNumber}`, '_self');
                    }}
                  >
                    Llamar
                  </Button>
                )}
                {(client?.whatsapp || cachedClient?.whatsapp) && !(clientSettings?.hide_whatsapp_button_menu ?? cachedSettings?.hide_whatsapp_button_menu ?? false) && (
                  <Button 
                    className="btn-primary w-full rounded-xl py-3 text-base shadow-md hover:shadow-xl transition-all hover:scale-105"
                    onClick={() => {
                      trackButtonClick('whatsapp', { source: 'navigation_mobile' });
                      const whatsappNumber = client?.whatsapp ? 
                        `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                        `${cachedClient?.whatsapp_country_code?.replace('+', '') || '51'}${cachedClient?.whatsapp}`;
                      const message = adminContent?.whatsapp_general_message || 'Hola, me gustaría hacer una reserva';
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    WhatsApp
                  </Button>
                )}
                {(clientSettings?.custom_cta_button_link || cachedSettings?.custom_cta_button_link) && (
                  <Button 
                    className="btn-secondary w-full rounded-xl py-3 text-base shadow-md hover:shadow-xl transition-all hover:scale-105"
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

export default NavigationRustic;
