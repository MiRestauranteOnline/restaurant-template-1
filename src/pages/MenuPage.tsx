import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';

const MenuPage = () => {
  const { menuItems, menuCategories, client, adminContent, loading } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
  const menuHeroBackground = 
    (adminContent as any)?.menu_page_hero_background_url ?? 
    cachedAdminContent?.menu_page_hero_background_url ?? heroPasta;
  
  const currency = client?.other_customizations?.currency || 'S/';

  // Group menu items by category
  const groupedItems = menuCategories.reduce((acc, category) => {
    const categoryItems = menuItems.filter(item => 
      (item.category_id === category.id || (!item.category_id && item.category === category.name))
      && item.is_active
    );
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // While loading, we'll show skeleton sections instead of static fallbacks to avoid shifts

  const displayCategories = Object.keys(groupedItems).length > 0 
    ? menuCategories.filter(cat => groupedItems[cat.name]).map(category => ({
        name: category.name,
        items: groupedItems[category.name]
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${menuHeroBackground}')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
              Nuestro
              <span className="block text-gradient font-normal">Menú</span>
            </h1>
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed mb-8">
              Descubre los auténticos sabores preparados con ingredientes frescos y recetas tradicionales.
            </p>
            
            {/* Download Menu Button */}
            {((adminContent as any)?.downloadable_menu_url || cachedAdminContent?.downloadable_menu_url) && (
              <button 
                className="btn-primary px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const menuUrl = (adminContent as any)?.downloadable_menu_url || cachedAdminContent?.downloadable_menu_url;
                  if (menuUrl) {
                    const link = document.createElement('a');
                    link.href = menuUrl;
                    link.download = 'menu.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
              >
                Descargar Menú
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            // Skeleton categories to prevent shifts
            Array(3).fill(0).map((_, index) => (
              <div key={`cat-skel-${index}`} className="mb-16">
                <div className="flex justify-center mb-12">
                  <div className="h-9 w-48 bg-foreground/10 rounded animate-pulse" />
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {Array(2).fill(0).map((_, idx) => (
                    <Card key={`item-skel-${index}-${idx}`} className="bg-card border-border card-hover">
                      <CardContent className="p-6">
                        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-muted animate-pulse" />
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="h-5 w-3/4 bg-foreground/10 rounded animate-pulse" />
                            <div className="h-5 w-12 bg-foreground/10 rounded animate-pulse" />
                          </div>
                          <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                          <div className="h-4 w-4/5 bg-foreground/10 rounded animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : displayCategories.length > 0 ? (
            displayCategories.map((category) => (
              <div key={category.name} className="mb-16">
                <h2 className="text-3xl font-heading font-semibold text-center mb-12 text-gradient">
                  {category.name}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {category.items.map((item, idx) => (
                    <Card key={item.id || idx} className="bg-card border-border card-hover">
                      <CardContent className="p-6">
                        {item.image_url && item.show_image_menu && (
                          <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              width="512"
                              height="192"
                              style={{ aspectRatio: '512/192' }}
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-heading font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <span className="text-xl font-bold text-accent ml-4">
                            {currency} {typeof item.price === 'number' ? item.price : item.price}
                          </span>
                        </div>
                        <p className="text-foreground/70 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-foreground/70">
              Aún no hay platos disponibles en el menú.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default MenuPage;