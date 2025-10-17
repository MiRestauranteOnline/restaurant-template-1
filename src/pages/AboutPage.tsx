import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import About from '@/components/About';
import { Card, CardContent } from '@/components/ui/card';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { Users } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';

const AboutPage = () => {
  const { adminContent, teamMembers } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  
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
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${aboutHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página Sobre Nosotros"
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
        <main>
          {adminContent?.about_page_about_section_visible !== false && <About />}

          {/* Stats Section */}
          {adminContent?.about_page_stats_section_visible !== false && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {stats.map((stat, index) => (
                    <Card key={index} className="text-center border-2 hover:border-accent/50 transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                          <stat.icon className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-4xl font-heading font-bold mb-2 text-foreground">
                          {stat.number}
                        </h3>
                        <p className="text-foreground/70">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Team Section - Only show if team members exist */}
          {adminContent?.about_page_team_section_visible !== false && teamMembers && teamMembers.length > 0 && (
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                    {teamTitleFirst}
                    <span className="block text-gradient mt-2">{teamTitleSecond}</span>
                  </h2>
                  <p className="text-xl text-foreground/80 leading-relaxed">
                    {teamDescription}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <Card key={member.id} className="overflow-hidden border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={member.image_url || '/placeholder.svg'} 
                            alt={member.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">
                            {member.name}
                          </h3>
                          <p className="text-accent font-medium mb-3">{member.title}</p>
                          <p className="text-foreground/70 leading-relaxed">{member.bio}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;