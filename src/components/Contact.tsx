import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';

const Contact = () => {
  const { client, clientSettings } = useClient();
  
  const formatOpeningHours = (hours: any) => {
    if (!hours || typeof hours !== 'object') {
      return ["Lun-Jue: 12:00 PM - 10:00 PM", "Vie-Sáb: 12:00 PM - 11:00 PM", "Dom: 12:00 PM - 9:00 PM"];
    }
    
    const formatDay = (day: string, schedule: any) => {
      if (!schedule || schedule.closed || !schedule.open || !schedule.close) return null;
      return `${day}: ${schedule.open} - ${schedule.close}`;
    };

    const dayNames = {
      monday: "Lun",
      tuesday: "Mar", 
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom"
    };
    
    return Object.entries(hours)
      .map(([key, schedule]: [string, any]) => {
        const dayName = dayNames[key as keyof typeof dayNames];
        return dayName ? formatDay(dayName, schedule) : null;
      })
      .filter(Boolean);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      details: client?.phone ? [client.phone] : ["+51 987 654 321"]
    },
    {
      icon: Mail,
      title: "Email",
      details: client?.email ? [client.email] : ["info@savoria.com"]
    },
    {
      icon: MapPin,
      title: "Ubicación",
      details: client?.address ? [client.address] : ["Av. Larco 123", "Miraflores, Lima"]
    },
    {
      icon: Clock,
      title: "Horarios",
      details: formatOpeningHours(client?.opening_hours)
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Contáctanos
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
            Reserva Tu
            <span className="block text-gradient font-normal">Experiencia</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            ¿Listo para disfrutar de sabores únicos? Te esperamos en Savoria.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="space-y-8 fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card border-border p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
                          <info.icon className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-foreground/70 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interactive Map */}
            <div className="bg-muted rounded-2xl h-64 relative overflow-hidden">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-77.0365,-12.1267,-77.0365,-12.1267&amp;layer=mapnik&amp;marker=-12.1267,-77.0365"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Savoria Restaurant Location"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-2xl" />
            </div>
          </div>

          {/* Contact Actions */}
          <div className="fade-in">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-semibold mb-6 text-foreground">
                  Reserva Tu Mesa
                </h3>
                
                <div className="space-y-6">
                  <p className="text-foreground/80 leading-relaxed">
                    ¿Listo para disfrutar de una experiencia culinaria excepcional? 
                    Contáctanos directamente para hacer tu reserva o resolver cualquier consulta.
                  </p>
                  
                  <div className="grid gap-4">
                    <Button 
                      className="btn-primary w-full py-4 text-lg rounded-full"
                      onClick={() => {
                        const whatsappNumber = client?.whatsapp || client?.phone || '51987654321';
                        const message = clientSettings?.whatsapp_messages?.reservation || 
                          'Hola, me gustaría hacer una reserva para [fecha] a las [hora] para [número de personas] personas.';
                        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      Reservar por WhatsApp
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full py-4 text-lg rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={() => window.open(`tel:${client?.phone || '+51987654321'}`, '_self')}
                    >
                      Llamar Ahora
                    </Button>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;