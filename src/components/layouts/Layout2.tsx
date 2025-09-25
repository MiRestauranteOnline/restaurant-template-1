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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      {/* Distinctive Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <Hero />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
      
      {/* Modern Grid Layout with Glass Morphism */}
      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4 pb-20">
          
          {/* Featured About Section */}
          <div className="mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-card/80 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-primary/20 hover:border-primary/40 transition-all duration-500">
                <About />
              </div>
            </div>
          </div>
          
          {/* Dynamic Two-Column Layout */}
          <div className="grid lg:grid-cols-5 gap-8 mb-20">
            {/* Menu takes more space */}
            <div className="lg:col-span-3">
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/30 hover:border-accent/40 transition-all duration-500 h-full">
                  <Menu />
                </div>
              </div>
            </div>
            
            {/* Services Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-transparent rounded-2xl blur-md group-hover:blur-lg transition-all duration-500" />
                <div className="relative bg-card/85 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/20 hover:border-primary/30 transition-all duration-500">
                  <Services />
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-bl from-accent/15 to-transparent rounded-2xl blur-md group-hover:blur-lg transition-all duration-500" />
                <div className="relative bg-card/85 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/20 hover:border-accent/30 transition-all duration-500">
                  <DeliveryServices />
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews with Spotlight Effect */}
          <div className="mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-card/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-accent/20 hover:border-accent/40 transition-all duration-500">
                <Reviews />
              </div>
            </div>
          </div>
          
          {/* Contact with Emphasis */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-accent/25 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-card/95 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500">
              <Contact />
            </div>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout2;