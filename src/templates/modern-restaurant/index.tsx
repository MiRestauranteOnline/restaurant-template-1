import { useEffect, useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getTemplateStatus, getGuardMessage } from '../template-guard.config';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

// Components
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import DeliveryServices from '@/components/DeliveryServices';
import Services from '@/components/Services';
import HomepageReviews from '@/components/HomepageReviews';
import FAQ from '@/components/FAQ';
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
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity

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
      ...(adminContent?.homepage_about_section_visible !== false ? [{ order: 3, component: <About key="about" /> }] : []),
      ...(adminContent?.homepage_menu_section_visible !== false ? [{ order: 4, component: <Menu key="menu" /> }] : []),
      ...(adminContent?.homepage_delivery_section_visible !== false ? [{ order: 5, component: <DeliveryServices key="delivery" /> }] : []),
      ...(adminContent?.homepage_services_section_visible !== false ? [{ order: 6, component: <Services key="services" /> }] : []),
      ...(adminContent?.homepage_reservations_section_visible !== false ? [{ order: 6.5, component: <ReservationBooking key="reservation" /> }] : []),
      ...(adminContent?.homepage_reviews_section_visible !== false ? [{ order: 7, component: <HomepageReviews key="reviews" /> }] : []),
      ...(adminContent?.homepage_faq_section_visible !== false ? [{ order: 7.5, component: <FAQ key="faq" /> }] : []),
      ...(adminContent?.homepage_contact_section_visible !== false ? [{ order: 8, component: <Contact key="contact" /> }] : []),
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order, adminContent?.homepage_about_section_visible, adminContent?.homepage_menu_section_visible, adminContent?.homepage_delivery_section_visible, adminContent?.homepage_services_section_visible, adminContent?.homepage_reservations_section_visible, adminContent?.homepage_reviews_section_visible, adminContent?.homepage_faq_section_visible, adminContent?.homepage_contact_section_visible]);

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
