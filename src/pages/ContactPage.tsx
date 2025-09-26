import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { formatOpeningHours } from '@/utils/formatOpeningHours';

const ContactPage = () => {
  const { client, adminContent } = useClient();
  
  const contactHeroBackground = (adminContent as any)?.contact_page_hero_background_url || '/src/assets/grilled-steak.jpg';

  const formatHoursForContactPage = (hours: any) => {
    const formattedHours = formatOpeningHours(hours);
    return formattedHours.map(hourString => {
      const [day, time] = hourString.split(': ');
      return { day, time };
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Llámanos",
      content: client?.phone || "+51 987 654 321",
      action: () => window.open(`tel:${client?.phone || '+51987654321'}`, '_self'),
      buttonText: "Llamar Ahora"
    },
    {
      icon: Mail,
      title: "WhatsApp", 
      content: "Envíanos un mensaje",
      action: () => {
        const whatsappNumber = client?.whatsapp || client?.phone || '51987654321';
        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría contactarlos')}`, '_blank');
      },
      buttonText: "Escribir"
    },
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${contactHeroBackground}')`,
          }}
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

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center p-8 bg-card border-border card-hover">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <method.icon className="w-12 h-12 text-accent mx-auto" />
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                    {method.title}
                  </h3>
                  
                  <p className="text-foreground/70 mb-6">
                    {method.content}
                  </p>
                  
                  <button 
                    className="btn-primary px-6 py-2 rounded-full"
                    onClick={method.action}
                  >
                    {method.buttonText}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hours */}
          <Card className="max-w-2xl mx-auto bg-card border-border">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold text-foreground">
                  Horarios de Atención
                </h3>
              </div>
              
              <div className="space-y-4">
                {hours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <span className="font-medium text-foreground">
                      {schedule.day}
                    </span>
                    <span className="text-foreground/70">
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Component */}
      <Contact />

      <Footer />
    </div>
  );
};

export default ContactPage;