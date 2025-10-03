import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';

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
    ? Object.keys(groupedItems).map(categoryName => ({
        name: categoryName,
        items: groupedItems[categoryName]
      }))
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
        <main>
          <section className="py-16">
...
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
export default MenuPage;