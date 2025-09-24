import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import About from '@/components/About';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Award } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: Clock, number: "15+", label: "Años de Experiencia" },
    { icon: Users, number: "5000+", label: "Clientes Satisfechos" },
    { icon: Award, number: "10+", label: "Reconocimientos" }
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
      <section className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6">
              Sobre
              <span className="block text-gradient font-normal">Nosotros</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Conoce la historia detrás de Savoria y nuestro compromiso con la excelencia culinaria peruana.
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
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

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-light mb-6">
              Nuestro
              <span className="block text-gradient font-normal">Equipo</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Conoce a las personas apasionadas que hacen posible cada experiencia en Savoria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-background border-border card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-accent font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;