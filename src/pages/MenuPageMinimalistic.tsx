import NavigationMinimalistic from '@/components/NavigationMinimalistic';
import FooterMinimalistic from '@/components/FooterMinimalistic';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

const MenuPageMinimalistic = () => {
  const { menuItems, menuCategories, client, adminContent, loading } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
  const menuHeroTitleFirst = 
    (adminContent as any)?.menu_page_hero_title_first_line ?? 
    cachedAdminContent?.menu_page_hero_title_first_line ?? 'Our';
  const menuHeroTitleSecond = 
    (adminContent as any)?.menu_page_hero_title_second_line ?? 
    cachedAdminContent?.menu_page_hero_title_second_line ?? 'Menu';
  const menuHeroDescription = 
    (adminContent as any)?.menu_page_hero_description ?? 
    cachedAdminContent?.menu_page_hero_description ?? 
    'Explore our carefully curated selection of dishes.';
  const menuHeroBackground = 
    (adminContent as any)?.menu_page_hero_background_url ?? 
    cachedAdminContent?.menu_page_hero_background_url ?? heroPasta;
  
  const currency = client?.other_customizations?.currency || '$';

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

  const displayCategories = Object.keys(groupedItems).length > 0 
    ? [
        ...menuCategories
          .filter(cat => groupedItems[cat.name])
          .map(category => ({
            name: category.name,
            items: groupedItems[category.name]
          }))
      ]
    : [];

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationMinimalistic />
        
        {/* Hero Section - Minimalistic Style */}
        <section className="relative pt-20 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${menuHeroBackground}')` }}
            role="img"
            aria-label="Menu page background"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                {(adminContent as any)?.culinary_masterpieces_label || 'Culinary Selection'}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight">
                {menuHeroTitleFirst}
                {menuHeroTitleSecond && (
                  <span className="block text-accent">{menuHeroTitleSecond}</span>
                )}
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                {menuHeroDescription}
              </p>
              
              {/* Download Menu Button */}
              {((adminContent as any)?.downloadable_menu_url || cachedAdminContent?.downloadable_menu_url) && (
                <button 
                  className="btn-primary px-8 py-3 text-sm rounded-none mt-6 tracking-wider uppercase"
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
                  Download Menu
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <main>
          {loading && menuItems.length === 0 ? (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-12">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-4">
                      <div className="h-8 bg-muted rounded w-1/4 mb-6" />
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex justify-between items-start border-b border-border/50 pb-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-6 bg-muted rounded w-2/3" />
                            <div className="h-4 bg-muted rounded w-full" />
                          </div>
                          <div className="h-6 bg-muted rounded w-16 ml-4" />
                        </div>
                      ))}
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
                className="py-16 lg:py-24 scroll-mt-24"
              >
                <div className="container mx-auto px-4 max-w-4xl">
                  {/* Category Header */}
                  <div className="text-center mb-12 fade-in">
                    <h2 className="text-4xl md:text-5xl font-heading font-light mb-2">
                      {name}
                    </h2>
                    <div className="w-12 h-px bg-accent mx-auto mt-4" />
                  </div>

                  {/* Menu Items List */}
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div 
                        key={item.id}
                        className="fade-in group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start gap-4 pb-6 border-b border-border/50 hover:border-accent/50 transition-colors">
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
                </div>
              </section>
            ))
          ) : (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4">
                <p className="text-center text-foreground/60 text-lg">No menu items available at the moment.</p>
              </div>
            </section>
          )}
        </main>

        <FooterMinimalistic />
      </div>
    </>
  );
};

export default MenuPageMinimalistic;
