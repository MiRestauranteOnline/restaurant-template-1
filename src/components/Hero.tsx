import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import heroPasta from '@/assets/hero-pasta.jpg';

const Hero = () => {
  const { client } = useClient();
  
  const heroTitle = client?.other_customizations?.hero_title || 
    `${client?.restaurant_name || 'Excelencia'}\nCulinaria`;
  
  const heroDescription = client?.other_customizations?.hero_description || 
    'Experimenta lo mejor de la gastronomía contemporánea con nuestros platos cuidadosamente elaborados y un servicio impecable en un ambiente de elegancia refinada.';

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroPasta})` }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-6 leading-tight">
            {heroTitle.split('\n').map((line, index) => (
              <span key={index} className={index > 0 ? 'block text-gradient font-normal' : ''}>
                {line}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-primary px-8 py-3 text-lg rounded-full">
              Ver Menú
            </Button>
            <Button variant="outline" className="btn-ghost px-8 py-3 text-lg rounded-full">
              Reservar Mesa
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-accent" />
      </div>
    </section>
  );
};

export default Hero;