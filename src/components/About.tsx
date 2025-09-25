import restaurantInterior from '@/assets/restaurant-interior.jpg';
import { useClient } from '@/contexts/ClientContext';

const About = () => {
  const { client, adminContent } = useClient();
  
  const sectionTitle = adminContent?.homepage_about_section_title || "Nuestra Historia";
  const sectionDescription = adminContent?.homepage_about_section_description;
  
  // Use admin content with separate title fields
  const aboutTitleFirstLine = (adminContent as any)?.homepage_about_section_title_first_line || "Donde la Tradición";
  const aboutTitleSecondLine = (adminContent as any)?.homepage_about_section_title_second_line || "Se Encuentra con la Innovación";
  
  // Use separate content fields from database
  const aboutStory = (adminContent as any)?.about_story;
  const aboutChefInfo = (adminContent as any)?.about_chef_info;
  const aboutMission = (adminContent as any)?.about_mission;
  
  // Stats from database
  const stats = {
    experience: {
      number: (adminContent as any)?.stats_experience_number || '15+',
      label: (adminContent as any)?.stats_experience_label || 'Años de Experiencia'
    },
    clients: {
      number: (adminContent as any)?.stats_clients_number || '5K+',
      label: (adminContent as any)?.stats_clients_label || 'Clientes Felices'
    },
    awards: {
      number: (adminContent as any)?.stats_awards_number || '10+',
      label: (adminContent as any)?.stats_awards_label || 'Reconocimientos'
    }
  };

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Restaurant interior image */}
          <div className="fade-in">
            <div className="relative">
              <img
                src={restaurantInterior}
                alt="Elegant restaurant interior with warm ambient lighting"
                className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="fade-in">
            <div className="mb-6 text-center">
              <span className="text-accent font-medium tracking-wider uppercase text-sm">
                {sectionTitle}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
                <span>{aboutTitleFirstLine}</span>
                {aboutTitleSecondLine && (
                  <span className="block text-gradient font-normal">{aboutTitleSecondLine}</span>
                )}
              </h2>
              {sectionDescription && (
                <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                  {sectionDescription}
                </p>
              )}
            </div>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed text-center">
              <p>{aboutStory}</p>
              <p>{aboutChefInfo}</p>
              <p>{aboutMission}</p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.experience.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.experience.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.clients.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.clients.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.awards.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.awards.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;