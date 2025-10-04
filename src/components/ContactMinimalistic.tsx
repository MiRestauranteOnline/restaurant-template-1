import { MapPin } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const ContactMinimalistic = () => {
  const { client, adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const contactTitle = (adminContent as any)?.homepage_contact_section_title || 'Reserva Tu Experiencia';
  const contactDescription = (adminContent as any)?.homepage_contact_section_description || 
    'Contáctanos para reservar tu mesa y vivir una experiencia gastronómica única';
  
  // Use separate title fields from database
  const contactTitleFirstLine = (adminContent as any)?.homepage_contact_section_title_first_line || "Reserva Tu";
  const contactTitleSecondLine = (adminContent as any)?.homepage_contact_section_title_second_line || "Experiencia";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              {(adminContent as any)?.contact_us_label || 'Contáctanos'}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {contactTitleFirstLine}
              {contactTitleSecondLine && (
                <span className="block text-accent mt-2">{contactTitleSecondLine}</span>
              )}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg">
              {contactDescription}
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center space-y-6 fade-in">
            {client?.address && (
              <div className="flex flex-col items-center gap-3">
                <MapPin className="w-6 h-6 text-accent" />
                <p className="text-foreground text-lg">
                  {client.address}
                </p>
              </div>
            )}

            {/* Map */}
            {client?.coordinates && (
              <div className="mt-12 aspect-[16/9] w-full overflow-hidden border border-border">
                <iframe
                  src={`https://maps.google.com/maps?q=${client.coordinates.lat},${client.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant Location"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMinimalistic;
