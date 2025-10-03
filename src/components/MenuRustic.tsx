import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItemSkeleton } from '@/components/ui/skeleton';
import { useClient } from '@/contexts/ClientContext';
import grilledSteak from '@/assets/grilled-steak.jpg';
import seafoodPlatter from '@/assets/seafood-platter.jpg';
import chocolateDessert from '@/assets/chocolate-dessert.jpg';
import heroPasta from '@/assets/hero-pasta.jpg';

const MenuRustic = () => {
  const { menuItems, client, adminContent, loading } = useClient();

  const sectionTitle = adminContent?.homepage_menu_section_title || "Nuestro Menú";
  const sectionDescription = adminContent?.homepage_menu_section_description || "Descubre nuestra selección de platos cuidadosamente elaborados";
  
  // Use separate title fields from database
  const menuTitleFirstLine = (adminContent as any)?.homepage_menu_section_title_first_line || "Selecciones";
  const menuTitleSecondLine = (adminContent as any)?.homepage_menu_section_title_second_line || "Especiales";

  // Get items marked for homepage display (limit 8)
  const homepageItems = menuItems.filter(item => item.show_on_homepage).slice(0, 8);

  // Only show items from database - no fallbacks
  const displayMenuItems = homepageItems;
  const currency = client?.other_customizations?.currency || 'S/';

  return (
    <section id="menu" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-left max-w-3xl mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
            {(adminContent as any)?.culinary_masterpieces_label || 'Obras Maestras Culinarias'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
            <span className="block">{menuTitleFirstLine}</span>
            {menuTitleSecondLine && (
              <span className="block text-gradient mt-2">{menuTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed pl-4">
            {sectionDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {loading && menuItems.length === 0 ? (
            // Show skeleton loading states to prevent layout shift
            Array(4).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="bg-card border-2 border-border overflow-hidden">
                <div className="h-64 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <MenuItemSkeleton />
                </CardContent>
              </Card>
            ))
          ) : (
            displayMenuItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="card-hover bg-card border-2 border-border overflow-hidden group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width="400"
                        height="400"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/30 flex items-center justify-center">
                        <span className="text-accent text-lg font-heading">{item.category}</span>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium">
                      {item.category}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col justify-center">
                    <div className="mb-4 pb-4 border-b-2 border-accent/20">
                      <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-bold text-accent">
                          {currency} {typeof item.price === 'number' ? item.price : item.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground/70 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="text-left fade-in">
          <Button 
            className="btn-primary px-8 py-3 text-lg rounded-md border-2"
            onClick={() => window.location.href = '/menu'}
          >
            Ver Menú Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuRustic;
