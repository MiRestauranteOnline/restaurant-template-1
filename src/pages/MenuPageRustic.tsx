import NavigationRustic from '@/components/NavigationRustic';
import FooterRustic from '@/components/FooterRustic';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';

const MenuPageRustic = () => {
  const { menuItems, menuCategories, client, adminContent, loading } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  
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
        <NavigationRustic />
        
        {/* Hero Section - Rustic Style */}
        <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${menuHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página del menú"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4 block mb-4">
                {(adminContent as any)?.culinary_masterpieces_label || 'Obras Maestras Culinarias'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 border-l-4 border-foreground/10 pl-4">
                <span className="block">{menuHeroTitleFirst}</span>
                <span className="block text-gradient mt-2">{menuHeroTitleSecond}</span>
              </h1>
              <p className="text-xl text-foreground/90 leading-relaxed pl-4 mb-8">
                {menuHeroDescription}
              </p>
              
              {/* Download Menu Button */}
              {((adminContent as any)?.downloadable_menu_url || cachedAdminContent?.downloadable_menu_url) && (
                <div className="pl-4">
                  <button 
                    className="btn-primary px-8 py-3 text-base rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
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
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <main>
          {loading && menuItems.length === 0 ? (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-64 bg-muted rounded-xl mb-4" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : displayCategories.length > 0 ? (
            displayCategories.map(({ name, items }, categoryIndex) => (
              <section 
                key={name}
                id={name.replace(/\s+/g, '-').toLowerCase()} 
                className={`py-12 lg:py-16 scroll-mt-24 ${categoryIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
              >
                <div className="container mx-auto px-4">
                  {/* Category Header */}
                  <div className="text-left max-w-3xl mb-8 fade-in">
                    <span className="text-accent font-medium tracking-wider uppercase text-xs border-l-4 border-accent pl-4">
                      Categoría
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading mt-3 mb-4 border-l-4 border-foreground/10 pl-4">
                      <span className="block text-gradient">{name}</span>
                    </h2>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, index) => (
                      <Card 
                        key={item.id}
                        className="overflow-hidden border-2 border-border card-hover bg-card group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {item.show_image_menu && item.image_url && (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={`${item.name} – ${name}`}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">
                              {name}
                            </div>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-accent transition-colors flex-1">
                              {item.name}
                            </h3>
                            <span className="shrink-0 text-xl font-heading font-bold text-accent">
                              {currency}{Number(item.price).toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-foreground/70 leading-relaxed text-sm">{item.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4">
                <p className="text-center text-foreground/70 text-xl">No hay elementos del menú disponibles por ahora.</p>
              </div>
            </section>
          )}
        </main>

        <FooterRustic />
      </div>
    </>
  );
};

export default MenuPageRustic;
