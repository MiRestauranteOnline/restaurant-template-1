import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import grilledSteak from '@/assets/grilled-steak.jpg';
import seafoodPlatter from '@/assets/seafood-platter.jpg';
import chocolateDessert from '@/assets/chocolate-dessert.jpg';
import heroPasta from '@/assets/hero-pasta.jpg';

const Menu = () => {
  const menuItems = [
    {
      id: 1,
      name: "Truffle Pasta Supreme",
      description: "Hand-made pasta with black truffle shavings, wild mushrooms, and parmesan cream sauce",
      price: "$48",
      image: heroPasta,
      category: "Signature"
    },
    {
      id: 2,
      name: "Wagyu Beef Tenderloin",
      description: "Premium cut with rosemary, garlic confit, and seasonal vegetables",
      price: "$85",
      image: grilledSteak,
      category: "Main Course"
    },
    {
      id: 3,
      name: "Ocean's Bounty Platter",
      description: "Fresh lobster, oysters, and seasonal seafood with citrus mignonette",
      price: "$95",
      image: seafoodPlatter,
      category: "Seafood"
    },
    {
      id: 4,
      name: "Chocolate Decadence",
      description: "Dark chocolate soufflé with gold leaf and vanilla bean ice cream",
      price: "$24",
      image: chocolateDessert,
      category: "Dessert"
    }
  ];

  return (
    <section id="menu" className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Culinary Masterpieces
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
            Signature
            <span className="block text-gradient font-normal">Selections</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Discover our chef's carefully curated selection of exceptional dishes, 
            each crafted with passion and the finest ingredients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {menuItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="card-hover bg-card border-border overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-heading font-bold text-accent">
                    {item.price}
                  </span>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center fade-in">
          <Button className="btn-primary px-8 py-3 text-lg rounded-full">
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;