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
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      {/* Completely different hero treatment - minimal and bold */}
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="relative">
          <Hero />
        </div>
      </div>
      
      {/* Modern asymmetric layout */}
      <div className="bg-background">
        
        {/* About - Full width with different typography */}
        <section className="py-24 bg-gradient-to-r from-background to-muted/30">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto">
              <div className="prose prose-lg max-w-none [&_h1]:font-sans [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-bold [&_h3]:tracking-tight [&_p]:leading-relaxed">
                <About />
              </div>
            </div>
          </div>
        </section>
        
        {/* Split layout - Menu and Services */}
        <section className="py-24">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-12 gap-16">
              
              {/* Menu - Takes up 8 columns with bold, modern styling */}
              <div className="lg:col-span-8">
                <div className="bg-card border-l-4 border-primary pl-8 pr-6 py-8 shadow-sm rounded-none [&_h1]:font-sans [&_h1]:font-bold [&_h1]:text-4xl [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:tracking-tight">
                  <Menu />
                </div>
              </div>
              
              {/* Services sidebar - Clean and minimal */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-muted/20 rounded-none p-8 border-b-2 border-accent [&_h1]:font-sans [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-xl [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:tracking-tight">
                  <Services />
                </div>
                
                {/* Delivery inline with services */}
                <div className="bg-primary/5 rounded-none p-8 border-t-2 border-primary [&_h1]:font-sans [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-xl [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:tracking-tight">
                  <DeliveryServices />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reviews - Wide format with different styling */}
        <section className="py-24 bg-muted/10">
          <div className="container mx-auto px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-card border-t-4 border-accent p-12 shadow-sm rounded-none [&_h1]:font-sans [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:tracking-tight [&_p]:leading-relaxed">
                <Reviews />
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact - Bold bottom section */}
        <section className="py-24 bg-gradient-to-t from-primary/10 to-background">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-card border-2 border-primary/20 p-12 shadow-lg rounded-none [&_h1]:font-sans [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:tracking-tight [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:tracking-tight [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:tracking-tight">
                <Contact />
              </div>
            </div>
          </div>
        </section>
        
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout2;