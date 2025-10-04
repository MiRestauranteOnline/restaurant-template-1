import NavigationMinimalistic from '@/components/NavigationMinimalistic';
import FooterMinimalistic from '@/components/FooterMinimalistic';
import AboutMinimalistic from '@/components/AboutMinimalistic';
import { getIcon } from '@/utils/iconMapper';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';

const AboutPageMinimalistic = () => {
  const { adminContent, teamMembers } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  // Get dynamic content from database with cached fallbacks
  const aboutHeroTitleFirst = 
    (adminContent as any)?.about_page_hero_title_first_line ?? 
    cachedAdminContent?.about_page_hero_title_first_line ?? 'About';
  const aboutHeroTitleSecond = 
    (adminContent as any)?.about_page_hero_title_second_line ?? 
    cachedAdminContent?.about_page_hero_title_second_line ?? 'Us';
  const aboutHeroDescription = 
    (adminContent as any)?.about_page_hero_description ?? 
    cachedAdminContent?.about_page_hero_description ?? 
    'Discover the story behind our restaurant and our commitment to culinary excellence.';
  const aboutHeroBackground = 
    (adminContent as any)?.about_page_hero_background_url ?? 
    cachedAdminContent?.about_page_hero_background_url ?? '/src/assets/restaurant-interior.jpg';
  
  const teamTitleFirst = (adminContent as any)?.about_team_section_title_first_line || 'Meet';
  const teamTitleSecond = (adminContent as any)?.about_team_section_title_second_line || 'Our Team';
  const teamDescription = (adminContent as any)?.about_team_section_description || 'The passionate people behind every experience.';

  const stats = [
    { 
      icon: getIcon((adminContent as any)?.stats_item1_icon || 'Clock'), 
      number: (adminContent as any)?.stats_item1_number || "15+", 
      label: (adminContent as any)?.stats_item1_label || "Years of Experience" 
    },
    { 
      icon: getIcon((adminContent as any)?.stats_item2_icon || 'Users'), 
      number: (adminContent as any)?.stats_item2_number || "5000+", 
      label: (adminContent as any)?.stats_item2_label || "Happy Customers" 
    },
    { 
      icon: getIcon((adminContent as any)?.stats_item3_icon || 'Award'), 
      number: (adminContent as any)?.stats_item3_number || "10+", 
      label: (adminContent as any)?.stats_item3_label || "Awards" 
    }
  ];

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationMinimalistic />
        
        {/* Hero Section - Minimalistic Style */}
        <section className="relative pt-20 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${aboutHeroBackground}')` }}
            role="img"
            aria-label="About page background"
          />
          
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
                {(adminContent as any)?.our_story_label || 'Nuestra Historia'}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight">
                {aboutHeroTitleFirst}
                {aboutHeroTitleSecond && (
                  <span className="block text-accent">{aboutHeroTitleSecond}</span>
                )}
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                {aboutHeroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* About Component */}
        <main>
          <AboutMinimalistic />

          {/* Stats Section - Minimalistic Style */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center fade-in group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <stat.icon className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-5xl font-heading font-light text-foreground">
                        {stat.number}
                      </h3>
                      <div className="w-12 h-px bg-accent/30" />
                      <p className="text-foreground/60 text-sm tracking-wider uppercase">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section - Minimalistic Style - Only show if team members exist */}
          {teamMembers && teamMembers.length > 0 && (
            <section className="py-16 lg:py-24 bg-background">
              <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16 fade-in">
                  <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
                    {(adminContent as any)?.our_team_label || 'Nuestro Equipo'}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
                    {teamTitleFirst}
                    {teamTitleSecond && (
                      <span className="block text-accent mt-2">{teamTitleSecond}</span>
                    )}
                  </h2>
                  <div className="w-12 h-px bg-accent mx-auto mt-6 mb-4" />
                  <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                    {teamDescription}
                  </p>
                </div>
                
                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="fade-in group text-center"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative aspect-square overflow-hidden mb-4">
                        <img 
                          src={member.image_url || '/placeholder.svg'} 
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 border border-border opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-2xl font-heading font-light mb-1">
                        {member.name}
                      </h3>
                      <p className="text-accent text-sm tracking-wider uppercase mb-3">{member.title}</p>
                      <div className="w-8 h-px bg-accent/30 mx-auto mb-3" />
                      <p className="text-foreground/60 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <FooterMinimalistic />
      </div>
    </>
  );
};

export default AboutPageMinimalistic;
