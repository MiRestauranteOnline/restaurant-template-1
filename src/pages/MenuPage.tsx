import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';
import heroPasta from '@/assets/hero-pasta.jpg';

const MenuPage = () => {
  const { menuItems, menuCategories, client, adminContent } = useClient();
  
  const menuHeroBackground = (adminContent as any)?.menu_page_hero_background_url || heroPasta;
  
  const currency = client?.other_customizations?.currency || 'S/';

  // Group menu items by category
  const groupedItems = menuCategories.reduce((acc, category) => {
    const categoryItems = menuItems.filter(item => 
      item.category === category.name && item.is_active
    );
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Fallback categories if no database categories exist
  const fallbackCategories = [
    {
      name: "Entradas",
      items: [
        { name: "Ceviche Clásico", price: 28, description: "Pescado fresco marinado en limón con cebolla morada, ají y camote" },
        { name: "Causa Limeña", price: 18, description: "Papas amarillas con pollo desmechado y palta" },
        { name: "Anticuchos", price: 22, description: "Brochetas de corazón marinado con ají panca" }
      ]
    },
    {
      name: "Platos Principales", 
      items: [
        { name: "Lomo Saltado", price: 32, description: "Lomo de res salteado con cebolla, tomate y papas fritas" },
        { name: "Ají de Gallina", price: 28, description: "Pollo deshilachado en salsa de ají amarillo con nueces" },
        { name: "Arroz con Mariscos", price: 35, description: "Arroz con mariscos frescos y culantro" },
        { name: "Pollo a la Brasa", price: 25, description: "Pollo marinado y cocinado al carbón con papas y ensalada" }
      ]
    },
    {
      name: "Postres",
      items: [
        { name: "Suspiro Limeño", price: 12, description: "Dulce de leche cubierto con merengue de port" },
        { name: "Mazamorra Morada", price: 10, description: "Postre tradicional con frutas y canela" },
        { name: "Tres Leches", price: 14, description: "Bizcocho empapado en tres tipos de leche" }
      ]
    },
    {
      name: "Bebidas",
      items: [
        { name: "Pisco Sour", price: 16, description: "Cóctel clásico peruano con pisco y limón" },
        { name: "Chicha Morada", price: 8, description: "Refresco tradicional de maíz morado con especias" },
        { name: "Inca Kola", price: 6, description: "Gaseosa peruana de sabor único" }
      ]
    }
  ];

  const displayCategories = Object.keys(groupedItems).length > 0 
    ? menuCategories.filter(cat => groupedItems[cat.name]).map(category => ({
        name: category.name,
        items: groupedItems[category.name]
      }))
    : fallbackCategories;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
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
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Descubre los auténticos sabores preparados con ingredientes frescos y recetas tradicionales.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {displayCategories.map((category, index) => (
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
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
            ¿Listo para probar nuestros platos?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn-primary px-8 py-3 rounded-full text-lg"
              onClick={() => {
                const whatsappNumber = client?.whatsapp || client?.phone || '51987654321';
                window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría hacer un pedido')}`, '_blank');
              }}
            >
              Hacer Pedido
            </button>
            <button 
              className="btn-ghost px-8 py-3 rounded-full text-lg"
              onClick={() => {
                const phoneNumber = client?.phone || client?.whatsapp || '+51987654321';
                window.open(`tel:${phoneNumber}`, '_self');
              }}
            >
              Llamar
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;