import { useEffect, useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getTemplateStatus, getGuardMessage } from '../template-guard.config';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

// Components
import NavigationRustic from '@/components/NavigationRustic';
import HeroRustic from '@/components/HeroRustic';
import AboutRustic from '@/components/AboutRustic';
import MenuRustic from '@/components/MenuRustic';
import DeliveryServicesRustic from '@/components/DeliveryServicesRustic';
import ServicesRustic from '@/components/ServicesRustic';
import HomepageReviewsRustic from '@/components/HomepageReviewsRustic';
import ContactRustic from '@/components/ContactRustic';
import FooterRustic from '@/components/FooterRustic';
import ImageCarouselRustic from '@/components/ImageCarouselRustic';
import ReservationBookingRustic from '@/components/ReservationBookingRustic';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { Separator } from '@/components/ui/separator';
import FAQRustic from '@/components/FAQRustic';
import PageMetadata from '@/components/PageMetadata';

/**
 * RUSTIC RESTAURANT TEMPLATE
 * 
 * Template Guard Status: Loaded dynamically from database
 * This will log the current status (development/production) in development mode
 */

const RusticRestaurant = () => {
  const { client, adminContent } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity

  // Log template guard status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      getTemplateStatus('rustic-restaurant').then(status => {
        const message = getGuardMessage(status, 0);
        console.warn(`[Template Guard] rustic-restaurant: ${status}\n${message}`);
      });
    }
  }, []);

  const sections = useMemo(() => {
    const sectionList = [
      { order: 1, component: <HeroRustic key="hero" /> },
      { order: adminContent?.carousel_display_order || 2, component: <ImageCarouselRustic key="carousel" /> },
      ...(adminContent?.homepage_about_section_visible !== false ? [{ order: 3, component: <AboutRustic key="about" /> }] : []),
      ...(adminContent?.homepage_menu_section_visible !== false ? [{ order: 4, component: <MenuRustic key="menu" /> }] : []),
      ...(adminContent?.homepage_delivery_section_visible !== false ? [{ order: 5, component: <DeliveryServicesRustic key="delivery" /> }] : []),
      ...(adminContent?.homepage_services_section_visible !== false ? [{ order: 6, component: <ServicesRustic key="services" /> }] : []),
      { order: 6.4, component: (
        <div key="divider" className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-border/50" />
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-accent/40"></div>
              <div className="w-2 h-2 rounded-full bg-accent/60"></div>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <div className="w-2 h-2 rounded-full bg-accent/60"></div>
              <div className="w-2 h-2 rounded-full bg-accent/40"></div>
            </div>
            <Separator className="flex-1 bg-border/50" />
          </div>
        </div>
      ) },
      ...(adminContent?.homepage_reservations_section_visible !== false ? [{ order: 6.5, component: <ReservationBookingRustic key="reservation" /> }] : []),
      ...(adminContent?.homepage_reviews_section_visible !== false ? [{ order: 7, component: <HomepageReviewsRustic key="reviews" /> }] : []),
      ...(adminContent?.homepage_faq_section_visible !== false ? [{ order: 7.5, component: <FAQRustic key="faq" /> }] : []),
      ...(adminContent?.homepage_contact_section_visible !== false ? [{ order: 8, component: <ContactRustic key="contact" /> }] : []),
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order, adminContent?.homepage_about_section_visible, adminContent?.homepage_menu_section_visible, adminContent?.homepage_delivery_section_visible, adminContent?.homepage_services_section_visible, adminContent?.homepage_reservations_section_visible, adminContent?.homepage_reviews_section_visible, adminContent?.homepage_faq_section_visible, adminContent?.homepage_contact_section_visible]);

  return (
    <>
      <HeadScripts />
      <PageMetadata pageType="home" />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationRustic />
        <main>
          {sections.map(section => section.component)}
        </main>
        <FooterRustic />
      </div>
    </>
  );
};

export default RusticRestaurant;
