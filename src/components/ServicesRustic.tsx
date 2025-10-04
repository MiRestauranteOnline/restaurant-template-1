import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';

const ServicesRustic = () => {
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
    <section id="services" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-left max-w-3xl mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
            {(adminContent as any)?.services_label || 'Nuestros Servicios'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
            <span className="block">{servicesTitleFirstLine}</span>
            {servicesTitleSecondLine && (
              <span className="block text-gradient mt-2">{servicesTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed pl-4">
            {servicesDescription}
          </p>
        </div>

        {/* Services Grid with Asymmetric Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className={`card-hover bg-card border-2 border-border overflow-hidden group ${
                index === 2 ? 'md:col-span-2 md:max-w-2xl md:mx-auto' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 flex flex-col">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <service.icon className="w-10 h-10 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors mb-3">
                      {service.title}
                    </h3>
                    <div className="w-16 h-1 bg-accent/30 rounded-full mb-3"></div>
                    <p className="text-foreground/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="btn-primary w-full md:w-auto px-8 py-3 text-base rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 self-start"
                  onClick={() => window.open(service.buttonLink, '_blank')}
                >
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section with Unique Layout */}
        <div className="grid md:grid-cols-3 gap-6 fade-in">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border-2 border-border rounded-xl p-6 flex items-center gap-4 card-hover"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-accent/10">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <span className="text-foreground font-medium text-lg">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesRustic;
