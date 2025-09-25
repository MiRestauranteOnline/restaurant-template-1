import restaurantInterior from '@/assets/restaurant-interior.jpg';
import { useClient } from '@/contexts/ClientContext';

const About = () => {
  const { client, adminContent } = useClient();
  
  const sectionTitle = adminContent?.homepage_about_section_title || "Nuestra Historia";
  const sectionDescription = adminContent?.homepage_about_section_description;
  
  // Use admin content for about page content, with fallbacks
  const aboutPageContent = adminContent?.about_page_content || {};
  
  const aboutContent = {
    title: aboutPageContent.title || `Donde la Tradición\nSe Encuentra con la Innovación`,
    story: aboutPageContent.story || `Desde 2010, ${client?.restaurant_name || 'Savoria'} ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo. Nuestra pasión por ingredientes excepcionales y métodos de preparación innovadores crea una experiencia gastronómica inolvidable.`,
    chef_info: aboutPageContent.chef_info || 'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales y productores artesanales, asegurando que cada plato cuente una historia de calidad y artesanía.',
    mission: aboutPageContent.mission || `Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado. Bienvenido a ${client?.restaurant_name || 'Savoria'}, donde cada comida es una obra maestra.`
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
                {aboutContent.title.split('\n').map((line, index) => (
                  <span key={index} className={index > 0 ? 'block text-gradient font-normal' : ''}>
                    {line}
                  </span>
                ))}
              </h2>
              {sectionDescription && (
                <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                  {sectionDescription}
                </p>
              )}
            </div>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed text-center">
              <p>{aboutContent.story}</p>
              <p>{aboutContent.chef_info}</p>
              <p>{aboutContent.mission}</p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">15+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">5K+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">10+</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Reconocimientos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;