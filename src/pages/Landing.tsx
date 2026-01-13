import { ArrowRight, Shield, Users, TrendingUp, MapPin, AlertTriangle, Waves, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-coastal-monitoring.jpg";
import { Header } from "@/components/Header";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Citizen Reporting",
      description: "Report hazards instantly with GPS location, photos, and real-time data sharing to protect your community."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-seafoam" />,
      title: "Social Media Analytics", 
      description: "AI-powered analysis of social media posts to detect emerging hazard patterns and sentiment tracking."
    },
    {
      icon: <MapPin className="w-8 h-8 text-coral" />,
      title: "Interactive Hazard Maps",
      description: "Real-time visualization of danger zones, safe areas, and citizen reports with intelligent heat mapping."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Expert Analysis Dashboard",
      description: "Comprehensive analytics tools for officials to monitor, analyze, and respond to coastal hazards effectively."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Citizens" },
    { value: "500+", label: "Hazard Reports/Day" },
    { value: "24/7", label: "Real-time Monitoring" },
    { value: "95%", label: "Alert Accuracy" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Coastal monitoring and citizen reporting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        </div>
        
        <div className="relative container px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-6">
              <Waves className="w-8 h-8 text-seafoam animate-wave" />
              <span className="text-seafoam font-mono text-sm font-medium">INCOIS • Coastal Hazard Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Coastal Hazard
              <br />
              <span className="bg-gradient-to-r from-seafoam to-coral bg-clip-text text-transparent">
                Monitoring
              </span>
              <br />
              & Citizen Reporting
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Real-time citizen & social media powered ocean hazard alerts. 
              Protecting coastal communities through collaborative monitoring and intelligent analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="btn-coral text-lg px-8 py-4"
                onClick={() => navigate('/login?role=citizen')}
              >
                Report Hazard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate('/login?role=analyst')}
              >
                Analyst Dashboard
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-white/95 backdrop-blur border-t">
          <div className="container px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-coral" />
              <span className="text-coral font-mono text-sm font-medium">RISING THREAT</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Climate Change & Coastal Hazards
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The Indian National Centre for Ocean Information Services (INCOIS) recognizes the growing threat 
              of coastal hazards due to climate change. Rising sea levels, increasing storm intensity, and 
              unpredictable weather patterns require innovative, community-driven monitoring solutions.
            </p>
            
            <p className="text-lg text-primary font-medium">
              Our platform empowers citizens to become the first line of defense, combining human intelligence 
              with cutting-edge technology for comprehensive coastal hazard monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Innovative Monitoring Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining citizen science with advanced analytics for real-time coastal hazard detection and response.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-ocean group cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4 transition-transform group-hover:scale-110 duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-ocean text-white">
        <div className="container px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Coastal Protection Network
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Whether you're a concerned citizen or a coastal management professional, 
              your participation helps protect communities from coastal hazards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/login?role=citizen')}
              >
                <Users className="mr-2 w-5 h-5" />
                Join as Citizen
              </Button>
              
              <Button 
                size="lg"
                className="text-lg px-8 py-4 bg-coral hover:bg-coral/90"
                onClick={() => navigate('/login?role=analyst')}
              >
                <Shield className="mr-2 w-5 h-5" />
                Analyst Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Technology Stack</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Frontend: React.js / Next.js</div>
                <div>Backend: Node.js + Express</div>
                <div>Database: MongoDB</div>
                <div>Maps: Leaflet.js (Open Source)</div>
                <div>NLP: Hugging Face / Python Flask API</div>
                <div>Social Media: Twitter API / Mock Data</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">INCOIS</h3>
              <p className="text-sm text-muted-foreground">
                Indian National Centre for Ocean Information Services
                <br />
                Ministry of Earth Sciences, Government of India
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Demo Access</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Citizen: citizen_demo@demo.com | citizen123</div>
                <div>Analyst: analyst_demo@demo.com | analyst123</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 INCOIS - Coastal Hazard Monitoring Platform. Built for community protection.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;