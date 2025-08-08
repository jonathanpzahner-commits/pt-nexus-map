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
              From Recruitment Expert to Industry Unifier
            </Badge>
            <h1 className="text-5xl font-display font-bold text-foreground leading-tight">
              The Missing Network Discovery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              After 15 years in healthcare recruitment, I thought I knew the PT industry. 
              Six months into my own agency, I discovered something crucial: everyone knows our field is fragmented, 
              but there's no all-encompassing network that brings everyone together in one place.
            </p>
          </div>
        </section>

        {/* Jon's Journey Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-display font-bold text-foreground">Jon's Journey</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hi, I'm Jon Zahner. For 15 years, I built a successful career in healthcare recruitment, 
                eventually scaling therapy groups and working in corporate environments. I thought I knew the industry inside and out.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">The Eye-Opening Moment</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Six months ago, I took the entrepreneurial leap and started my own recruitment agency. 
                  That's when I discovered something that frustrated and inspired me in equal measure.
                </p>
                <p>
                  <strong className="text-foreground">Everyone knows our industry is fragmented.</strong> But what I discovered 
                  is that all the existing services are fragmented too. There's no single, all-encompassing network 
                  where everyone in the field can connect, discover, and collaborate.
                </p>
                <p>
                  This realization shifted everything. What started as a business opportunity became a passionate obsession: 
                  <em>How do we create the comprehensive network our industry deserves?</em>
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="space-y-4 p-0">
                <h3 className="text-xl font-semibold text-foreground">The Personal Touch</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    This mission is deeply personal. My wife is an OT professor who's dedicated her career 
                    to healthcare education. I've seen firsthand how passionate professionals struggle to 
                    connect with the right opportunities.
                  </p>
                  <p>
                    Henry Holland Health isn't just a company—it's our commitment to building the comprehensive 
                    network that our industry has been missing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-bold text-foreground">From Problem to Passion</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              PT Ecosystem isn't just another platform—it's my response to the missing network I discovered. 
              Here's how we're building the all-encompassing solution our industry needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">The Complete Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Every provider, school, and company in one comprehensive ecosystem. Finally, the all-encompassing 
                  network that brings together everyone in PT—no more scattered, incomplete solutions.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Connecting the Disconnected</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Location-based discovery helps you find who's actually in your area. Because the best opportunities 
                  might be right around the corner—you just didn't know they existed.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Industry Insider Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Built by someone who lived the recruitment side for 15 years. I know what questions you're asking 
                  because I've been asking them too.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Community Over Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  This isn't about replacing anyone—it's about lifting everyone up. When we all know who's out there, 
                  we can all make better connections and decisions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Obsession Section */}
        <section className="bg-card rounded-lg p-8 border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-foreground">Why This Obsession?</h2>
              <p className="text-muted-foreground leading-relaxed">
                I've spent 15 years watching talented people struggle to find the right opportunities, 
                and companies struggle to find the right people. Not because the connections don't exist—but because 
                all the existing tools are fragmented and incomplete.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                PT Ecosystem is my solution to the problem that frustrated me as a recruiter: 
                <strong className="text-foreground">How do you build a comprehensive network when all the tools are scattered?</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This platform represents the all-encompassing network I wish I'd had in my 15 years of recruitment. 
                It's built by an industry insider, for industry insiders who are tired of working with incomplete information.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">The Mission Continues</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Henry Holland Health represents our commitment to solving real problems with comprehensive solutions. 
                  This isn't about creating another fragmented tool—it's about building the network our industry deserves.
                </p>
                <p>
                  Every feature we build, every connection we facilitate, every moment when someone 
                  discovers exactly what they were looking for—that's what drives this mission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-3xl font-display font-bold text-foreground">Join the Network Revolution</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us build the comprehensive network our industry has been missing. Let's create the all-encompassing 
            solution that brings everyone in PT together in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-gradient-primary hover:shadow-lg transition-all"
            >
              Start Exploring
            </Button>
            <p className="text-sm text-muted-foreground">
              Discover the comprehensive network you've been looking for
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;