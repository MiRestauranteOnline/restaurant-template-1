import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

const MenuPage = () => {
  const { menuItems, menuCategories, client, adminContent, loading } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
  const menuHeroTitleFirst = 
    (adminContent as any)?.menu_page_hero_title_first_line ?? 
    cachedAdminContent?.menu_page_hero_title_first_line ?? 'Nuestro';
  const menuHeroTitleSecond = 
    (adminContent as any)?.menu_page_hero_title_second_line ?? 
    cachedAdminContent?.menu_page_hero_title_second_line ?? 'Menú';
  const menuHeroDescription = 
    (adminContent as any)?.menu_page_hero_description ?? 
    cachedAdminContent?.menu_page_hero_description ?? 
    'Descubre los auténticos sabores preparados con ingredientes frescos y recetas tradicionales.';
  const menuHeroBackground = 
    (adminContent as any)?.menu_page_hero_background_url ?? 
    cachedAdminContent?.menu_page_hero_background_url ?? heroPasta;
  
  const currency = client?.other_customizations?.currency || 'S/';

  // Group menu items by category and sort by display_order
  const groupedItems = menuCategories.reduce((acc, category) => {
    const categoryItems = menuItems
      .filter(item => 
        (item.category_id === category.id || (!item.category_id && item.category === category.name))
        && item.is_active
      )
      .sort((a, b) => a.display_order - b.display_order);
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Add items that don't match any category to an "Other" category
  const unmatchedItems = menuItems.filter(item => 
    item.is_active && 
    !menuCategories.some(cat => 
      item.category_id === cat.id || (!item.category_id && item.category === cat.name)
    )
  );
  
  if (unmatchedItems.length > 0) {
    groupedItems['Otros'] = unmatchedItems;
  }

  const displayCategories = Object.keys(groupedItems).length > 0 
    ? [
        ...menuCategories
          .filter(cat => groupedItems[cat.name])
          .map(category => ({
            name: category.name,
            items: groupedItems[category.name]
          })),
        ...(groupedItems['Otros'] ? [{ name: 'Otros', items: groupedItems['Otros'] }] : [])
      ]
    : [];

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 h-[50vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${menuHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página del menú"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
                {menuHeroTitleFirst}
                <span className="block text-gradient font-normal">{menuHeroTitleSecond}</span>
              </h1>
              <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed mb-8">
                {menuHeroDescription}
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
        <main>
          <section className="py-16">
            <div className="container mx-auto px-4">
              {loading && menuItems.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-40 bg-muted rounded-xl mb-4" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : displayCategories.length > 0 ? (
                <div className="space-y-12">
                  {displayCategories.map(({ name, items }) => (
                    <article key={name} id={name.replace(/\s+/g, '-').toLowerCase()} className="scroll-mt-24">
                      <header className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-heading text-foreground">{name}</h2>
                      </header>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            {item.show_image_menu && item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={`${item.name} – ${name}`}
                                loading="lazy"
                                className="h-40 w-full object-cover"
                              />
                            ) : null}
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
                                <span className="shrink-0 text-foreground/80 font-semibold">
                                  {currency}{Number(item.price).toFixed(2)}
                                </span>
                              </div>
                              {item.description && (
                                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No hay elementos del menú disponibles por ahora.</p>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
export default MenuPage;