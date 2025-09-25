import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Layout2 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero with horizontal layout */}
      <div className="relative">
        <Hero />
      </div>
      
      {/* Horizontal split sections */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div className="space-y-16">
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
              <About />
            </div>
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
              <Services />
            </div>
          </div>
          
          {/* Right column */} 
          <div className="space-y-16">
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
              <Menu />
            </div>
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
              <Reviews />
            </div>
          </div>
        </div>
        
        {/* Full width sections */}
        <div className="mt-16 space-y-16">
          <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
            <DeliveryServices />
          </div>
          <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
            <Contact />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout2;