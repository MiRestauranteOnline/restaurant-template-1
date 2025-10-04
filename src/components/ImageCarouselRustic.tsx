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

const ImageCarouselRustic = () => {
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
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse h-96 bg-muted rounded-lg border-2 border-border"></div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 bg-background">
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
            {images.map((image, index) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div 
                        className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-border card-hover transform transition-all duration-300 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <img
                          src={image.image_url}
                          alt={image.alt_text || `Imagen del restaurante ${image.display_order}`}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center">
                            <ZoomIn className="text-white w-12 h-12 mb-2 mx-auto" />
                            <span className="text-white font-heading text-lg">Ver Imagen</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
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
              <CarouselPrevious className="border-2 border-accent/30 hover:bg-accent/20" />
              <CarouselNext className="border-2 border-accent/30 hover:bg-accent/20" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default ImageCarouselRustic;
