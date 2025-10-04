import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useClient } from '@/contexts/ClientContext';

const ImageCarouselMinimalistic = () => {
  const { adminContent } = useClient();

  const carouselImages = [
    (adminContent as any)?.carousel_image1_url,
    (adminContent as any)?.carousel_image2_url,
    (adminContent as any)?.carousel_image3_url,
    (adminContent as any)?.carousel_image4_url,
    (adminContent as any)?.carousel_image5_url,
    (adminContent as any)?.carousel_image6_url,
  ].filter(Boolean);

  if (carouselImages.length === 0) return null;

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
              {carouselImages.map((imageUrl, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
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
