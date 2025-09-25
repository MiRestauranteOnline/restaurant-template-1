import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Layout4 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero with split design */}
      <div className="relative">
        <Hero />
      </div>
      
      {/* Split-screen contemporary layout */}
      <div className="min-h-screen">
        {/* About & Menu Split */}
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="bg-gradient-to-br from-card to-card/50 flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-2xl">
              <About />
            </div>
          </div>
          <div className="bg-gradient-to-bl from-muted/30 to-background flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-2xl">
              <Menu />
            </div>
          </div>
        </div>
        
        {/* Services & Reviews Split */}
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="bg-gradient-to-tr from-primary/5 to-accent/5 flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-2xl">
              <Services />
            </div>
          </div>
          <div className="bg-gradient-to-tl from-card to-muted/20 flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-2xl">
              <Reviews />
            </div>
          </div>
        </div>
        
        {/* Delivery & Contact Full Width */}
        <div className="bg-gradient-to-r from-background via-card/30 to-background py-20">
          <div className="container mx-auto px-4 space-y-20">
            <div className="text-center">
              <DeliveryServices />
            </div>
            <div className="max-w-4xl mx-auto">
              <Contact />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout4;