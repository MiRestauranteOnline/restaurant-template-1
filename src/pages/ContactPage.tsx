import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Llámanos",
      content: "+51 987 654 321",
      action: () => window.open('tel:+51987654321', '_self'),
      buttonText: "Llamar Ahora"
    },
    {
      icon: Mail,
      title: "WhatsApp", 
      content: "Envíanos un mensaje",
      action: () => window.open('https://wa.me/51987654321?text=Hola, me gustaría contactarlos', '_blank'),
      buttonText: "Escribir"
    },
    {
      icon: MapPin,
      title: "Visítanos",
      content: "Av. Larco 123, Miraflores, Lima",
      action: () => window.open('https://maps.google.com/?q=-12.1267,-77.0365', '_blank'),
      buttonText: "Ver Mapa"
    }
  ];

  const hours = [
    { day: "Lunes - Viernes", time: "12:00 PM - 10:00 PM" },
    { day: "Sábados", time: "12:00 PM - 11:00 PM" },
    { day: "Domingos", time: "12:00 PM - 9:00 PM" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6">
              Contáctanos
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte. Contacta con nosotros para reservas, consultas o cualquier información que necesites.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center p-8 border-gray-200 card-hover">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                    <method.icon className="w-8 h-8 text-accent" />
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold mb-3 text-gray-900">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
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
          <Card className="max-w-2xl mx-auto border-gray-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold text-gray-900">
                  Horarios de Atención
                </h3>
              </div>
              
              <div className="space-y-4">
                {hours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-900">
                      {schedule.day}
                    </span>
                    <span className="text-gray-600">
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