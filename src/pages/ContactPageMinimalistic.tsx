import NavigationMinimalistic from '@/components/NavigationMinimalistic';
import FooterMinimalistic from '@/components/FooterMinimalistic';
import ContactMinimalistic from '@/components/ContactMinimalistic';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent, getCachedClientData } from '@/utils/cachedContent';
import { formatOpeningHours } from '@/utils/formatOpeningHours';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';

const ContactPageMinimalistic = () => {
  const { client, adminContent } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  const cachedClient = getCachedClientData();
  
  const contactHeroTitleFirst = 
    (adminContent as any)?.contact_page_hero_title_first_line ?? 
    cachedAdminContent?.contact_page_hero_title_first_line ?? 'Get in';
  const contactHeroTitleSecond = 
    (adminContent as any)?.contact_page_hero_title_second_line ?? 
    cachedAdminContent?.contact_page_hero_title_second_line ?? 'Touch';
  const contactHeroDescription = 
    (adminContent as any)?.contact_page_hero_description ?? 
    cachedAdminContent?.contact_page_hero_description ?? 
    'We\'re here to help with reservations, inquiries, or any information you need.';
  const contactHeroBackground = 
    (adminContent as any)?.contact_page_hero_background_url ?? 
    cachedAdminContent?.contact_page_hero_background_url ?? '/src/assets/grilled-steak.jpg';

  const formatHoursForContactPage = (hours: any) => {
    const formattedHours = formatOpeningHours(hours);
    return formattedHours.map(hourString => {
      const [day, time] = hourString.split(': ');
      return { day, time };
    });
  };

  const contactMethods = [
    ...(client?.phone || cachedClient?.phone ? [{
      icon: Phone,
      title: (adminContent as any)?.contact_phone_label || cachedAdminContent?.contact_phone_label || "Llámanos",
      content: client?.phone ? `${client.phone_country_code || '+51'} ${client.phone}` : "+51 987 654 321",
      action: () => {
        const phoneNumber = client?.phone ? 
          `${client.phone_country_code || '+51'}${client.phone}` : 
          '+51987654321';
        window.open(`tel:${phoneNumber}`, '_self');
      }
    }] : []),
    ...(client?.whatsapp || cachedClient?.whatsapp ? [{
      icon: Mail,
      title: "WhatsApp", 
      content: (adminContent as any)?.contact_whatsapp_label || cachedAdminContent?.contact_whatsapp_label || "Envíanos un mensaje",
      action: () => {
        const whatsappNumber = client?.whatsapp ? 
          `${client.whatsapp_country_code?.replace('+', '') || '51'}${client.whatsapp}` : 
          '51987654321';
        const message = (adminContent as any)?.whatsapp_contact_message || 'Hola, me gustaría contactarlos';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    }] : []),
    {
      icon: MapPin,
      title: (adminContent as any)?.contact_visit_label || cachedAdminContent?.contact_visit_label || "Visítanos",
      content: client?.address || "Av. Larco 123, Miraflores, Lima",
      action: () => {
        if (client?.address) {
          window.open(`https://maps.google.com/?q=${encodeURIComponent(client.address)}`, '_blank');
        } else if (client?.coordinates) {
          const coords = client.coordinates;
          window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
        } else {
          window.open('https://maps.google.com', '_blank');
        }
      }
    }
  ];

  const hours = formatHoursForContactPage(client?.opening_hours_ordered || client?.opening_hours);

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationMinimalistic />
        
        {/* Hero Section - Minimalistic Style */}
        <section className="relative pt-20 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${contactHeroBackground}')` }}
            role="img"
            aria-label="Contact page background"
          />
          
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                {(adminContent as any)?.contact_us_label || 'Contact'}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight">
                {contactHeroTitleFirst}
                {contactHeroTitleSecond && (
                  <span className="block text-accent">{contactHeroTitleSecond}</span>
                )}
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                {contactHeroDescription}
              </p>
            </div>
          </div>
        </section>

        <main>
          {/* Contact Methods */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid md:grid-cols-3 gap-12">
                {contactMethods.map((method, index) => (
                  <div 
                    key={index}
                    className="text-center fade-in group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={method.action}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <method.icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                        {method.title}
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        {method.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours Section */}
              {hours && hours.length > 0 && (
                <div className="mt-16 max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-accent" />
                      <h3 className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                        {(adminContent as any)?.opening_hours_label || cachedAdminContent?.opening_hours_label || 'Horarios de Atención'}
                      </h3>
                    </div>
                    <div className="w-12 h-px bg-accent mx-auto" />
                  </div>
                  <div className="space-y-3">
                    {hours.map((hour, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-foreground tracking-wide capitalize">{hour.day}</span>
                        <span className="text-foreground/60 text-sm">{hour.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Contact Component */}
          {adminContent?.contact_page_contact_section_visible !== false && <ContactMinimalistic />}
        </main>

        <FooterMinimalistic />
      </div>
    </>
  );
};

export default ContactPageMinimalistic;
