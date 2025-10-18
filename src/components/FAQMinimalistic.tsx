import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useClient } from '@/contexts/ClientContext';

const FAQMinimalistic = () => {
  const { faqs } = useClient();

  console.log('FAQMinimalistic Component - FAQs data:', faqs);
  console.log('FAQMinimalistic Component - FAQs length:', faqs?.length);

  if (!faqs || faqs.length === 0) return null;

  // Sort FAQs by display_order
  const sortedFaqs = [...faqs].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              Preguntas <span className="block text-accent mt-2">Frecuentes</span>
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {sortedFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${index}`}
                className="border-b border-border/50 pb-2 fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-left hover:text-accent transition-colors py-4">
                  <span className="font-heading text-lg font-normal">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQMinimalistic;
