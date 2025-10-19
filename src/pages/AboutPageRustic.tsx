import NavigationRustic from '@/components/NavigationRustic';
import FooterRustic from '@/components/FooterRustic';
import AboutRustic from '@/components/AboutRustic';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import PageMetadata from '@/components/PageMetadata';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

const AboutPageRustic = () => {
  const { adminContent, teamMembers } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity
  
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

  return (
    <>
      <HeadScripts />
      <PageMetadata pageType="about" />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationRustic />
        
        {/* Hero Section - Rustic Style */}
        <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${aboutHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página Sobre Nosotros"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4 block mb-4">
                Nuestra Historia
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 border-l-4 border-foreground/10 pl-4">
                <span className="block">{aboutHeroTitleFirst}</span>
                <span className="block text-gradient mt-2">{aboutHeroTitleSecond}</span>
              </h1>
              <p className="text-xl text-foreground/90 leading-relaxed pl-4">
                {aboutHeroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* About Component */}
        <main>
          {adminContent?.about_page_about_section_visible !== false && <AboutRustic />}

          {/* Decorative Divider */}
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-border/50" />
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-accent/40"></div>
                <div className="w-2 h-2 rounded-full bg-accent/60"></div>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <div className="w-2 h-2 rounded-full bg-accent/60"></div>
                <div className="w-2 h-2 rounded-full bg-accent/40"></div>
              </div>
              <Separator className="flex-1 bg-border/50" />
            </div>
          </div>

          {/* Stats Section - Rustic Style */}
          {adminContent?.about_page_stats_section_visible !== false && (
            <section className="py-20 lg:py-32 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {stats.map((stat, index) => (
                    <Card 
                      key={index} 
                      className="text-left border-2 border-border card-hover bg-card overflow-hidden group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6 mb-4">
                          <div className="flex-shrink-0 p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                            <stat.icon className="w-10 h-10 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-5xl font-heading font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                              {stat.number}
                            </h3>
                            <div className="w-16 h-1 bg-accent/30 rounded-full mb-3"></div>
                            <p className="text-foreground/70 text-lg leading-relaxed">{stat.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Team Section - Rustic Style - Only show if team members exist */}
          {adminContent?.about_page_team_section_visible !== false && teamMembers && teamMembers.length > 0 && (
            <section className="py-20 lg:py-32 bg-background">
              <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-left max-w-3xl mb-16 fade-in">
                  <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
                    Nuestro Equipo
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
                    <span className="block">{teamTitleFirst}</span>
                    {teamTitleSecond && (
                      <span className="block text-gradient mt-2">{teamTitleSecond}</span>
                    )}
                  </h2>
                  <p className="text-xl text-foreground/80 leading-relaxed pl-4">
                    {teamDescription}
                  </p>
                </div>
                
                {/* Team Grid - Asymmetric Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {teamMembers.map((member, index) => (
                    <Card 
                      key={member.id} 
                      className={`overflow-hidden border-2 border-border card-hover bg-card group ${
                        index === teamMembers.length - 1 && teamMembers.length % 2 !== 0 
                          ? 'md:col-span-2 md:max-w-2xl md:mx-auto' 
                          : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-5 gap-0">
                          <div className="md:col-span-2 aspect-square md:aspect-auto overflow-hidden">
                            <img 
                              src={member.image_url || '/placeholder.svg'} 
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="md:col-span-3 p-8 flex flex-col justify-center">
                            <h3 className="text-3xl font-heading font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                              {member.name}
                            </h3>
                            <div className="w-16 h-1 bg-accent/30 rounded-full mb-4"></div>
                            <p className="text-accent font-medium text-lg mb-4">{member.title}</p>
                            <p className="text-foreground/70 leading-relaxed">{member.bio}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <FooterRustic />
      </div>
    </>
  );
};

export default AboutPageRustic;
