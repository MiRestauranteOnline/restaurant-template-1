import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const FooterMinimalistic = () => {
  const { client, adminContent } = useClient();
  
  const cachedAdmin = getCachedAdminContent();
  const logoUrl = adminContent?.footer_logo_url || cachedAdmin?.footer_logo_url;
  const footerDescription = adminContent?.footer_description || cachedAdmin?.footer_description;

  const currentYear = new Date().getFullYear();

  const socialMedia = (client as any)?.social_media;
  const socialLinks = [
    { icon: Facebook, url: socialMedia?.facebook, label: 'Facebook' },
    { icon: Instagram, url: socialMedia?.instagram, label: 'Instagram' },
    { icon: Twitter, url: socialMedia?.twitter, label: 'Twitter' },
  ].filter(link => link.url);

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          {logoUrl ? (
            <img src={logoUrl} alt={client?.restaurant_name || 'Restaurant'} className="h-10 mx-auto" />
          ) : (
            <h3 className="text-3xl font-heading font-light tracking-wide">
              {client?.restaurant_name || 'Restaurant'}
            </h3>
          )}

          {/* Description */}
          {footerDescription && (
            <p className="text-foreground/60 text-sm max-w-2xl mx-auto leading-relaxed">
              {footerDescription}
            </p>
          )}

          {/* Divider */}
          <div className="w-12 h-px bg-accent/30 mx-auto" />

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-accent transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-foreground/40 text-xs tracking-wider">
            © {currentYear} {client?.restaurant_name || 'Restaurant'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterMinimalistic;
