import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Truck, Users, Clock, Star, MapPin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Utensils,
      title: "Comida en el Local",
      description: "Disfruta de nuestros platos únicos en un ambiente acogedor y familiar.",
      features: ["Ambiente familiar", "Servicio personalizado", "Platos recién preparados"]
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Lleva los sabores de Savoria a tu hogar con nuestro servicio de delivery.",
      features: ["Entrega rápida", "Empaque ecológico", "Pedidos por WhatsApp"]
    },
    {
      icon: Users,
      title: "Eventos Pequeños",
      description: "Celebra tus momentos especiales con nosotros, perfecto para reuniones íntimas.",
      features: ["Hasta 20 personas", "Menú personalizado", "Ambiente privado"]
    }
  ];

  const features = [
    { icon: Clock, text: "Abierto Todos los Días" },
    { icon: Star, text: "Recomendado en Lima" },
    { icon: MapPin, text: "En el Corazón de Miraflores" }
  ];

  return (
    <section id="services" className="py-20 lg:py-32" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Nuestros Servicios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6 text-gray-900">
            Experiencias
            <span className="block text-gradient font-normal">Auténticas</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Desde una comida íntima hasta celebraciones especiales, te ofrecemos 
            sabores únicos y un servicio cálido.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="card-hover bg-card border-border p-8 text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                
                <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">
                  {service.title}
                </h3>
                
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="btn-primary rounded-full"
                  onClick={() => window.open('https://wa.me/51987654321?text=Hola, me gustaría saber más sobre sus servicios', '_blank')}
                >
                  Más Info
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Row */}
        <div className="bg-card rounded-2xl p-8 fade-in">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center text-center">
                <feature.icon className="w-6 h-6 text-accent mr-3" />
                <span className="text-foreground font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;