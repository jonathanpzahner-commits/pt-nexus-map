import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Users, Building2, GraduationCap, Briefcase, Map, MessageSquare, BarChart3, Target, TrendingUp, DollarSign, Shield, Zap, Award, Globe, Heart, Brain, Stethoscope, Database, Search, UserCheck, Network } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';
import crmMockup from '@/assets/crm-mockup.jpg';
import mapMockup from '@/assets/map-mockup.jpg';
import communityMockup from '@/assets/community-mockup.jpg';
import analyticsMockup from '@/assets/analytics-mockup.jpg';
import marketGrowth from '@/assets/market-growth.jpg';
import businessModel from '@/assets/business-model.jpg';

const ComprehensivePitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: "PT Ecosystem",
      subtitle: "Revolutionizing Healthcare Professional Networks",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PT Ecosystem
            </div>
            <div className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              The Complete Platform for Physical Therapy Professionals, Companies, and Educational Institutions
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium">50K+ Providers</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium">10K+ Companies</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium">500+ Schools</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium">5K+ Jobs</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: Problem Statement
    {
      id: 2,
      title: "The Healthcare Networking Crisis",
      subtitle: "Fragmented Systems, Missed Opportunities",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-destructive">The Challenge</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Isolated Networks</p>
                    <p className="text-sm text-muted-foreground">Healthcare professionals work in silos with limited cross-networking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Inefficient Resource Discovery</p>
                    <p className="text-sm text-muted-foreground">Finding qualified professionals, companies, and educational resources is time-consuming</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Limited Market Intelligence</p>
                    <p className="text-sm text-muted-foreground">Lack of comprehensive data about market trends and opportunities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-6 border-destructive/20">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-destructive">$127B</div>
                  <p className="text-sm text-muted-foreground">Lost productivity due to inefficient healthcare networking</p>
                </div>
              </Card>
              <Card className="p-6 border-destructive/20">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-destructive">73%</div>
                  <p className="text-sm text-muted-foreground">Of healthcare professionals struggle to find relevant connections</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Our Solution
    {
      id: 3,
      title: "Introducing PT Ecosystem",
      subtitle: "The Unified Platform for Healthcare Excellence",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-primary">One Platform, Infinite Possibilities</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              PT Ecosystem connects healthcare professionals, companies, educational institutions, 
              and job opportunities in a comprehensive, intelligent platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Unified Network</h4>
              <p className="text-sm text-muted-foreground">
                Connect with professionals, companies, schools, and opportunities all in one place
              </p>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Intelligent Search</h4>
              <p className="text-sm text-muted-foreground">
                Advanced filtering and location-based discovery powered by AI
              </p>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Market Intelligence</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive analytics and insights to drive strategic decisions
              </p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 4: Platform Overview
    {
      id: 4,
      title: "Platform Overview",
      subtitle: "Your Complete Healthcare Ecosystem",
      content: (
        <div className="space-y-6">
          <img src={dashboardMockup} alt="Platform Dashboard" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Provider Directory</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Company Profiles</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Location Intelligence</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Advanced Search</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Business Model
    {
      id: 5,
      title: "Revenue Model",
      subtitle: "Multiple Revenue Streams, Sustainable Growth",
      content: (
        <div className="space-y-8">
          <img src={businessModel} alt="Business Model" className="w-full rounded-lg shadow-xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Primary Revenue Streams</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">SaaS Subscriptions</p>
                    <p className="text-sm text-muted-foreground">Tiered pricing for different user types</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Premium Features</p>
                    <p className="text-sm text-muted-foreground">Advanced analytics and integrations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Enterprise Licensing</p>
                    <p className="text-sm text-muted-foreground">Custom solutions for large organizations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Financial Projections</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">$2.5M</div>
                  <div className="text-sm text-muted-foreground">Year 1 Revenue</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">$15M</div>
                  <div className="text-sm text-muted-foreground">Year 3 Revenue</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-sm text-muted-foreground">Gross Margin</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">120%</div>
                  <div className="text-sm text-muted-foreground">Net Revenue Retention</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PT Ecosystem Pitch Deck</h1>
              <p className="text-sm text-muted-foreground">Comprehensive Product Overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <Card className="min-h-[600px] p-8 mb-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">{currentSlideData.title}</h1>
              <p className="text-xl text-muted-foreground">{currentSlideData.subtitle}</p>
            </div>
            <div className="mt-8">
              {currentSlideData.content}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevSlide}
            variant="outline"
            disabled={currentSlide === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {/* Slide Indicators */}
          <div className="flex space-x-2 overflow-x-auto max-w-md">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted hover:bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            disabled={currentSlide === slides.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg">
          <h3 className="font-bold mb-3">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`p-2 rounded text-left transition-colors ${
                  index === currentSlide
                    ? 'bg-primary text-white'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                <div className="font-medium">{index + 1}. {slide.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensivePitchDeck;