import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClient } from '@/contexts/ClientContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

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

const ImageCarousel = () => {
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
      <section className="py-16 bg-primary/20">
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
    <section className="py-16 bg-primary/20">
      <div className="container mx-auto px-4">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || `Imagen del restaurante ${image.display_order}`}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ZoomIn className="text-white w-8 h-8" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-0">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Imagen del restaurante ${image.display_order}`}
                        className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default ImageCarousel;