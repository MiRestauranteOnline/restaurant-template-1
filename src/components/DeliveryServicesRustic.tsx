import { useClient } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { RappiIcon } from '@/components/icons/RappiIcon';
import { PedidosYaIcon } from '@/components/icons/PedidosYaIcon';
import { DidiIcon } from '@/components/icons/DidiIcon';

interface DeliveryService {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  url?: string;
  show_in_nav?: boolean;
}

const DeliveryServicesRustic = () => {
  const { client, clientSettings, adminContent } = useClient();

  const sectionTitle = adminContent?.homepage_delivery_section_title || "Delivery Partners";
  const sectionDescription = adminContent?.homepage_delivery_section_description || "Ordena desde la comodidad de tu hogar a través de nuestros partners de delivery";

  // ====================================
  // 🔒 PROTECTED DYNAMIC FUNCTIONALITY 
  // ====================================
  // DO NOT MODIFY: This section fetches delivery data from Supabase database
  // Clients can configure delivery URLs through the admin panel
  // ONLY STYLING/LAYOUT can be modified below, NOT the data logic
  
  const clientDelivery = (client as any)?.delivery;
  const settingsDelivery = (clientSettings as any)?.delivery_info;

  // Prefer clients.delivery; fallback to client_settings.delivery_info
  const source = clientDelivery || settingsDelivery;
  if (!source) return null;

  const services: DeliveryService[] = [
    {
      id: 'rappi',
      name: 'Rappi',
      icon: RappiIcon,
      url: clientDelivery ? clientDelivery?.rappi : settingsDelivery?.rappi?.url,
    },
    {
      id: 'pedidosya',
      name: 'PedidosYa',
      icon: PedidosYaIcon,
      url: clientDelivery ? clientDelivery?.pedidos_ya : settingsDelivery?.pedidosya?.url,
    },
    {
      id: 'didi',
      name: 'DiDi Food',
      icon: DidiIcon,
      url: clientDelivery ? clientDelivery?.didi_food : settingsDelivery?.didi?.url,
    },
  ];

  // Filter services that have URLs configured
  const availableServices = services.filter(service => service.url);
  
  // ====================================
  // END PROTECTED SECTION
  // ====================================

  // Don't render if no services are configured
  if (availableServices.length === 0) {
    return null;
  }

  // Use separate title fields similar to menu section
  const deliveryTitleFirstLine = (adminContent as any)?.homepage_delivery_section_title_first_line || "Partners de";
  const deliveryTitleSecondLine = (adminContent as any)?.homepage_delivery_section_title_second_line || "Delivery";

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-left max-w-3xl mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
            {(adminContent as any)?.delivery_label || 'Ordena Ahora'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
            <span className="block">{deliveryTitleFirstLine}</span>
            {deliveryTitleSecondLine && (
              <span className="block text-gradient mt-2">{deliveryTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed pl-4">
            {sectionDescription}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {availableServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className="card-hover bg-card border-2 border-border overflow-hidden group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 flex flex-col items-center text-center min-h-[320px] justify-between">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="mb-6 p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                      <IconComponent size={80} />
                    </div>
                    <div className="mb-6 pb-6 border-b-2 border-accent/20 w-full">
                      <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors">
                        {service.name}
                      </h3>
                    </div>
                  </div>
                  
                  <Button
                    asChild
                    className="w-full btn-primary px-6 py-3 text-base rounded-md border-2 group-hover:scale-105 transition-transform duration-300"
                  >
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Ordenar Ahora
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliveryServicesRustic;
