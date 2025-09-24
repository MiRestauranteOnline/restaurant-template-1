import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const restaurantInfo = [
    {
      title: "Contacto",
      items: [
        { icon: Phone, text: "+51 987 654 321" },
        { icon: Mail, text: "info@savoria.com" },
        { icon: MapPin, text: "Av. Larco 123, Miraflores, Lima" }
      ]
    },
    {
      title: "Horarios",
      items: [
        "Lunes - Jueves: 12:00 PM - 10:00 PM",
        "Viernes - Sábado: 12:00 PM - 11:00 PM", 
        "Domingo: 12:00 PM - 9:00 PM"
      ]
    },
    {
      title: "Enlaces",
      items: [
        { label: "Menú", href: "/menu" },
        { label: "Sobre Nosotros", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "Contacto", href: "/contact" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-heading font-bold text-gradient mb-4">
              Savoria
            </h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Experimenta la excelencia culinaria en un ambiente de elegancia refinada. 
              Cada comida está elaborada con pasión y los mejores ingredientes.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-accent hover:text-accent-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Restaurant Information */}
          {restaurantInfo.map((section, index) => (
            <div key={index}>
              <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-foreground/70">
                    {section.title === "Contacto" ? (
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4 text-accent" />
                        <span>{item.text}</span>
                      </div>
                    ) : section.title === "Enlaces" ? (
                      <a
                        href={item.href}
                        className="hover:text-accent transition-colors duration-300"
                      >
                        {item.label}
                      </a>
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Actions */}
        <div className="bg-secondary/20 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <h4 className="text-2xl font-heading font-semibold mb-3 text-foreground">
              ¿Listo para una experiencia culinaria única?
            </h4>
            <p className="text-foreground/70 mb-6">
              Contáctanos ahora para hacer tu reserva o conocer más sobre nuestro menú.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button 
                className="btn-primary px-6 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/51987654321?text=Hola, me gustaría hacer una reserva', '_blank')}
              >
                WhatsApp
              </button>
              <button 
                className="btn-ghost px-6 py-3 rounded-full"
                onClick={() => window.open('tel:+51987654321', '_self')}
              >
                Llamar
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-foreground/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Restaurante Savoria. Todos los derechos reservados.
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <span className="text-foreground/60">
                Hecho con ❤️ en Lima, Perú
              </span>
              <span className="text-foreground/60">
                Website by{' '}
                <a 
                  href="https://mirestaurante.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  mirestaurante.online
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;