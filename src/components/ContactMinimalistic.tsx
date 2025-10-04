import { MapPin } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const ContactMinimalistic = () => {
  const { client } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const contactTitle = (cachedAdminContent as any)?.homepage_contact_title || 'Visit Us';
  const contactDescription = (cachedAdminContent as any)?.homepage_contact_description || 
    'Come experience our restaurant in person.';

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              Location
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {contactTitle}
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
