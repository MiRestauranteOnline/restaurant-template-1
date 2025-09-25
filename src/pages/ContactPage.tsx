import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';

const ContactPage = () => {
  const { client } = useClient();

  const formatOpeningHours = (hours: any) => {
    if (!hours || typeof hours !== 'object') {
      return [
        { day: "Lunes - Jueves", time: "12:00 PM - 10:00 PM" },
        { day: "Viernes - Sábado", time: "12:00 PM - 11:00 PM" },
        { day: "Domingo", time: "12:00 PM - 9:00 PM" }
      ];
    }
    
    const formatDay = (day: string, schedule: any) => {
      if (!schedule || !schedule.open || !schedule.close) return null;
      return { day, time: `${schedule.open} - ${schedule.close}` };
    };
    
    return [
      formatDay("Lunes - Jueves", hours.weekdays),
      formatDay("Viernes - Sábado", hours.weekend),
      formatDay("Domingo", hours.sunday)
    ].filter(Boolean);
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

  const hours = formatOpeningHours(client?.opening_hours);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/src/assets/grilled-steak.jpg')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-white">
              Contáctanos
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
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