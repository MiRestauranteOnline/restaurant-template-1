import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const ReservationBookingMinimalistic = () => {
  const { adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const reservationTitle = (adminContent as any)?.homepage_reservation_title || cachedAdminContent?.homepage_reservation_title || 'Reserva Tu Mesa';
  const reservationDescription = (adminContent as any)?.homepage_reservation_description || cachedAdminContent?.homepage_reservation_description || 
    '¿Listo para disfrutar de una experiencia culinaria excepcional?';
  const reservationButtonText = (adminContent as any)?.homepage_reservation_button_text || 'Reservar Ahora';
  const reservationButtonLink = (adminContent as any)?.homepage_reservation_button_link || '#contact';

  return (
    <section className="py-24 lg:py-32 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 fade-in">
          <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
            {(adminContent as any)?.reservation_label || 'Reservaciones'}
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light">
            {reservationTitle}
          </h2>
          <div className="w-12 h-px bg-accent mx-auto" />
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            {reservationDescription}
          </p>
          <Button 
            className="btn-primary px-8 py-3 text-sm rounded-none tracking-wider uppercase mt-6"
            onClick={() => {
              if (reservationButtonLink.startsWith('#')) {
                document.querySelector(reservationButtonLink)?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open(reservationButtonLink, '_blank');
              }
            }}
          >
            {reservationButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReservationBookingMinimalistic;
