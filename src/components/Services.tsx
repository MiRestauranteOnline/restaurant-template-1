import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';

const Services = () => {
  const { adminContent } = useClient();
  
  // Use separate title fields from database
  const servicesTitleFirstLine = (adminContent as any)?.homepage_services_section_title_first_line || "Experiencias";
  const servicesTitleSecondLine = (adminContent as any)?.homepage_services_section_title_second_line || "Auténticas";
  const servicesDescription = adminContent?.homepage_services_section_description || "Desde una comida íntima hasta celebraciones especiales, te ofrecemos sabores únicos y un servicio cálido.";
  
  const services = [
    {
      icon: getIcon((adminContent as any)?.services_card1_icon || 'Utensils'),
      title: (adminContent as any)?.services_card1_title || "Comida en el Local",
      description: (adminContent as any)?.services_card1_description || "Disfruta de nuestros platos únicos en un ambiente acogedor y familiar.",
      buttonText: (adminContent as any)?.services_card1_button_text || "Más Info",
      buttonLink: (adminContent as any)?.services_card1_button_link || 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre comida en el local'
    },
    {
      icon: getIcon((adminContent as any)?.services_card2_icon || 'Truck'),
      title: (adminContent as any)?.services_card2_title || "Delivery",
      description: (adminContent as any)?.services_card2_description || "Lleva los sabores de nuestro restaurante a tu hogar con nuestro servicio de delivery.",
      buttonText: (adminContent as any)?.services_card2_button_text || "Más Info",
      buttonLink: (adminContent as any)?.services_card2_button_link || 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre delivery'
    },
    {
      icon: getIcon((adminContent as any)?.services_card3_icon || 'Users'),
      title: (adminContent as any)?.services_card3_title || "Eventos Pequeños",
      description: (adminContent as any)?.services_card3_description || "Celebra tus momentos especiales con nosotros, perfecto para reuniones íntimas.",
      buttonText: (adminContent as any)?.services_card3_button_text || "Más Info",
      buttonLink: (adminContent as any)?.services_card3_button_link || 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre eventos'
    }
  ];

  const features = [
    { 
      icon: getIcon((adminContent as any)?.services_feature1_icon || 'Clock'), 
      text: (adminContent as any)?.services_feature1_text || "Abierto Todos los Días" 
    },
    { 
      icon: getIcon((adminContent as any)?.services_feature2_icon || 'Star'), 
      text: (adminContent as any)?.services_feature2_text || "Recomendado en Lima" 
    },
    { 
      icon: getIcon((adminContent as any)?.services_feature3_icon || 'MapPin'), 
      text: (adminContent as any)?.services_feature3_text || "En el Corazón de Miraflores" 
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-32" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6 text-gray-900">
            <span>{servicesTitleFirstLine}</span>
            {servicesTitleSecondLine && (
              <span className="block text-gradient font-normal">{servicesTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {servicesDescription}
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
                
                <p className="text-foreground/70 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <Button 
                  className="btn-primary rounded-full"
                  onClick={() => window.open(service.buttonLink, '_blank')}
                >
                  {service.buttonText}
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