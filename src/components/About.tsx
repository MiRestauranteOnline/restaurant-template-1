import restaurantInterior from '@/assets/restaurant-interior.jpg';

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content */}
          <div className="fade-in">
            <div className="mb-6">
              <span className="text-accent font-medium tracking-wider uppercase text-sm">
                Nuestra Historia
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
                Donde la Tradición
                <span className="block text-gradient font-normal">Se Encuentra con la Innovación</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
              <p>
                Desde 2010, Savoria ha sido un faro de excelencia culinaria, 
                combinando técnicas tradicionales con un toque contemporáneo. Nuestra 
                pasión por ingredientes excepcionales y métodos de preparación 
                innovadores crea una experiencia gastronómica inolvidable.
              </p>
              
              <p>
                Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona 
                los mejores ingredientes de temporada de granjas locales y productores 
                artesanales, asegurando que cada plato cuente una historia de calidad 
                y artesanía.
              </p>
              
              <p>
                Desde cenas íntimas hasta grandes celebraciones, creamos momentos 
                que perduran en la memoria mucho después del último bocado. Bienvenido a 
                Savoria, donde cada comida es una obra maestra.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">15+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">5K+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">10+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Reconocimientos</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:order-first fade-in">
            <div className="relative">
              <img
                src={restaurantInterior}
                alt="Elegant restaurant interior with warm ambient lighting"
                className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;