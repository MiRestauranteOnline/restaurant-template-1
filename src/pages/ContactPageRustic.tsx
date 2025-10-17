import NavigationRustic from '@/components/NavigationRustic';
import FooterRustic from '@/components/FooterRustic';
import ContactRustic from '@/components/ContactRustic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import { formatOpeningHours } from '@/utils/formatOpeningHours';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';

const ContactPageRustic = () => {
  const { client, adminContent } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
  const contactHeroTitleFirst = 
    (adminContent as any)?.contact_page_hero_title_first_line ?? 
    cachedAdminContent?.contact_page_hero_title_first_line ?? 'Contáctanos';
  const contactHeroTitleSecond = 
    (adminContent as any)?.contact_page_hero_title_second_line ?? 
    cachedAdminContent?.contact_page_hero_title_second_line ?? 'y Reserva';
  const contactHeroDescription = 
    (adminContent as any)?.contact_page_hero_description ?? 
    cachedAdminContent?.contact_page_hero_description ?? 
    'Estamos aquí para ayudarte. Contacta con nosotros para reservas, consultas o cualquier información que necesites.';
  const contactHeroBackground = 
    (adminContent as any)?.contact_page_hero_background_url ?? 
    cachedAdminContent?.contact_page_hero_background_url ?? '/src/assets/grilled-steak.jpg';

  const formatHoursForContactPage = (hours: any) => {
    const formattedHours = formatOpeningHours(hours);
    return formattedHours.map(hourString => {
      const [day, time] = hourString.split(': ');
      return { day, time };
    });
  };

  const contactMethods = [
    ...(client?.phone || cachedClient?.phone ? [{
      icon: Phone,
      title: "Llámanos",
      content: client?.phone ? `${client.phone_country_code || '+51'} ${client.phone}` : "+51 987 654 321",
      action: () => {
        const phoneNumber = client?.phone ? 
          `${client.phone_country_code || '+51'}${client.phone}` : 
          '+51987654321';
        window.open(`tel:${phoneNumber}`, '_self');
      },
      buttonText: "Llamar Ahora"
    }] : []),
    ...(client?.whatsapp || cachedClient?.whatsapp ? [{
      icon: Mail,
      title: "WhatsApp", 
      content: "Envíanos un mensaje",
      action: () => {
        const whatsappNumber = client?.whatsapp ? 
          `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
          '51987654321';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría contactarlos')}`, '_blank');
      },
      buttonText: "Escribir"
    }] : []),
    {
      icon: MapPin,
      title: "Visítanos",
      content: client?.address || "Av. Larco 123, Miraflores, Lima",
      action: () => {
        if (client?.address) {
          window.open(`https://maps.google.com/?q=${encodeURIComponent(client.address)}`, '_blank');
        } else if (client?.coordinates) {
          const coords = client.coordinates;
          window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
        } else {
          window.open('https://maps.google.com', '_blank');
        }
      },
      buttonText: "Ver Mapa"
    }
  ];

  const hours = formatHoursForContactPage(client?.opening_hours_ordered || client?.opening_hours);

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationRustic />
        
        {/* Hero Section - Rustic Style */}
        <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${contactHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página de contacto"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4 block mb-4">
                {(adminContent as any)?.contact_us_label || 'Contáctanos'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 border-l-4 border-foreground/10 pl-4">
                <span className="block">{contactHeroTitleFirst}</span>
                {contactHeroTitleSecond && (
                  <span className="block text-gradient mt-2">{contactHeroTitleSecond}</span>
                )}
              </h1>
              <p className="text-xl text-foreground/90 leading-relaxed pl-4">
                {contactHeroDescription}
              </p>
            </div>
          </div>
        </section>

        <main>
          {/* Contact Methods */}
          <section className="py-12 lg:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <Card 
                    key={index}
                    className="border-2 border-border card-hover bg-card group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <method.icon className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                            {method.title}
                          </h3>
                          <p className="text-foreground/70 mb-4 text-sm">
                            {method.content}
                          </p>
                        </div>
                        <Button 
                          className="btn-primary px-6 py-2 text-sm rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
                          onClick={method.action}
                        >
                          {method.buttonText}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hours Section */}
              {hours && hours.length > 0 && (
                <Card className="mt-6 border-2 border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-accent/20">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-foreground">
                        Horarios de Atención
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hours.map((hour, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-foreground capitalize">{hour.day}</span>
                          <span className="text-foreground/70 text-sm">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Contact Component */}
          <ContactRustic />
        </main>

        <FooterRustic />
      </div>
    </>
  );
};

export default ContactPageRustic;
