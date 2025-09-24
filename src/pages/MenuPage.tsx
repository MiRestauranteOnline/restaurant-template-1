import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const MenuPage = () => {
  const categories = [
    {
      name: "Entradas",
      items: [
        { name: "Ceviche Clásico", price: "S/ 28", description: "Pescado fresco marinado en limón con cebolla morada, ají y camote" },
        { name: "Causa Limeña", price: "S/ 18", description: "Papas amarillas con pollo desmechado y palta" },
        { name: "Anticuchos", price: "S/ 22", description: "Brochetas de corazón marinado con ají panca" }
      ]
    },
    {
      name: "Platos Principales",
      items: [
        { name: "Lomo Saltado", price: "S/ 32", description: "Lomo de res salteado con cebolla, tomate y papas fritas" },
        { name: "Ají de Gallina", price: "S/ 28", description: "Pollo deshilachado en salsa de ají amarillo con nueces" },
        { name: "Arroz con Mariscos", price: "S/ 35", description: "Arroz con mariscos frescos y culantro" },
        { name: "Pollo a la Brasa", price: "S/ 25", description: "Pollo marinado y cocinado al carbón con papas y ensalada" }
      ]
    },
    {
      name: "Postres",
      items: [
        { name: "Suspiro Limeño", price: "S/ 12", description: "Dulce de leche cubierto con merengue de port" },
        { name: "Mazamorra Morada", price: "S/ 10", description: "Postre tradicional con frutas y canela" },
        { name: "Tres Leches", price: "S/ 14", description: "Bizcocho empapado en tres tipos de leche" }
      ]
    },
    {
      name: "Bebidas",
      items: [
        { name: "Pisco Sour", price: "S/ 16", description: "Cóctel clásico peruano con pisco y limón" },
        { name: "Chicha Morada", price: "S/ 8", description: "Refresco tradicional de maíz morado con especias" },
        { name: "Inca Kola", price: "S/ 6", description: "Gaseosa peruana de sabor único" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6">
              Nuestro
              <span className="block text-gradient font-normal">Menú</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Descubre los auténticos sabores peruanos preparados con ingredientes frescos y recetas tradicionales.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categories.map((category, index) => (
            <div key={category.name} className="mb-16">
              <h2 className="text-3xl font-heading font-semibold text-center mb-12 text-gradient">
                {category.name}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {category.items.map((item, idx) => (
                  <Card key={idx} className="bg-card border-border card-hover">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-heading font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <span className="text-xl font-bold text-accent ml-4">
                          {item.price}
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
              onClick={() => window.open('https://wa.me/51987654321?text=Hola, me gustaría hacer un pedido', '_blank')}
            >
              Hacer Pedido
            </button>
            <button 
              className="btn-ghost px-8 py-3 rounded-full text-lg"
              onClick={() => window.open('tel:+51987654321', '_self')}
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