import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroPasta from '@/assets/hero-pasta.jpg';

const Hero = () => {
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
            Culinary
            <span className="block text-gradient font-normal">Excellence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the finest in contemporary dining with our carefully crafted dishes 
            and impeccable service in an atmosphere of refined elegance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-primary px-8 py-3 text-lg rounded-full">
              Explore Menu
            </Button>
            <Button variant="outline" className="btn-ghost px-8 py-3 text-lg rounded-full">
              Reserve Table
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