import { useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';

// Components
import NavigationMinimalistic from '@/components/NavigationMinimalistic';
import HeroMinimalistic from '@/components/HeroMinimalistic';
import AboutMinimalistic from '@/components/AboutMinimalistic';
import MenuMinimalistic from '@/components/MenuMinimalistic';
import DeliveryServicesMinimalistic from '@/components/DeliveryServicesMinimalistic';
import ServicesMinimalistic from '@/components/ServicesMinimalistic';
import HomepageReviewsMinimalistic from '@/components/HomepageReviewsMinimalistic';
import ContactMinimalistic from '@/components/ContactMinimalistic';
import FooterMinimalistic from '@/components/FooterMinimalistic';
import ImageCarouselMinimalistic from '@/components/ImageCarouselMinimalistic';
import ReservationBookingMinimalistic from '@/components/ReservationBookingMinimalistic';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';

/**
 * MINIMALISTIC RESTAURANT TEMPLATE
 * 
 * A clean, minimal design featuring generous white space and simple typography
 */

const MinimalisticRestaurant = () => {
  const { adminContent } = useClient();

  const sections = useMemo(() => {
    const sectionList = [
      { order: 1, component: <HeroMinimalistic key="hero" /> },
      { order: adminContent?.carousel_display_order || 2, component: <ImageCarouselMinimalistic key="carousel" /> },
      { order: 3, component: <AboutMinimalistic key="about" /> },
      { order: 4, component: <MenuMinimalistic key="menu" /> },
      { order: 5, component: <DeliveryServicesMinimalistic key="delivery" /> },
      { order: 6, component: <ServicesMinimalistic key="services" /> },
      { order: 6.5, component: <ReservationBookingMinimalistic key="reservation" /> },
      { order: 7, component: <HomepageReviewsMinimalistic key="reviews" /> },
      { order: 8, component: <ContactMinimalistic key="contact" /> },
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order]);

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationMinimalistic />
        <main>
          {sections.map(section => section.component)}
        </main>
        <FooterMinimalistic />
      </div>
    </>
  );
};

export default MinimalisticRestaurant;
