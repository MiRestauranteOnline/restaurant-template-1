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

const DeliveryServices = () => {
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

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            {sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {availableServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <IconComponent size={64} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {service.name}
                  </h3>
                  <Button
                    asChild
                    className="w-full group-hover:scale-105 transition-transform duration-300"
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

export default DeliveryServices;