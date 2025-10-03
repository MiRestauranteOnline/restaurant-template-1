import { useEffect, useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getTemplateStatus, getGuardMessage } from '../template-guard.config';

// Components
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import HomepageReviews from '@/components/HomepageReviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ImageCarousel from '@/components/ImageCarousel';
import ReservationBooking from '@/components/ReservationBooking';
import StructuredData from '@/components/StructuredData';

/**
 * MODERN RESTAURANT TEMPLATE
 * 
 * Template Guard Status: Loaded dynamically from database
 * This will log the current status (development/production) in development mode
 */

const ModernRestaurant = () => {
  const { adminContent } = useClient();

  // Log template guard status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      getTemplateStatus('modern-restaurant').then(status => {
        const message = getGuardMessage(status, 0);
        console.warn(`[Template Guard] modern-restaurant: ${status}\n${message}`);
      });
    }
  }, []);

  const sections = useMemo(() => {
    const sectionList = [
      { order: 1, component: <Hero key="hero" /> },
      { order: adminContent?.carousel_display_order || 2, component: <ImageCarousel key="carousel" /> },
      { order: 3, component: <About key="about" /> },
      { order: 4, component: <Menu key="menu" /> },
      { order: 5, component: <DeliveryServices key="delivery" /> },
      { order: 6, component: <Services key="services" /> },
      { order: 6.5, component: <ReservationBooking key="reservation" /> },
      { order: 7, component: <HomepageReviews key="reviews" /> },
      { order: 8, component: <Contact key="contact" /> },
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order]);

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          {sections.map(section => section.component)}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ModernRestaurant;
