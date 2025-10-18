import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useClient } from '@/contexts/ClientContext';

const FAQ = () => {
  const { faqs } = useClient();

  console.log('FAQ Component - FAQs data:', faqs);
  console.log('FAQ Component - FAQs length:', faqs?.length);

  if (!faqs || faqs.length === 0) return null;

  // Sort FAQs by display_order
  const sortedFaqs = [...faqs].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6">
              Preguntas <span className="text-gradient">Frecuentes</span>
            </h2>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {sortedFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="text-left hover:text-accent transition-colors">
                  <span className="font-heading text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
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

export default FAQ;
