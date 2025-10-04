import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { getIcon } from '@/utils/iconMapper';

const ServicesMinimalistic = () => {
  const { adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const servicesTitle = (adminContent as any)?.homepage_services_title || cachedAdminContent?.homepage_services_title || 'Our Services';
  const servicesDescription = (adminContent as any)?.homepage_services_description || cachedAdminContent?.homepage_services_description || 
    'Experience excellence in every detail.';

  const services = [
    {
      icon: getIcon((adminContent as any)?.service1_icon || 'Utensils'),
      title: (adminContent as any)?.service1_title || 'Fine Dining',
      description: (adminContent as any)?.service1_description || 'Experience exquisite cuisine',
    },
    {
      icon: getIcon((adminContent as any)?.service2_icon || 'Users'),
      title: (adminContent as any)?.service2_title || 'Private Events',
      description: (adminContent as any)?.service2_description || 'Host your special occasions',
    },
    {
      icon: getIcon((adminContent as any)?.service3_icon || 'Car'),
      title: (adminContent as any)?.service3_title || 'Catering',
      description: (adminContent as any)?.service3_description || 'Premium catering services',
    },
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              Services
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {servicesTitle}
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
