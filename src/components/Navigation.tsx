import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Nosotros', href: '/about' },
    { label: 'Menú', href: '/menu' },
    { label: 'Reseñas', href: '/reviews' },
    { label: 'Contacto', href: '/contact' },
  ];

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">
              Savoria
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
            <div className="flex items-center space-x-3">
              <Button 
                className="btn-ghost px-4 py-2 rounded-full text-sm"
                onClick={() => window.open('tel:+51987654321', '_self')}
              >
                Llamar
              </Button>
              <Button 
                className="btn-primary px-6 py-2 rounded-full"
                onClick={() => window.open('https://wa.me/51987654321?text=Hola, me gustaría hacer una reserva', '_blank')}
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
              <div className="px-3 py-2 space-y-2">
                <Button 
                  className="btn-ghost w-full rounded-full"
                  onClick={() => window.open('tel:+51987654321', '_self')}
                >
                  Llamar
                </Button>
                <Button 
                  className="btn-primary w-full rounded-full"
                  onClick={() => window.open('https://wa.me/51987654321?text=Hola, me gustaría hacer una reserva', '_blank')}
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