import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Layout3 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero with overlay gradient */}
      <div className="relative">
        <Hero />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      </div>
      
      {/* Magazine-style card layout */}
      <div className="container mx-auto px-4 py-20 space-y-20">
        {/* Featured section - About */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl" />
          <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-border/30">
            <About />
          </div>
        </div>
        
        {/* Three-column magazine layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/30 h-full">
              <Menu />
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/30">
              <Services />
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/30">
              <DeliveryServices />
            </div>
          </div>
        </div>
        
        {/* Reviews in spotlight */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-primary/5 rounded-3xl" />
          <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-border/30">
            <Reviews />
          </div>
        </div>
        
        {/* Contact with emphasis */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl" />
          <div className="relative bg-card/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-primary/20">
            <Contact />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout3;