import { useEffect, useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { getTemplateStatus, getGuardMessage } from '../template-guard.config';

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

/**
 * RUSTIC RESTAURANT TEMPLATE
 * 
 * Template Guard Status: Loaded dynamically from database
 * This will log the current status (development/production) in development mode
 */

const RusticRestaurant = () => {
  const { adminContent } = useClient();

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
      { order: 3, component: <AboutRustic key="about" /> },
      { order: 4, component: <MenuRustic key="menu" /> },
      { order: 5, component: <DeliveryServicesRustic key="delivery" /> },
      { order: 6, component: <ServicesRustic key="services" /> },
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
      { order: 6.5, component: <ReservationBookingRustic key="reservation" /> },
      { order: 7, component: <HomepageReviewsRustic key="reviews" /> },
      { order: 8, component: <ContactRustic key="contact" /> },
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order]);

  return (
    <>
      <HeadScripts />
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
