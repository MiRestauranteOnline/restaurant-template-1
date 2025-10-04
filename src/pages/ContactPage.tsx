import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import { formatOpeningHours } from '@/utils/formatOpeningHours';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';

const ContactPage = () => {
  const { client, adminContent } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
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
        if (client?.coordinates) {
          const coords = client.coordinates;
          window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
        } else {
          window.open('https://maps.google.com/?q=-12.1267,-77.0365', '_blank');
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
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${contactHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página de contacto"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
                Contáctanos
              </h1>
              <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Estamos aquí para ayudarte. Contacta con nosotros para reservas, consultas o cualquier información que necesites.
              </p>
            </div>
          </div>
        </section>

        <main>
          {/* Contact Methods */}
          <section className="py-12 lg:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <Card 
                    key={index}
                    className="border-border hover:border-accent/50 transition-all duration-300 bg-card group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <method.icon className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                            {method.title}
                          </h3>
                          <p className="text-foreground/70 mb-4 text-sm">
                            {method.content}
                          </p>
                        </div>
                        <Button 
                          className="btn-primary px-6 py-2 text-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-105"
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
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-2xl font-heading font-semibold text-foreground">
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
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;