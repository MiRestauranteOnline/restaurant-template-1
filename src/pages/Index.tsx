import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import HomepageReviews from '@/components/HomepageReviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const RestaurantContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Menu />
      <DeliveryServices />
      <Services />
      <HomepageReviews />
      <Contact />
      <Footer />
    </div>
  );
};

const Index = () => {
  return <RestaurantContent />;
};

export default Index;