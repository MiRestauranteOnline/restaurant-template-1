import { useMemo } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

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
import FAQMinimalistic from '@/components/FAQMinimalistic';
import PageMetadata from '@/components/PageMetadata';

/**
 * MINIMALISTIC RESTAURANT TEMPLATE
 * 
 * A clean, minimal design featuring generous white space and simple typography
 */

const MinimalisticRestaurant = () => {
  const { adminContent } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity

  const sections = useMemo(() => {
    const sectionList = [
      { order: 1, component: <HeroMinimalistic key="hero" /> },
      { order: adminContent?.carousel_display_order || 2, component: <ImageCarouselMinimalistic key="carousel" /> },
      ...(adminContent?.homepage_about_section_visible !== false ? [{ order: 3, component: <AboutMinimalistic key="about" /> }] : []),
      ...(adminContent?.homepage_menu_section_visible !== false ? [{ order: 4, component: <MenuMinimalistic key="menu" /> }] : []),
      ...(adminContent?.homepage_delivery_section_visible !== false ? [{ order: 5, component: <DeliveryServicesMinimalistic key="delivery" /> }] : []),
      ...(adminContent?.homepage_services_section_visible !== false ? [{ order: 6, component: <ServicesMinimalistic key="services" /> }] : []),
      ...(adminContent?.homepage_reservations_section_visible !== false ? [{ order: 6.5, component: <ReservationBookingMinimalistic key="reservation" /> }] : []),
      ...(adminContent?.homepage_reviews_section_visible !== false ? [{ order: 7, component: <HomepageReviewsMinimalistic key="reviews" /> }] : []),
      ...(adminContent?.homepage_faq_section_visible !== false ? [{ order: 7.5, component: <FAQMinimalistic key="faq" /> }] : []),
      ...(adminContent?.homepage_contact_section_visible !== false ? [{ order: 8, component: <ContactMinimalistic key="contact" /> }] : []),
    ];

    return sectionList.sort((a, b) => a.order - b.order);
  }, [adminContent?.carousel_display_order, adminContent?.homepage_about_section_visible, adminContent?.homepage_menu_section_visible, adminContent?.homepage_delivery_section_visible, adminContent?.homepage_services_section_visible, adminContent?.homepage_reservations_section_visible, adminContent?.homepage_reviews_section_visible, adminContent?.homepage_faq_section_visible, adminContent?.homepage_contact_section_visible]);

  return (
    <>
      <HeadScripts />
      <PageMetadata pageType="home" />
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
