import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientSettings } from '@/utils/cachedContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { client, clientSettings, reviews } = useClient();
  const location = useLocation();

  // Get cached settings to prevent layout shifts
  const cachedSettings = getCachedClientSettings();

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

  // Filter out Reviews if no reviews exist
  const navItems = baseNavItems.filter(item => {
    if (item.href === '/reviews') {
      return reviews && reviews.length > 0;
    }
    return true;
  });

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  // ====================================
  // 🔒 PROTECTED DYNAMIC FUNCTIONALITY 
  // ====================================
  // DO NOT MODIFY: This section fetches delivery data from Supabase database
  // Clients can configure delivery URLs and navigation visibility through admin panel
  
  const getDeliveryServices = () => {
    const clientDelivery = (client as any)?.delivery;
    const settingsDelivery = (clientSettings as any)?.delivery_info;

    if (!clientDelivery && !settingsDelivery) return [];

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
          <div className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">
              {client?.restaurant_name || 'Savoria'}
            </h1>
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
                }`}
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
              <Button 
                className="btn-ghost px-4 py-2 rounded-full text-sm"
                onClick={() => window.open(`tel:${client?.phone || '+51987654321'}`, '_self')}
              >
                Llamar
              </Button>
              <Button 
                className="btn-primary px-6 py-2 rounded-full"
                onClick={() => {
                  const whatsappNumber = client?.whatsapp || client?.phone || '51987654321';
                  window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría hacer una reserva')}`, '_blank');
                }}
              >
                WhatsApp
              </Button>
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
                <Button 
                  className="btn-ghost w-full rounded-full"
                  onClick={() => window.open(`tel:${client?.phone || '+51987654321'}`, '_self')}
                >
                  Llamar
                </Button>
                <Button 
                  className="btn-primary w-full rounded-full"
                  onClick={() => {
                    const whatsappNumber = client?.whatsapp || client?.phone || '51987654321';
                    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría hacer una reserva')}`, '_blank');
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;