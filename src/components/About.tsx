import restaurantInterior from '@/assets/restaurant-interior.jpg';

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content */}
          <div className="fade-in">
            <div className="mb-6">
              <span className="text-accent font-medium tracking-wider uppercase text-sm">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
                Where Tradition
                <span className="block text-gradient font-normal">Meets Innovation</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
              <p>
                Since 2010, Savoria has been a beacon of culinary excellence, 
                combining time-honored techniques with contemporary flair. Our 
                passion for exceptional ingredients and innovative preparation 
                methods creates an unforgettable dining experience.
              </p>
              
              <p>
                Led by Executive Chef Marcus Thompson, our team sources the 
                finest seasonal ingredients from local farms and artisanal 
                producers, ensuring every dish tells a story of quality 
                and craftsmanship.
              </p>
              
              <p>
                From intimate dinners to grand celebrations, we create moments 
                that linger in memory long after the last bite. Welcome to 
                Savoria, where every meal is a masterpiece.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-accent mb-2">13+</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-accent mb-2">50K+</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-accent mb-2">25+</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">Awards Won</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:order-first fade-in">
            <div className="relative">
              <img
                src={restaurantInterior}
                alt="Elegant restaurant interior with warm ambient lighting"
                className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;