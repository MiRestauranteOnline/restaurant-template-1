import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { RappiIcon } from './icons/RappiIcon';
import { PedidosYaIcon } from './icons/PedidosYaIcon';
import { DidiIcon } from './icons/DidiIcon';

const DeliveryServicesMinimalistic = () => {
  const { client, clientSettings, adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const deliveryTitle = (adminContent as any)?.homepage_delivery_section_title || 'Delivery Partners';
  const deliveryDescription = (adminContent as any)?.homepage_delivery_section_description || 
    'Ordena desde la comodidad de tu hogar';

  const services = [
    {
      name: 'Rappi',
      icon: RappiIcon,
      url: client?.delivery?.rappi || clientSettings?.delivery_info?.rappi?.url,
      show: client?.delivery ? !!client.delivery.rappi : clientSettings?.delivery_info?.rappi?.show_in_nav !== false,
    },
    {
      name: 'PedidosYa',
      icon: PedidosYaIcon,
      url: client?.delivery?.pedidos_ya || clientSettings?.delivery_info?.pedidosya?.url,
      show: client?.delivery ? !!client.delivery.pedidos_ya : clientSettings?.delivery_info?.pedidosya?.show_in_nav !== false,
    },
    {
      name: 'DiDi Food',
      icon: DidiIcon,
      url: client?.delivery?.didi_food || clientSettings?.delivery_info?.didi?.url,
      show: client?.delivery ? !!client.delivery.didi_food : clientSettings?.delivery_info?.didi?.show_in_nav !== false,
    },
  ].filter(service => service.show && service.url);

  if (services.length === 0) return null;

  return (
    <section id="delivery" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              {(adminContent as any)?.delivery_label || 'Delivery'}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {deliveryTitle}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg">
              {deliveryDescription}
            </p>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center gap-4 p-8 border border-border hover:border-accent transition-colors">
                  <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <service.icon />
                  </div>
                  <p className="text-sm tracking-[0.2em] uppercase text-foreground/70 group-hover:text-accent transition-colors">
                    {(adminContent as any)?.order_on_button_text?.replace('{service}', service.name) || `Order on ${service.name}`}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryServicesMinimalistic;
