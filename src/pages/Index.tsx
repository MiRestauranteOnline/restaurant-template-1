import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Services from '@/components/Services';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ClientProvider } from '@/contexts/ClientContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorPage from '@/components/ErrorPage';

const RestaurantContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Menu />
      <Services />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <ClientProvider>
      <RestaurantContent />
    </ClientProvider>
  );
};

export default Index;