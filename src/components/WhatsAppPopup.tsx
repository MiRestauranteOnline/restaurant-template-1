import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedClientData, getCachedClientSettings } from '@/utils/cachedContent';
import { useState } from 'react';

const WhatsAppPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { client, clientSettings } = useClient();
  
  // Get cached data to prevent layout shifts
  const cachedClient = getCachedClientData();
  const cachedSettings = getCachedClientSettings();

  // Check if popup should be shown
  const showPopup = clientSettings?.show_whatsapp_popup ?? cachedSettings?.show_whatsapp_popup ?? false;
  
  // Get WhatsApp number with fallback to cached
  const whatsappNumber = client?.whatsapp || cachedClient?.whatsapp;
  const whatsappCountryCode = client?.whatsapp_country_code || cachedClient?.whatsapp_country_code || '51';
  
  // Don't render if popup is disabled or no WhatsApp number
  if (!showPopup || !whatsappNumber || !isVisible) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const formattedNumber = `${whatsappCountryCode.replace('+', '')}${whatsappNumber}`;
    const message = encodeURIComponent('Hola, me gustaría hacer una consulta');
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(false)}
        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background border shadow-lg"
        aria-label="Cerrar WhatsApp popup"
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* WhatsApp button */}
      <Button
        onClick={handleWhatsAppClick}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default WhatsAppPopup;