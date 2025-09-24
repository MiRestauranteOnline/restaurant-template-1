import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Restaurant",
      links: ["About Us", "Our Chef", "Menu", "Reservations", "Gift Cards"]
    },
    {
      title: "Services",
      links: ["Fine Dining", "Private Events", "Catering", "Wine Selection", "Delivery"]
    },
    {
      title: "Information",
      links: ["Contact", "Location", "Hours", "Careers", "Press"]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-heading font-bold text-gradient mb-4">
              Savoria
            </h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Experience culinary excellence in an atmosphere of refined elegance. 
              Every meal is crafted with passion and the finest ingredients.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-accent hover:text-accent-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-foreground/70 hover:text-accent transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-secondary/20 rounded-2xl p-8 mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-heading font-semibold mb-3 text-foreground">
              Stay Connected
            </h4>
            <p className="text-foreground/70 mb-6">
              Subscribe to our newsletter for exclusive updates, special events, and culinary insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:border-accent transition-colors"
              />
              <button className="btn-primary px-6 py-3 rounded-full whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-foreground/60 text-sm mb-4 md:mb-0">
              © 2024 Savoria Restaurant. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;