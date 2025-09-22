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

    // Slide 5: Provider Network
    {
      id: 5,
      title: "Provider Network",
      subtitle: "50,000+ Healthcare Professionals",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Comprehensive Provider Directory</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>Verified professional credentials</span>
              </div>
              <div className="flex items-center space-x-3">
                <Map className="w-5 h-5 text-primary" />
                <span>Geographic location mapping</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-primary" />
                <span>Specialization and certification tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <Network className="w-5 h-5 text-primary" />
                <span>Professional networking capabilities</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Providers</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Profile Completion</div>
              </Card>
            </div>
          </div>
          <div className="space-y-4">
            <img src={dashboardMockup} alt="Provider Directory" className="w-full rounded-lg shadow-lg" />
            <p className="text-sm text-muted-foreground text-center">
              Advanced search and filtering capabilities
            </p>
          </div>
        </div>
      )
    },

    // Slide 6: CRM & Business Tools
    {
      id: 6,
      title: "CRM & Business Intelligence",
      subtitle: "Enterprise-Grade Tools for Healthcare Organizations",
      content: (
        <div className="space-y-6">
          <img src={crmMockup} alt="CRM Dashboard" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Contact Management</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive contact database with relationship tracking
              </p>
            </Card>
            <Card className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Sales Pipeline</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Visual deal tracking and revenue forecasting
              </p>
            </Card>
            <Card className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Analytics</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced reporting and business intelligence
              </p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 7: Interactive Maps
    {
      id: 7,
      title: "Location Intelligence",
      subtitle: "Geographic Insights for Strategic Planning",
      content: (
        <div className="space-y-6">
          <img src={mapMockup} alt="Interactive Map" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Geographic Discovery</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Map className="w-4 h-4 text-primary" />
                  <span className="text-sm">Real-time provider mapping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">Radius-based search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">Market density analysis</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Strategic Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Competition mapping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">Growth opportunity identification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">Market penetration analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Community Platform
    {
      id: 8,
      title: "Professional Community",
      subtitle: "Fostering Collaboration and Knowledge Sharing",
      content: (
        <div className="space-y-6">
          <img src={communityMockup} alt="Community Platform" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-primary mx-auto" />
              <h4 className="font-bold text-sm">Discussions</h4>
              <p className="text-xs text-muted-foreground">Professional forums</p>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <h4 className="font-bold text-sm">Mentorship</h4>
              <p className="text-xs text-muted-foreground">Career guidance</p>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <Brain className="w-8 h-8 text-primary mx-auto" />
              <h4 className="font-bold text-sm">Research</h4>
              <p className="text-xs text-muted-foreground">Collaboration tools</p>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <Stethoscope className="w-8 h-8 text-primary mx-auto" />
              <h4 className="font-bold text-sm">Events</h4>
              <p className="text-xs text-muted-foreground">Industry gatherings</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 9: Analytics & Insights
    {
      id: 9,
      title: "Advanced Analytics",
      subtitle: "Data-Driven Decision Making",
      content: (
        <div className="space-y-6">
          <img src={analyticsMockup} alt="Analytics Dashboard" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold">Market Trends</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time industry insights and forecasting
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold">Performance Metrics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive KPI tracking and optimization
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold">Predictive Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered predictions and recommendations
              </p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 10: Market Opportunity
    {
      id: 10,
      title: "Market Opportunity",
      subtitle: "A $45 Billion Healthcare Technology Market",
      content: (
        <div className="space-y-8">
          <img src={marketGrowth} alt="Market Growth" className="w-full rounded-lg shadow-xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-4 border-primary/20">
              <div className="text-4xl font-bold text-primary">$45B</div>
              <h4 className="text-lg font-bold">Total Addressable Market</h4>
              <p className="text-sm text-muted-foreground">Healthcare IT market size</p>
            </Card>
            <Card className="p-6 text-center space-y-4 border-primary/20">
              <div className="text-4xl font-bold text-primary">23%</div>
              <h4 className="text-lg font-bold">Annual Growth Rate</h4>
              <p className="text-sm text-muted-foreground">Healthcare technology CAGR</p>
            </Card>
            <Card className="p-6 text-center space-y-4 border-primary/20">
              <div className="text-4xl font-bold text-primary">$8.2B</div>
              <h4 className="text-lg font-bold">Serviceable Market</h4>
              <p className="text-sm text-muted-foreground">Addressable opportunity</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 11: Business Model
    {
      id: 11,
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
    },

    // Slide 12: Competitive Advantage
    {
      id: 12,
      title: "Competitive Advantage",
      subtitle: "What Sets Us Apart",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Our Unique Position</h3>
            <div className="space-y-4">
              <Card className="p-4 border-primary/20">
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">First-Mover Advantage</h4>
                    <p className="text-sm text-muted-foreground">First comprehensive PT ecosystem platform</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-start space-x-3">
                  <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Comprehensive Data</h4>
                    <p className="text-sm text-muted-foreground">Largest verified healthcare professional database</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">AI-Powered Intelligence</h4>
                    <p className="text-sm text-muted-foreground">Advanced algorithms for matching and insights</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Market Position</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                <span className="font-semibold">PT Ecosystem</span>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="font-semibold">Competitor A</span>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-muted rounded-full"></div>
                  <div className="w-4 h-4 bg-muted rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/50 rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="font-semibold">Competitor B</span>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-muted rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/50 rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-full"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 13: Technology Stack
    {
      id: 13,
      title: "Technology Excellence",
      subtitle: "Built for Scale and Performance",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Frontend</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• React & TypeScript</p>
                <p>• Tailwind CSS</p>
                <p>• Progressive Web App</p>
                <p>• Real-time Updates</p>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Backend</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Supabase</p>
                <p>• PostgreSQL</p>
                <p>• Edge Functions</p>
                <p>• Row Level Security</p>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">AI & Analytics</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Machine Learning APIs</p>
                <p>• Geospatial Analysis</p>
                <p>• Predictive Analytics</p>
                <p>• Natural Language Processing</p>
              </div>
            </Card>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">&lt;200ms</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground">API Calls/Month</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">256-bit</div>
                <div className="text-sm text-muted-foreground">Encryption</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 14: Security & Compliance
    {
      id: 14,
      title: "Security & Compliance",
      subtitle: "Healthcare-Grade Security Standards",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <span>Enterprise Security</span>
            </h3>
            <div className="space-y-4">
              <Card className="p-4 border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">HIPAA Compliant</h4>
                    <p className="text-sm text-muted-foreground">Full healthcare data protection</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">SOC 2 Type II</h4>
                    <p className="text-sm text-muted-foreground">Audited security controls</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">Data protection in transit and at rest</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Privacy Controls</h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-bold mb-2">Data Protection</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Role-based access control</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Audit logging</li>
                  <li>• Data anonymization</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-bold mb-2">Compliance Monitoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time security monitoring</li>
                  <li>• Automated compliance checks</li>
                  <li>• Incident response protocols</li>
                  <li>• Regular security assessments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 15: User Testimonials
    {
      id: 15,
      title: "Customer Success Stories",
      subtitle: "Transforming Healthcare Networks Worldwide",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Dr. Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">PT Clinic Owner</p>
                </div>
              </div>
              <p className="text-sm italic">
                "PT Ecosystem has revolutionized how we connect with other professionals and find qualified staff. Our network has grown 300% in just 6 months."
              </p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Mark Thompson</h4>
                  <p className="text-sm text-muted-foreground">Healthcare Recruiter</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The advanced search and analytics features have cut our candidate sourcing time by 75%. It's a game-changer for healthcare recruitment."
              </p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Prof. Lisa Chen</h4>
                  <p className="text-sm text-muted-foreground">University Department Head</p>
                </div>
              </div>
              <p className="text-sm italic">
                "Our students now have unprecedented access to industry connections and job opportunities. Graduate placement rates have improved significantly."
              </p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Customer Satisfaction</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">96%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">89%</div>
                <div className="text-sm text-muted-foreground">Net Promoter Score</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Retention Rate</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 16: Growth Metrics
    {
      id: 16,
      title: "Impressive Growth Trajectory",
      subtitle: "Scaling Rapidly Across All Metrics",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span>User Growth</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Users</span>
                  <span className="font-bold text-primary">150% YoY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly Signups</span>
                  <span className="font-bold text-primary">45% MoM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>User Engagement</span>
                  <span className="font-bold text-primary">85% DAU/MAU</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <span>Revenue Growth</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Annual Revenue</span>
                  <span className="font-bold text-primary">$2.1M ARR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Growth Rate</span>
                  <span className="font-bold text-primary">200% YoY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer LTV</span>
                  <span className="font-bold text-primary">$12,500</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Providers</div>
              <div className="text-xs text-green-600">↗ 150% growth</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">850+</div>
              <div className="text-sm text-muted-foreground">Paying Customers</div>
              <div className="text-xs text-green-600">↗ 220% growth</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">2.1M</div>
              <div className="text-sm text-muted-foreground">API Calls/Month</div>
              <div className="text-xs text-green-600">↗ 300% growth</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
              <div className="text-xs text-green-600">↗ 99.9% SLA</div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 17: Partnerships & Integrations
    {
      id: 17,
      title: "Strategic Partnerships",
      subtitle: "Building a Connected Healthcare Ecosystem",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Key Partnerships</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Educational Institutions</h4>
                      <p className="text-sm text-muted-foreground">50+ PT schools integrated</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Healthcare Networks</h4>
                      <p className="text-sm text-muted-foreground">Major health systems onboarded</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Professional Organizations</h4>
                      <p className="text-sm text-muted-foreground">APTA and state associations</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Technology Integrations</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">EMR Systems</h4>
                      <p className="text-sm text-muted-foreground">Epic, Cerner, Allscripts</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">API Ecosystem</h4>
                      <p className="text-sm text-muted-foreground">Salesforce, HubSpot, Slack</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Map className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Location Services</h4>
                      <p className="text-sm text-muted-foreground">Google Maps, Mapbox</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Partnership Impact</h3>
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Faster onboarding with integrations</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">60%</div>
                <div className="text-sm text-muted-foreground">Increase in user engagement</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Reduction in customer acquisition cost</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 18: Roadmap
    {
      id: 18,
      title: "Product Roadmap",
      subtitle: "Innovation Pipeline for the Next 18 Months",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">Q1</span>
                </div>
                <h3 className="text-lg font-bold">Immediate (0-6 months)</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm">AI-powered matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm">Mobile app launch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">International expansion</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">Q2</span>
                </div>
                <h3 className="text-lg font-bold">Medium (6-12 months)</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm">Telehealth integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm">Certification tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">Outcome tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="w-4 h-4 text-primary" />
                  <span className="text-sm">Referral networks</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">Q3</span>
                </div>
                <h3 className="text-lg font-bold">Future (12+ months)</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm">Predictive analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">IoT device integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <span className="text-sm">Clinical decision support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm">Patient engagement tools</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Development Investment</h3>
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">$2.5M</div>
                <div className="text-sm text-muted-foreground">R&D Investment</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Engineering Team</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">New Features/Quarter</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 19: Team
    {
      id: 19,
      title: "World-Class Team",
      subtitle: "Healthcare and Technology Experts",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Sarah Mitchell, CEO</h3>
                  <p className="text-sm text-muted-foreground">Former VP at Epic Systems</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• 15+ years in healthcare technology</p>
                <p>• Led $100M+ product initiatives</p>
                <p>• MBA from Harvard Business School</p>
                <p>• Licensed Physical Therapist</p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Dr. James Rodriguez, CTO</h3>
                  <p className="text-sm text-muted-foreground">Former Senior Architect at Google</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• PhD in Computer Science (MIT)</p>
                <p>• Built systems serving 1B+ users</p>
                <p>• Expert in AI and machine learning</p>
                <p>• 20+ patents in healthcare tech</p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Michael Chen, COO</h3>
                  <p className="text-sm text-muted-foreground">Former Director at McKinsey</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• 12+ years in healthcare consulting</p>
                <p>• Scaled multiple $50M+ companies</p>
                <p>• Expertise in operational excellence</p>
                <p>• MS in Healthcare Management</p>
              </div>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Advisory Board</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Dr. Lisa Thompson</p>
                    <p className="text-sm text-muted-foreground">Former CEO, American Physical Therapy Association</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Robert Kim</p>
                    <p className="text-sm text-muted-foreground">Former CTO, Cerner Corporation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Dr. Maria Gonzalez</p>
                    <p className="text-sm text-muted-foreground">Dean, University of Southern California PT Program</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Team Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <div className="text-sm text-muted-foreground">Healthcare Background</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Years Avg Experience</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Employee Satisfaction</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 20: Financial Projections
    {
      id: 20,
      title: "Financial Projections",
      subtitle: "Path to Profitability and Scale",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Revenue Growth</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Year 1 (2024)</span>
                    <span className="text-lg font-bold text-primary">$2.5M</span>
                  </div>
                  <div className="text-sm text-muted-foreground">850 customers, $245 ARPU</div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Year 2 (2025)</span>
                    <span className="text-lg font-bold text-primary">$8.2M</span>
                  </div>
                  <div className="text-sm text-muted-foreground">2,100 customers, $325 ARPU</div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Year 3 (2026)</span>
                    <span className="text-lg font-bold text-primary">$18.5M</span>
                  </div>
                  <div className="text-sm text-muted-foreground">4,200 customers, $375 ARPU</div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Key Metrics</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Gross Margin</span>
                    <span className="text-lg font-bold text-primary">85%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Industry-leading SaaS margins</div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">CAC Payback</span>
                    <span className="text-lg font-bold text-primary">8 months</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Customer acquisition efficiency</div>
                </Card>
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Net Revenue Retention</span>
                    <span className="text-lg font-bold text-primary">125%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Strong expansion revenue</div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Unit Economics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">$1,250</div>
                <div className="text-sm text-muted-foreground">Customer CAC</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">$12,500</div>
                <div className="text-sm text-muted-foreground">Customer LTV</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">10:1</div>
                <div className="text-sm text-muted-foreground">LTV:CAC Ratio</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">$325</div>
                <div className="text-sm text-muted-foreground">Monthly ARPU</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 21: Funding Requirements
    {
      id: 21,
      title: "Investment Opportunity",
      subtitle: "Series A Round - $15M to Scale Operations",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Use of Funds</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Team Expansion</span>
                    </div>
                    <span className="text-lg font-bold">40%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Engineering, sales, and customer success</p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Marketing & Sales</span>
                    </div>
                    <span className="text-lg font-bold">30%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Customer acquisition and brand building</p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Product Development</span>
                    </div>
                    <span className="text-lg font-bold">20%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">AI features and platform enhancements</p>
                </div>
                <Card className="p-4 border-primary/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Operations</span>
                    </div>
                    <span className="text-lg font-bold">10%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Infrastructure and compliance</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Investment Terms</h3>
              <div className="space-y-4">
                <Card className="p-6 space-y-4 border-primary/20">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">$15M</div>
                    <p className="text-lg font-semibold">Series A Round</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Pre-money Valuation:</span>
                      <span className="font-bold">$60M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Post-money Valuation:</span>
                      <span className="font-bold">$75M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity Offered:</span>
                      <span className="font-bold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use of Funds:</span>
                      <span className="font-bold">24 months runway</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <h3 className="text-lg font-bold">Target Milestones</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>$25M ARR by end of Year 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>5,000+ enterprise customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>International market expansion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Series B readiness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 22: Exit Strategy
    {
      id: 22,
      title: "Exit Strategy",
      subtitle: "Multiple Paths to Exceptional Returns",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Strategic Acquisition Targets</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Healthcare Technology Giants</h4>
                      <p className="text-sm text-muted-foreground">Epic, Cerner, Salesforce Health Cloud</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Network className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Professional Networks</h4>
                      <p className="text-sm text-muted-foreground">LinkedIn, Microsoft, Workday</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold">Healthcare Conglomerates</h4>
                      <p className="text-sm text-muted-foreground">UnitedHealth, Anthem, Aetna</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">IPO Pathway</h3>
              <div className="space-y-4">
                <Card className="p-6 space-y-4">
                  <h4 className="text-lg font-bold">Public Market Readiness</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Target Timeline:</span>
                      <span className="font-bold">5-7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Run Rate:</span>
                      <span className="font-bold">$100M+ ARR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate:</span>
                      <span className="font-bold">40%+ YoY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Cap Potential:</span>
                      <span className="font-bold">$2B+</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">Comparable Transactions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4">
                <h4 className="font-bold">Veracyte</h4>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">$1.9B</div>
                  <div className="text-sm text-muted-foreground">Healthcare diagnostics platform</div>
                  <div className="text-sm font-medium">15x Revenue Multiple</div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <h4 className="font-bold">Doximity</h4>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">$4.6B</div>
                  <div className="text-sm text-muted-foreground">Professional medical network</div>
                  <div className="text-sm font-medium">18x Revenue Multiple</div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <h4 className="font-bold">Amwell</h4>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">$2.1B</div>
                  <div className="text-sm text-muted-foreground">Telehealth platform</div>
                  <div className="text-sm font-medium">12x Revenue Multiple</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 23: Risk Assessment
    {
      id: 23,
      title: "Risk Management",
      subtitle: "Proactive Approach to Potential Challenges",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-destructive">Key Risks</h3>
              <div className="space-y-4">
                <Card className="p-4 border-destructive/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-destructive font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-destructive">Market Competition</h4>
                      <p className="text-sm text-muted-foreground">Large tech companies entering healthcare</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-destructive/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-destructive font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-destructive">Regulatory Changes</h4>
                      <p className="text-sm text-muted-foreground">Healthcare regulations and compliance</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-destructive/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-destructive font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-destructive">Talent Acquisition</h4>
                      <p className="text-sm text-muted-foreground">Competitive market for healthcare tech talent</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">Mitigation Strategies</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">First-Mover Advantage</h4>
                      <p className="text-sm text-muted-foreground">Strong network effects and data moats</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Compliance Excellence</h4>
                      <p className="text-sm text-muted-foreground">Proactive regulatory compliance and partnerships</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-primary/20">
                  <div className="flex items-start space-x-3">
                    <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold">Culture & Compensation</h4>
                      <p className="text-sm text-muted-foreground">Competitive packages and mission-driven culture</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Risk Assessment Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">Medium</div>
                <div className="text-sm text-muted-foreground">Competition Risk</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">Low</div>
                <div className="text-sm text-muted-foreground">Regulatory Risk</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">Medium</div>
                <div className="text-sm text-muted-foreground">Talent Risk</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">Low</div>
                <div className="text-sm text-muted-foreground">Technology Risk</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 24: Call to Action
    {
      id: 24,
      title: "Join Our Mission",
      subtitle: "Transform Healthcare Professional Networking",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold text-primary">Ready to Revolutionize Healthcare?</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Partner with us to build the future of healthcare professional networking and unlock unprecedented opportunities in the $45B healthcare technology market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-bold">Massive Market</h4>
                <p className="text-sm text-muted-foreground">
                  $45B healthcare technology market with 23% annual growth
                </p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-bold">Proven Team</h4>
                <p className="text-sm text-muted-foreground">
                  Experienced healthcare and technology leaders with track record
                </p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-bold">Clear Path</h4>
                <p className="text-sm text-muted-foreground">
                  Defined roadmap to $100M ARR and potential IPO or acquisition
                </p>
              </div>
            </Card>
          </div>
          
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Button size="lg" className="text-lg px-8 py-6">
                <DollarSign className="w-5 h-5 mr-2" />
                Invest in PT Ecosystem
              </Button>
              <p className="text-sm text-muted-foreground">
                Series A: $15M at $60M pre-money valuation
              </p>
            </div>
            
            <div className="border-t pt-6">
              <p className="text-lg font-semibold mb-4">Contact Information</p>
              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div>
                  <p className="font-semibold">Sarah Mitchell, CEO</p>
                  <p className="text-sm text-muted-foreground">sarah@ptecosystem.com</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold">Michael Chen, COO</p>
                  <p className="text-sm text-muted-foreground">michael@ptecosystem.com</p>
                  <p className="text-sm text-muted-foreground">(555) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 25: Appendix
    {
      id: 25,
      title: "Appendix",
      subtitle: "Additional Information & Resources",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Market Research Sources</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Healthcare Information and Management Systems Society (HIMSS)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>American Physical Therapy Association (APTA) Market Analysis</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Grand View Research: Healthcare IT Market Report 2024</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>McKinsey Global Institute: Digital Healthcare Transformation</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold">Technology Partners</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-primary/5 rounded">
                  <p className="font-semibold">Cloud Infrastructure</p>
                  <p className="text-muted-foreground">AWS, Supabase</p>
                </div>
                <div className="p-3 bg-primary/5 rounded">
                  <p className="font-semibold">Analytics</p>
                  <p className="text-muted-foreground">Mixpanel, Segment</p>
                </div>
                <div className="p-3 bg-primary/5 rounded">
                  <p className="font-semibold">Security</p>
                  <p className="text-muted-foreground">Auth0, Vault</p>
                </div>
                <div className="p-3 bg-primary/5 rounded">
                  <p className="font-semibold">Maps & Location</p>
                  <p className="text-muted-foreground">Mapbox, Google Maps</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Legal & Compliance</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-bold mb-2">Intellectual Property</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 5 pending patent applications</li>
                    <li>• Trademark protections filed</li>
                    <li>• Proprietary algorithms and datasets</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h4 className="font-bold mb-2">Regulatory Compliance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• HIPAA Business Associate Agreements</li>
                    <li>• SOC 2 Type II audit completed</li>
                    <li>• GDPR compliance framework</li>
                  </ul>
                </Card>
              </div>
              
              <h3 className="text-xl font-bold">Additional Resources</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Product Demo: demo.ptecosystem.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Detailed Financial Model Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Security Documentation Package</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Customer References Upon Request</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t">
            <p className="text-lg font-bold text-primary mb-2">PT Ecosystem</p>
            <p className="text-sm text-muted-foreground">
              Confidential and Proprietary Information - Not for Distribution
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2024 PT Ecosystem Inc. All rights reserved.
            </p>
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
            {slides.slice(0, 10).map((slide, index) => (
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
          {slides.length > 10 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mt-2">
              {slides.slice(10, 20).map((slide, index) => {
                const slideIndex = index + 10;
                return (
                  <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`p-2 rounded text-left transition-colors ${
                      slideIndex === currentSlide
                        ? 'bg-primary text-white'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{slideIndex + 1}. {slide.title}</div>
                  </button>
                );
              })}
            </div>
          )}
          {slides.length > 20 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mt-2">
              {slides.slice(20).map((slide, index) => {
                const slideIndex = index + 20;
                return (
                  <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`p-2 rounded text-left transition-colors ${
                      slideIndex === currentSlide
                        ? 'bg-primary text-white'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{slideIndex + 1}. {slide.title}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensivePitchDeck;