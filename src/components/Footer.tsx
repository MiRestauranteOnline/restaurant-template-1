import { Instagram, Facebook, Mail, Phone, MapPin, Youtube, Linkedin } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { formatOpeningHours } from '@/utils/formatOpeningHours';
import { getCachedClientData, getCachedAdminContent } from '@/utils/cachedContent';
import { useAnalyticsContext } from '@/components/AnalyticsProvider';

const Footer = () => {
  const { client, adminContent } = useClient();
  const { trackButtonClick } = useAnalyticsContext();
  
  // Get cached client data to prevent layout shifts
  const cachedClient = getCachedClientData();
  const cachedAdminContent = getCachedAdminContent();

  const restaurantInfo = [
    {
      title: "Contacto",
      items: [
        ...(client?.phone || cachedClient?.phone ? [{ icon: Phone, text: client?.phone ? `${client.phone_country_code || '+51'} ${client.phone}` : "+51 987 654 321" }] : []),
        ...(client?.email ? [{ icon: Mail, text: client.email }] : []),
        ...(client?.address ? [{ icon: MapPin, text: client.address }] : [])
      ]
    },
    {
      title: "Horarios",
      items: formatOpeningHours(client?.opening_hours_ordered || client?.opening_hours)
    },
    {
      title: "Enlaces",
      items: [
        { label: "Menú", href: "/menu" },
        { label: "Sobre Nosotros", href: "/about" },
        { label: "Reseñas", href: "/reviews" },
        { label: "Contacto", href: "/contact" }
      ]
    }
  ];

  // Generate social links from database
  const getSocialLinks = () => {
    const links = [];
    const socialData = client?.social_media_links || {};
    
    const socialPlatforms = [
      { key: 'instagram', icon: Instagram, label: 'Instagram' },
      { key: 'facebook', icon: Facebook, label: 'Facebook' },
      { key: 'tiktok', icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.33-1.884-1.373-3.011h-.001C16.343 1.1 16.263 1 16.16 1h-3.107c-.103 0-.183.1-.207.227-.024.127-.024.26-.024.39v11.036c0 .024 0 .048-.005.072-.005.024-.005.048-.01.072a2.618 2.618 0 0 1-.528 1.479c-.413.413-.966.641-1.55.641-.584 0-1.137-.228-1.55-.641a2.207 2.207 0 0 1-.641-1.55c0-.584.228-1.137.641-1.55.413-.413.966-.641 1.55-.641.127 0 .258.024.385.048.122.024.226-.073.226-.202V6.29c0-.122-.098-.221-.221-.202a5.987 5.987 0 0 0-.624-.024c-1.674 0-3.226.652-4.392 1.818S4.24 10.462 4.24 12.136s.652 3.226 1.818 4.392 2.718 1.818 4.392 1.818 3.226-.652 4.392-1.818 1.818-2.718 1.818-4.392V8.474a8.1 8.1 0 0 0 2.661 1.818z"/>
        </svg>
      ), label: 'TikTok' },
      { key: 'youtube', icon: Youtube, label: 'YouTube' },
      { key: 'x', icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), label: 'X' },
      { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
      { key: 'email', icon: Mail, label: 'Email' }
    ];

    socialPlatforms.forEach(platform => {
      if (socialData[platform.key]) {
        links.push({
          icon: platform.icon,
          href: platform.key === 'email' ? `mailto:${socialData[platform.key]}` : socialData[platform.key],
          label: platform.label
        });
      }
    });

    return links;
  };

  const socialLinks = getSocialLinks();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            {/* Logo Section - Fixed height to prevent layout shift */}
            <div className="h-12 mb-4 flex items-center"> {/* Fixed height container */}
              {adminContent?.footer_logo_url ? (
                <img 
                  src={adminContent.footer_logo_url} 
                  alt={`${client?.restaurant_name || 'Restaurant'} Logo`}
                  className="h-full w-auto object-contain max-w-[200px]"
                />
              ) : (
                <h3 className="text-3xl font-heading font-bold text-gradient">
                  {client?.restaurant_name || 'Restaurant'}
                </h3>
              )}
            </div>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              {adminContent?.footer_description || 'Experimenta la excelencia culinaria en un ambiente de elegancia refinada. Cada comida está elaborada con pasión y los mejores ingredientes.'}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-accent hover:text-accent-foreground" />
                  </a>
                ))}
              </div>
            )}
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
                        {item.icon === Mail ? (
                          <a 
                            href={`mailto:${item.text}`}
                            className="hover:text-accent transition-colors"
                          >
                            {item.text}
                          </a>
                        ) : (
                          <span>{item.text}</span>
                        )}
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

        {/* Contact Actions - CTA Section */}
        {(() => {
          const hideReservationBox = adminContent?.homepage_contact_hide_reservation_box || false;
          const ctaTitle = adminContent?.homepage_cta_title;
          const ctaDescription = adminContent?.homepage_cta_description;
          const button1Text = adminContent?.homepage_cta_button1_text;
          const button1Link = adminContent?.homepage_cta_button1_link;
          const button2Text = adminContent?.homepage_cta_button2_text;
          const button2Link = adminContent?.homepage_cta_button2_link;
          const whatsappMessage = adminContent?.whatsapp_general_message || 'Hola, me gustaría hacer una reserva';
          
          const showButton1 = button1Text && (button1Link || client?.whatsapp || cachedClient?.whatsapp);
          const showButton2 = button2Text && (button2Link || client?.phone || cachedClient?.phone);
          
          // Don't show section if hidden or if no buttons would be shown
          if (hideReservationBox || (!showButton1 && !showButton2)) return null;
          
          return (
            <div className="bg-secondary/20 rounded-2xl p-8 mb-8">
              <div className="text-center">
                {ctaTitle && (
                  <h4 className="text-2xl font-heading font-semibold mb-3 text-foreground">
                    {ctaTitle}
                  </h4>
                )}
                {ctaDescription && (
                  <p className="text-foreground/70 mb-6">
                    {ctaDescription}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  {showButton1 && (
                    <button 
                      className="btn-primary px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all hover:scale-105"
                      onClick={() => {
                        if (button1Link) {
                          trackButtonClick('cta', { source: 'footer', text: button1Text });
                          window.open(button1Link, '_blank');
                        } else {
                          trackButtonClick('whatsapp', { source: 'footer' });
                          const whatsappNumber = client?.whatsapp ? 
                            `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                            '51987654321';
                          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                        }
                      }}
                    >
                      {button1Text}
                    </button>
                  )}
                  {showButton2 && (
                    <button 
                      className="btn-ghost px-6 py-3 rounded-full hover:scale-105 transition-all"
                      onClick={() => {
                        if (button2Link) {
                          trackButtonClick('cta', { source: 'footer', text: button2Text });
                          window.open(button2Link, '_blank');
                        } else {
                          trackButtonClick('phone', { source: 'footer' });
                          const phoneNumber = client?.phone ? 
                            `${client.phone_country_code || '+51'}${client.phone}` : 
                            '+51987654321';
                          window.open(`tel:${phoneNumber}`, '_self');
                        }
                      }}
                    >
                      {button2Text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-foreground/60 text-sm mb-4 md:mb-0">
              <div>© {new Date().getFullYear()} Restaurante {client?.restaurant_name || 'Savoria'}. Todos los derechos reservados.</div>
              <div className="mt-1">
                {client?.razon_social || 'Mi Restaurante Online'} | RUC: {client?.ruc || '20123456789'}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <span className="text-foreground/60">
                Hecho con ❤️ en Lima, Perú
              </span>
              <span className="text-foreground/60">
                Sitio web por{' '}
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