import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Lightbulb, Shield, Globe, Heart } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Comprehensive Provider Network",
      description: "Connect with thousands of physical therapy providers, schools, and companies in one unified platform."
    },
    {
      icon: Target,
      title: "Advanced Search & Filtering",
      description: "Find exactly what you need with powerful search capabilities and location-based filtering."
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Get intelligent suggestions based on your preferences and search history."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with enterprise-grade security and reliability you can trust."
    }
  ];

  const stats = [
    { label: "Healthcare Providers", value: "10,000+", color: "bg-blue-500" },
    { label: "Educational Institutions", value: "500+", color: "bg-green-500" },
    { label: "Partner Companies", value: "1,000+", color: "bg-purple-500" },
    { label: "Job Opportunities", value: "5,000+", color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">PT</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">PT Ecosystem</h1>
              <p className="text-xs text-muted-foreground">A Henry Holland Health Company</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Connecting Healthcare Professionals Worldwide
            </Badge>
            <h1 className="text-5xl font-display font-bold text-foreground leading-tight">
              About PT Ecosystem
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how physical therapy professionals connect, learn, and grow. 
              Our platform brings together providers, educators, and companies in one comprehensive ecosystem.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-display font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To empower physical therapy professionals with the tools, connections, and opportunities 
                they need to advance their careers and improve patient outcomes worldwide.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">What We Believe</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Every healthcare professional deserves access to quality education and career opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Collaboration and knowledge sharing drive innovation in healthcare</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span>Technology should simplify, not complicate, professional development</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-2 p-0">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg mx-auto flex items-center justify-center mb-3`}>
                    <span className="text-white font-bold text-lg">{stat.value.charAt(0)}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-bold text-foreground">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful tools and features that make PT Ecosystem the premier platform 
              for physical therapy professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Info Section */}
        <section className="bg-card rounded-lg p-8 border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-foreground">Henry Holland Health</h2>
              <p className="text-muted-foreground leading-relaxed">
                PT Ecosystem is proudly developed by Henry Holland Health, a leading healthcare technology company 
                dedicated to improving healthcare delivery through innovative digital solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With years of experience in healthcare technology, we understand the unique challenges 
                facing physical therapy professionals and are committed to providing solutions that make a real difference.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: info@henryhollandhealth.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Healthcare Blvd, Medical City, HC 12345</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-3xl font-display font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of physical therapy professionals who trust PT Ecosystem for their career development.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="bg-gradient-primary hover:shadow-lg transition-all"
          >
            Explore the Platform
          </Button>
        </section>
      </main>
    </div>
  );
};

export default About;