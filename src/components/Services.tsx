import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Truck, Users, Clock, Star, MapPin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "Immerse yourself in an elegant atmosphere with impeccable service and extraordinary cuisine.",
      features: ["Seven-course tasting menu", "Wine pairing available", "Private dining rooms"]
    },
    {
      icon: Truck,
      title: "Premium Delivery",
      description: "Enjoy our signature dishes in the comfort of your home with our white-glove delivery service.",
      features: ["Same-day delivery", "Temperature-controlled transport", "Contactless service"]
    },
    {
      icon: Users,
      title: "Event Catering",
      description: "Make your special occasions unforgettable with our bespoke catering and event planning.",
      features: ["Custom menu design", "Professional service staff", "Full event coordination"]
    }
  ];

  const features = [
    { icon: Clock, text: "Open 7 Days a Week" },
    { icon: Star, text: "Michelin Recommended" },
    { icon: MapPin, text: "Prime Location" }
  ];

  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
            Exceptional
            <span className="block text-gradient font-normal">Experiences</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            From intimate dinners to grand celebrations, we provide unparalleled 
            service tailored to your every need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="card-hover bg-card border-border p-8 text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                
                <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">
                  {service.title}
                </h3>
                
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="btn-ghost rounded-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Row */}
        <div className="bg-secondary/20 rounded-2xl p-8 fade-in">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center text-center">
                <feature.icon className="w-6 h-6 text-accent mr-3" />
                <span className="text-foreground font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;