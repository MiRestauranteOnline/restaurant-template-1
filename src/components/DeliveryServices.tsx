import { useClient } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

// Temporary placeholder images - replace with actual logos
const rappiLogo = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=60&fit=crop&crop=center";
const pedidosyaLogo = "https://images.unsplash.com/photo-1574077147475-cd313e2fb809?w=120&h=60&fit=crop&crop=center";
const didiLogo = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=60&fit=crop&crop=center";

interface DeliveryService {
  id: string;
  name: string;
  logo: string;
  url?: string;
  show_in_nav?: boolean;
}

const DeliveryServices = () => {
  const { clientSettings } = useClient();

  if (!clientSettings?.delivery_info) {
    return null;
  }

  const deliveryInfo = clientSettings.delivery_info as any;

  const services: DeliveryService[] = [
    {
      id: 'rappi',
      name: 'Rappi',
      logo: rappiLogo,
      url: deliveryInfo.rappi?.url,
      show_in_nav: deliveryInfo.rappi?.show_in_nav
    },
    {
      id: 'pedidosya',
      name: 'PedidosYa',
      logo: pedidosyaLogo,
      url: deliveryInfo.pedidosya?.url,
      show_in_nav: deliveryInfo.pedidosya?.show_in_nav
    },
    {
      id: 'didi',
      name: 'DiDi Food',
      logo: didiLogo,
      url: deliveryInfo.didi?.url,
      show_in_nav: deliveryInfo.didi?.show_in_nav
    }
  ];

  // Filter services that have URLs configured
  const availableServices = services.filter(service => service.url);

  // Don't render if no services are configured
  if (availableServices.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Delivery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ordena desde la comodidad de tu hogar a través de nuestros partners de delivery
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {availableServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    className="h-16 mx-auto object-contain"
                  />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryServices;