import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useClient } from '@/contexts/ClientContext';

interface CarouselImage {
  id: string;
  client_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ImageCarouselMinimalistic = () => {
  const { client, adminContent } = useClient();
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Don't render if carousel is disabled
  if (adminContent?.carousel_enabled === false) {
    return null;
  }

  useEffect(() => {
    const fetchCarouselImages = async () => {
      if (!client?.id) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('carousel_images' as any)
          .select('*')
          .eq('client_id', client.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }
        setImages((data as unknown as CarouselImage[]) || []);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, [client?.id]);

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto fade-in">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
          <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Gallery image ${image.display_order}`}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 border border-border opacity-50" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ImageCarouselMinimalistic;
