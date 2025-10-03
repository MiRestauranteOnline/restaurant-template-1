import { useClient } from '@/contexts/ClientContext';
import { useEffect, useState } from 'react';

const StructuredData = () => {
  const { client, clientSettings, reviews } = useClient();
  const [structuredData, setStructuredData] = useState<string>('');

  useEffect(() => {
    if (!client) return;

    // Calculate average rating from reviews
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + ((review as any).rating || 0), 0) / reviews.length
      : undefined;

    // Build opening hours specification
    const openingHours = client.opening_hours ? Object.entries(client.opening_hours)
      .filter(([_, hours]) => hours && hours !== 'Cerrado')
      .map(([day, hours]) => {
        const dayMap: Record<string, string> = {
          'lunes': 'Monday',
          'martes': 'Tuesday',
          'miércoles': 'Wednesday',
          'jueves': 'Thursday',
          'viernes': 'Friday',
          'sábado': 'Saturday',
          'domingo': 'Sunday'
        };
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": dayMap[day.toLowerCase()] || day,
          "opens": typeof hours === 'string' ? hours.split('-')[0]?.trim() : '',
          "closes": typeof hours === 'string' ? hours.split('-')[1]?.trim() : ''
        };
      }) : [];

    const clientAny = client as any;
    const settingsAny = clientSettings as any;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": client.restaurant_name,
      "image": clientAny.logo_url || undefined,
      "description": clientAny.description || undefined,
      "@id": window.location.origin,
      "url": window.location.origin,
      "telephone": client.phone ? `${client.phone_country_code || '+51'}${client.phone}` : undefined,
      "address": client.address ? {
        "@type": "PostalAddress",
        "streetAddress": client.address,
        "addressLocality": clientAny.city || undefined,
        "addressCountry": clientAny.country || "PE"
      } : undefined,
      "geo": clientAny.latitude && clientAny.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": clientAny.latitude,
        "longitude": clientAny.longitude
      } : undefined,
      "openingHoursSpecification": openingHours.length > 0 ? openingHours : undefined,
      "servesCuisine": settingsAny?.cuisine_type || "International",
      "priceRange": settingsAny?.price_range || "$$",
      "aggregateRating": avgRating && reviews && reviews.length > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": avgRating.toFixed(1),
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));
    setStructuredData(JSON.stringify(cleanSchema));
  }, [client, clientSettings, reviews]);

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: structuredData }}
    />
  );
};

export default StructuredData;
