import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useClient } from '@/contexts/ClientContext';

const FAQRustic = () => {
  const { faqs } = useClient();

  console.log('FAQRustic Component - FAQs data:', faqs);
  console.log('FAQRustic Component - FAQs length:', faqs?.length);

  if (!faqs || faqs.length === 0) return null;

  // Sort FAQs by display_order
  const sortedFaqs = [...faqs].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-left mb-16 fade-in">
            <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
              <span className="block">Preguntas</span>
              <span className="block text-gradient mt-2">Frecuentes</span>
            </h2>
            <p className="text-xl text-foreground/80 leading-relaxed pl-4">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {sortedFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${index}`}
                className="bg-card border-2 border-border rounded-xl px-6 fade-in hover:border-accent/50 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="text-left hover:text-accent transition-colors py-6">
                  <span className="font-heading text-lg font-bold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed pb-6">
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

export default FAQRustic;
