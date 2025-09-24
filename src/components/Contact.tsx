import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@savoria.com", "reservations@savoria.com"]
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Culinary Street", "New York, NY 10001"]
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Thu: 5:00 PM - 10:00 PM", "Fri-Sun: 5:00 PM - 11:00 PM"]
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
            Reserve Your
            <span className="block text-gradient font-normal">Experience</span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Ready to embark on a culinary journey? We'd love to welcome you to Savoria.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="space-y-8 fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card border-border p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
                          <info.icon className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-foreground/70 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-foreground/60">Interactive Map</p>
                <p className="text-sm text-foreground/40">Location integration available</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="fade-in">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-semibold mb-6 text-foreground">
                  Make a Reservation
                </h3>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        First Name
                      </label>
                      <Input 
                        placeholder="John"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Doe"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Email
                      </label>
                      <Input 
                        type="email"
                        placeholder="john@example.com"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Phone
                      </label>
                      <Input 
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Date
                      </label>
                      <Input 
                        type="date"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Party Size
                      </label>
                      <Input 
                        type="number"
                        placeholder="2"
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Special Requests
                    </label>
                    <Textarea 
                      placeholder="Any dietary restrictions or special occasions..."
                      className="bg-background border-border focus:border-accent resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <Button className="btn-primary w-full py-3 text-lg rounded-full">
                    Confirm Reservation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;