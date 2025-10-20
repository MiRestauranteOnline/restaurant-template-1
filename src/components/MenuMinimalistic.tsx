import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { useMenuSectionTracking } from '@/hooks/useMenuSectionTracking';

const MenuMinimalistic = () => {
  const { menuItems, client, adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const sectionTitle = adminContent?.homepage_menu_section_title || "Nuestro Menú";
  const sectionDescription = adminContent?.homepage_menu_section_description || "Descubre nuestra selección de platos cuidadosamente elaborados";
  
  // Use separate title fields from database
  const menuTitleFirstLine = (adminContent as any)?.homepage_menu_section_title_first_line || "Selecciones";
  const menuTitleSecondLine = (adminContent as any)?.homepage_menu_section_title_second_line || "Especiales";
  const currency = client?.other_customizations?.currency || '$';

  // Track which section is visible
  useMenuSectionTracking();

  // Get items marked for homepage display (limit to 8 like rustic template) - sorted by display_order
  const featuredItems = menuItems
    .filter(item => item.show_on_homepage && item.is_active)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 8);

  if (featuredItems.length === 0) return null;

  return (
    <section id="menu" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              {(adminContent as any)?.culinary_masterpieces_label || 'Obras Maestras Culinarias'}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {menuTitleFirstLine}
              {menuTitleSecondLine && (
                <span className="block text-accent mt-2">{menuTitleSecondLine}</span>
              )}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-6 mb-12">
            {featuredItems.map((item, index) => (
              <div 
                key={item.id}
                className="fade-in pb-6 border-b border-border/50 last:border-0 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-start gap-4">
                  {item.image_url && item.show_image_home && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-heading mb-2 group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-foreground/60 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xl font-heading text-accent shrink-0">
                    {currency}{Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View Full Menu Button */}
          <div className="text-center">
            <Button 
              className="btn-primary px-8 py-3 text-sm rounded-none tracking-wider uppercase"
              onClick={() => window.location.href = '/menu'}
            >
              {(adminContent as any)?.view_full_menu_button_text || (cachedAdminContent as any)?.view_full_menu_button_text || 'Ver Menú Completo'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuMinimalistic;
