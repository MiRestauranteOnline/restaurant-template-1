import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { useDynamicColors } from '@/hooks/useDynamicColors';
import { useLayoutType } from '@/hooks/useLayoutType';

const RestaurantContent = () => {
  // Initialize dynamic colors
  useDynamicColors();
  
  // Get layout type for conditional styling
  const layoutType = useLayoutType();
  
  return (
    <div className={`min-h-screen bg-background ${layoutType === 'layout2' ? 'layout-2' : ''}`}>
      <Navigation />
      <Hero />
      <About />
      <Menu />
      <DeliveryServices />
      <Services />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

const Index = () => {
  return <RestaurantContent />;
};

export default Index;