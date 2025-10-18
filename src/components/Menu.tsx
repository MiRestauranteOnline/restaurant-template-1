import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItemSkeleton } from '@/components/ui/skeleton';
import { useClient } from '@/contexts/ClientContext';
import grilledSteak from '@/assets/grilled-steak.jpg';
import seafoodPlatter from '@/assets/seafood-platter.jpg';
import chocolateDessert from '@/assets/chocolate-dessert.jpg';
import heroPasta from '@/assets/hero-pasta.jpg';

const Menu = () => {
  const { menuItems, client, adminContent, loading } = useClient();

  const sectionTitle = adminContent?.homepage_menu_section_title || "Nuestro Menú";
  const sectionDescription = adminContent?.homepage_menu_section_description || "Descubre nuestra selección de platos cuidadosamente elaborados";
  
  // Use separate title fields from database
  const menuTitleFirstLine = (adminContent as any)?.homepage_menu_section_title_first_line || "Selecciones";
  const menuTitleSecondLine = (adminContent as any)?.homepage_menu_section_title_second_line || "Especiales";

  // Get items marked for homepage display (limit 8) - sorted by display_order
  const homepageItems = menuItems
    .filter(item => item.show_on_homepage)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 8);

  // Only show items from database - no fallbacks
  const displayMenuItems = homepageItems;
  const currency = client?.other_customizations?.currency || 'S/';

  return (
    <section id="menu" className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            {(adminContent as any)?.culinary_masterpieces_label || 'Obras Maestras Culinarias'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-2 mb-6">
            <span>{menuTitleFirstLine}</span>
            {menuTitleSecondLine && (
              <span className="block text-gradient">{menuTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {sectionDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {loading && menuItems.length === 0 ? (
            // Show skeleton loading states to prevent layout shift
            Array(4).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="menu-card-container bg-card border-border overflow-hidden">
                <div className="menu-card-image bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <MenuItemSkeleton />
                </CardContent>
              </Card>
            ))
          ) : (
            displayMenuItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="menu-card-container card-hover bg-card border-border overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="menu-card-image relative overflow-hidden">
                  {item.image_url && item.show_image_home ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width="400"
                      height="256"
                      style={{ aspectRatio: '400/256' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/30 flex items-center justify-center">
                      <span className="text-accent text-lg font-heading">{item.category}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xl font-heading font-bold text-accent">
                      {currency} {typeof item.price === 'number' ? item.price : item.price}
                    </span>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center fade-in">
          <Button 
            className="btn-primary px-8 py-3 text-lg rounded-full shadow-md hover:shadow-xl transition-all hover:scale-105"
            onClick={() => window.location.href = '/menu'}
          >
            Ver Menú Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;