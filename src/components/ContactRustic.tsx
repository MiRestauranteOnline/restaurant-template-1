import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { formatOpeningHours } from '@/utils/formatOpeningHours';

const ContactRustic = () => {
  const { client, clientSettings, adminContent } = useClient();
  
  const sectionDescription = adminContent?.homepage_contact_section_description || "¿Listo para disfrutar de sabores únicos? Te esperamos en Savoria.";
  const hideReservationBox = adminContent?.homepage_contact_hide_reservation_box || false;
  
  const contactTitleFirstLine = (adminContent as any)?.homepage_contact_section_title_first_line || "Reserva Tu";
  const contactTitleSecondLine = (adminContent as any)?.homepage_contact_section_title_second_line || "Experiencia";

  const contactInfo = [
    ...(client?.phone ? [{
      icon: Phone,
      title: "Teléfono",
      details: [`${client.phone_country_code || '+51'} ${client.phone}`]
    }] : []),
    ...(client?.email ? [{
      icon: Mail,
      title: "Email",
      details: [client.email]
    }] : []),
    ...(client?.address ? [{
      icon: MapPin,
      title: "Ubicación",
      details: [client.address]
    }] : []),
    {
      icon: Clock,
      title: "Horarios",
      details: formatOpeningHours(client?.opening_hours_ordered || client?.opening_hours)
    }
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-secondary/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            {(adminContent as any)?.contact_us_label || 'Contáctanos'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6">
            <span className="block">{contactTitleFirstLine}</span>
            {contactTitleSecondLine && (
              <span className="block text-gradient mt-2">{contactTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            {sectionDescription}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Contact Information Cards - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6 fade-in">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
                        <info.icon className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          info.title === "Email" ? (
                            <a 
                              key={idx}
                              href={`mailto:${detail}`}
                              className="text-foreground/70 text-sm hover:text-accent transition-colors leading-relaxed break-words block"
                            >
                              {detail}
                            </a>
                          ) : (
                            <p key={idx} className="text-foreground/70 text-sm leading-relaxed break-words">
                              {detail}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reservation Box - Sidebar on desktop */}
          {!hideReservationBox && (
            <div className="lg:col-span-1 fade-in">
              <Card className="bg-card border-border sticky top-24 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold mb-3 text-foreground">
                      {adminContent?.contact_reservation_title || 'Reserva Tu Mesa'}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {adminContent?.contact_reservation_description || '¿Listo para disfrutar de una experiencia culinaria excepcional? Contáctanos directamente para hacer tu reserva o resolver cualquier consulta.'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {client?.whatsapp && (
                      <Button 
                        className="btn-primary w-full py-6 text-base rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
                        onClick={() => {
                          const whatsappNumber = client?.whatsapp ? 
                            `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
                            '51987654321';
                          const message = adminContent?.whatsapp_reservation_message || 
                            clientSettings?.whatsapp_messages?.reservation || 
                            'Hola, me gustaría hacer una reserva para [fecha] a las [hora] para [número de personas] personas.';
                          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        Reservar por WhatsApp
                      </Button>
                    )}
                    
                    {client?.phone && (
                      <Button 
                        variant="outline"
                        className="w-full py-6 text-base rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all"
                        onClick={() => {
                          const phoneNumber = client?.phone ? 
                            `${client.phone_country_code || '+51'}${client.phone}` : 
                            '+51987654321';
                          window.open(`tel:${phoneNumber}`, '_self');
                        }}
                      >
                        Llamar Ahora
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Map Section - Full width below */}
        <div className="mt-12 lg:mt-16 max-w-7xl mx-auto fade-in">
          <Card className="bg-card border-border overflow-hidden shadow-lg">
            <div className="relative h-96 lg:h-[500px]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-77.0365,-12.1267,-77.0365,-12.1267&amp;layer=mapnik&amp;marker=-12.1267,-77.0365"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Savoria Restaurant Location"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactRustic;
