import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { getIcon } from '@/utils/iconMapper';

const ServicesMinimalistic = () => {
  const { adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const servicesTitle = (adminContent as any)?.homepage_services_section_title || 'Nuestros Servicios';
  const servicesDescription = (adminContent as any)?.homepage_services_section_description || 
    'Experimenta la excelencia en cada detalle';
  
  // Use separate title fields from database
  const servicesTitleFirstLine = (adminContent as any)?.homepage_services_section_title_first_line || "Experiencias";
  const servicesTitleSecondLine = (adminContent as any)?.homepage_services_section_title_second_line || "Auténticas";

  const services = [
    {
      icon: getIcon((adminContent as any)?.services_card1_icon || 'Utensils'),
      title: (adminContent as any)?.services_card1_title || 'Comida en el Local',
      description: (adminContent as any)?.services_card1_description || 'Disfruta de nuestros platos únicos en un ambiente acogedor',
    },
    {
      icon: getIcon((adminContent as any)?.services_card2_icon || 'Truck'),
      title: (adminContent as any)?.services_card2_title || 'Delivery',
      description: (adminContent as any)?.services_card2_description || 'Lleva los sabores de nuestro restaurante a tu hogar',
    },
    {
      icon: getIcon((adminContent as any)?.services_card3_icon || 'Users'),
      title: (adminContent as any)?.services_card3_title || 'Eventos Pequeños',
      description: (adminContent as any)?.services_card3_description || 'Celebra tus momentos especiales con nosotros',
    },
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              {(adminContent as any)?.our_services_label || 'Nuestros Servicios'}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {servicesTitleFirstLine}
              {servicesTitleSecondLine && (
                <span className="block text-accent mt-2">{servicesTitleSecondLine}</span>
              )}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              {servicesDescription}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <div 
                key={index}
                className="text-center fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading">
                    {service.title}
                  </h3>
                  <div className="w-8 h-px bg-accent/30" />
                  <p className="text-foreground/60 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesMinimalistic;
