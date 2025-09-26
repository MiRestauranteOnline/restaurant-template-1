import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import About from '@/components/About';
import { Card, CardContent } from '@/components/ui/card';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { Users } from 'lucide-react';

const AboutPage = () => {
  const { adminContent, teamMembers } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  // Get dynamic content from database with cached fallbacks
  const aboutHeroTitleFirst = 
    (adminContent as any)?.about_page_hero_title_first_line ?? 
    cachedAdminContent?.about_page_hero_title_first_line ?? 'Sobre';
  const aboutHeroTitleSecond = 
    (adminContent as any)?.about_page_hero_title_second_line ?? 
    cachedAdminContent?.about_page_hero_title_second_line ?? 'Nosotros';
  const aboutHeroDescription = 
    (adminContent as any)?.about_page_hero_description ?? 
    cachedAdminContent?.about_page_hero_description ?? 
    'Conoce la historia detrás de nuestro restaurante y nuestro compromiso con la excelencia culinaria.';
  const aboutHeroBackground = 
    (adminContent as any)?.about_page_hero_background_url ?? 
    cachedAdminContent?.about_page_hero_background_url ?? '/src/assets/restaurant-interior.jpg';
  
  const teamTitleFirst = (adminContent as any)?.about_team_section_title_first_line || 'Nuestro';
  const teamTitleSecond = (adminContent as any)?.about_team_section_title_second_line || 'Equipo';
  const teamDescription = (adminContent as any)?.about_team_section_description || 'Conoce a las personas apasionadas que hacen posible cada experiencia en nuestro restaurante.';

  const stats = [
    { 
      icon: getIcon((adminContent as any)?.stats_item1_icon || 'Clock'), 
      number: (adminContent as any)?.stats_item1_number || "15+", 
      label: (adminContent as any)?.stats_item1_label || "Años de Experiencia" 
    },
    { 
      icon: getIcon((adminContent as any)?.stats_item2_icon || 'Users'), 
      number: (adminContent as any)?.stats_item2_number || "5000+", 
      label: (adminContent as any)?.stats_item2_label || "Clientes Satisfechos" 
    },
    { 
      icon: getIcon((adminContent as any)?.stats_item3_icon || 'Award'), 
      number: (adminContent as any)?.stats_item3_number || "10+", 
      label: (adminContent as any)?.stats_item3_label || "Reconocimientos" 
    }
  ];

  const team = [
    {
      name: "Carlos Mendoza",
      role: "Chef Principal",
      description: "Con más de 20 años de experiencia en cocina peruana tradicional y moderna."
    },
    {
      name: "María García",
      role: "Sous Chef",
      description: "Especialista en postres y repostería peruana con técnicas contemporáneas."
    },
    {
      name: "Roberto Silva",
      role: "Gerente General",
      description: "Experto en hospitalidad y servicio al cliente, garantizando cada experiencia."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${aboutHeroBackground}')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
              {aboutHeroTitleFirst}
              <span className="block text-gradient font-normal">{aboutHeroTitleSecond}</span>
            </h1>
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              {aboutHeroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* About Component */}
      <About />

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-card border border-border rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-heading font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Only show if team members exist */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-light mb-6">
                {teamTitleFirst}
                <span className="block text-gradient font-normal">{teamTitleSecond}</span>
              </h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                {teamDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="bg-background border-border card-hover text-center">
                  <CardContent className="p-8">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Users className="w-12 h-12 text-accent" />
                      </div>
                    )}
                    <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-accent font-medium mb-4">
                      {member.title}
                    </p>
                    {member.bio && (
                      <p className="text-foreground/70 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AboutPage;