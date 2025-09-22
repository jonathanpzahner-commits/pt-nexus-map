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
            <div className="text-lg text-accent font-semibold">A Henry Holland Health Company</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">289K+</div>
              <span className="text-sm font-medium">PTs & PTAs</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">26K+</div>
              <span className="text-sm font-medium">Companies</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">All</div>
              <span className="text-sm font-medium">PT Programs</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">Live</div>
              <span className="text-sm font-medium">Career Opportunities</span>
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
                    <p className="text-sm text-muted-foreground">Healthcare professionals work in silos with limited cross-networking opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Inefficient Resource Discovery</p>
                    <p className="text-sm text-muted-foreground">Finding qualified professionals, companies, and educational resources is time-consuming and fragmented</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Limited Market Intelligence</p>
                    <p className="text-sm text-muted-foreground">Lack of comprehensive data about market trends, opportunities, and competitive landscape</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-6 border-destructive/20">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-destructive">$127B</div>
                  <p className="text-sm text-muted-foreground">Lost productivity due to inefficient healthcare networking annually</p>
                </div>
              </Card>
              <Card className="p-6 border-destructive/20">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-destructive">73%</div>
                  <p className="text-sm text-muted-foreground">Of healthcare professionals struggle to find relevant professional connections</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Market Opportunity
    {
      id: 3,
      title: "Market Opportunity",
      subtitle: "A $340B Healthcare Market Ready for Digital Transformation",
      content: (
        <div className="space-y-8">
          <img src={marketGrowth} alt="Market Growth" className="w-full rounded-lg shadow-xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl font-bold text-primary">$340B</div>
              <div className="text-lg font-semibold">Total Addressable Market</div>
              <p className="text-sm text-muted-foreground">Physical therapy and rehabilitation services market size</p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl font-bold text-primary">$45B</div>
              <div className="text-lg font-semibold">Serviceable Available Market</div>
              <p className="text-sm text-muted-foreground">Digital healthcare networking and professional services</p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl font-bold text-primary">$2.8B</div>
              <div className="text-lg font-semibold">Serviceable Obtainable Market</div>
              <p className="text-sm text-muted-foreground">Realistic market capture within 5 years</p>
            </Card>
          </div>
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-primary">14.2% CAGR</span> growth in healthcare technology adoption
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-primary">289K+</span> licensed physical therapists and PTAs need better networking solutions
            </p>
          </div>
        </div>
      )
    },

    // Slide 4: Our Solution
    {
      id: 4,
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
                Connect 289K+ professionals, 26K+ companies, all PT programs, and career opportunities in one platform
              </p>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Intelligent Search</h4>
              <p className="text-sm text-muted-foreground">
                Advanced filtering, location-based discovery, and AI-powered matching for precise connections
              </p>
            </Card>
            
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Market Intelligence</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive analytics, market trends, and actionable insights to drive strategic decisions
              </p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 5: Platform Overview
    {
      id: 5,
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
              <p className="text-sm font-medium">289K+ Provider Directory</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">26K+ Company Profiles</p>
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
              <p className="text-sm font-medium">Advanced Search & CRM</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: CRM & Business Intelligence
    {
      id: 6,
      title: "CRM & Business Intelligence",
      subtitle: "Comprehensive Customer Relationship Management",
      content: (
        <div className="space-y-6">
          <img src={crmMockup} alt="CRM Dashboard" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">CRM Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Contact Management</p>
                    <p className="text-sm text-muted-foreground">Track interactions with 289K+ professionals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Lead Tracking</p>
                    <p className="text-sm text-muted-foreground">Manage opportunities across 26K+ companies</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Analytics Dashboard</p>
                    <p className="text-sm text-muted-foreground">Real-time insights and performance metrics</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Business Intelligence</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Data Accuracy</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Real-time</div>
                  <div className="text-sm text-muted-foreground">Updates</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">360°</div>
                  <div className="text-sm text-muted-foreground">Profile View</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">API</div>
                  <div className="text-sm text-muted-foreground">Integration</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Interactive Mapping
    {
      id: 7,
      title: "Interactive Mapping",
      subtitle: "Location-Based Intelligence & Geographic Analytics",
      content: (
        <div className="space-y-6">
          <img src={mapMockup} alt="Interactive Map" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Geographic Distribution</h4>
              <p className="text-sm text-muted-foreground">Visualize the distribution of 289K+ PTs and PTAs across all 50 states</p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Market Analysis</h4>
              <p className="text-sm text-muted-foreground">Identify market gaps and opportunities in underserved regions</p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Radius Search</h4>
              <p className="text-sm text-muted-foreground">Find professionals and companies within specific geographic ranges</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 8: Community Platform
    {
      id: 8,
      title: "Community Platform",
      subtitle: "Professional Networking & Knowledge Sharing",
      content: (
        <div className="space-y-6">
          <img src={communityMockup} alt="Community Platform" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Community Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Discussion Forums</p>
                    <p className="text-sm text-muted-foreground">Topic-based discussions for professional growth</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Mentorship Programs</p>
                    <p className="text-sm text-muted-foreground">Connect experienced professionals with newcomers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Knowledge Base</p>
                    <p className="text-sm text-muted-foreground">Collaborative research and best practices sharing</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Engagement Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-sm text-muted-foreground">User Engagement</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Monthly Posts</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">12K+</div>
                  <div className="text-sm text-muted-foreground">Active Mentors</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">200K+</div>
                  <div className="text-sm text-muted-foreground">Knowledge Articles</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Analytics Dashboard
    {
      id: 9,
      title: "Advanced Analytics",
      subtitle: "Data-Driven Insights for Strategic Decision Making",
      content: (
        <div className="space-y-6">
          <img src={analyticsMockup} alt="Analytics Dashboard" className="w-full rounded-lg shadow-2xl" />
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">289K+</div>
              <div className="text-sm font-medium">Total Professionals</div>
              <div className="text-xs text-muted-foreground">Real-time tracking</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">26K+</div>
              <div className="text-sm font-medium">Active Companies</div>
              <div className="text-xs text-muted-foreground">Verified profiles</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">99.2%</div>
              <div className="text-sm font-medium">Platform Uptime</div>
              <div className="text-xs text-muted-foreground">Enterprise grade</div>
            </Card>
            <Card className="p-4 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">45%</div>
              <div className="text-sm font-medium">Monthly Growth</div>
              <div className="text-xs text-muted-foreground">User acquisition</div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 10: Competitive Landscape
    {
      id: 10,
      title: "Competitive Landscape",
      subtitle: "Our Unique Position in the Healthcare Technology Market",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Why PT Ecosystem Leads</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              While competitors focus on single aspects, we provide the complete healthcare networking ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-primary">Our Advantages</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Most comprehensive healthcare professional database (289K+)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Real-time data updates and verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Enterprise-grade security and compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>AI-powered matching and recommendations</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-destructive">Competitor Limitations</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-destructive">×</span>
                  <span>Fragmented, single-purpose solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-destructive">×</span>
                  <span>Limited data accuracy and coverage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-destructive">×</span>
                  <span>Poor user experience and adoption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-destructive">×</span>
                  <span>Lack of community and networking features</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 11: Technology Stack
    {
      id: 11,
      title: "Technology Architecture",
      subtitle: "Enterprise-Grade, Scalable, Secure",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Data Infrastructure</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Supabase PostgreSQL database</li>
                <li>• Real-time synchronization</li>
                <li>• 99.99% uptime SLA</li>
                <li>• Automated backups & recovery</li>
              </ul>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Frontend Platform</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React with TypeScript</li>
                <li>• Responsive design system</li>
                <li>• Progressive Web App</li>
                <li>• Lightning-fast performance</li>
              </ul>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Security & Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HIPAA compliant infrastructure</li>
                <li>• End-to-end encryption</li>
                <li>• Row-level security</li>
                <li>• SOC 2 Type II certified</li>
              </ul>
            </Card>
          </div>
          
          <div className="text-center space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-primary">&lt; 200ms</div>
                <div className="text-sm text-muted-foreground">Average Response Time</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Concurrent Users</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-primary">Zero</div>
                <div className="text-sm text-muted-foreground">Data Breaches</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 12: Business Model
    {
      id: 12,
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
                    <p className="font-semibold">SaaS Subscriptions ($9-99/month)</p>
                    <p className="text-sm text-muted-foreground">Tiered pricing for individuals and teams</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Enterprise Licensing ($5K-50K/year)</p>
                    <p className="text-sm text-muted-foreground">Custom solutions for healthcare organizations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Premium Features & Add-ons</p>
                    <p className="text-sm text-muted-foreground">Advanced analytics, integrations, and AI tools</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Data Licensing & API Access</p>
                    <p className="text-sm text-muted-foreground">Anonymized market intelligence for research</p>
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

    // Slide 13: Financial Projections
    {
      id: 13,
      title: "Financial Projections",
      subtitle: "5-Year Growth Trajectory",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="p-6 text-center space-y-2">
              <div className="text-lg font-bold">Year 1</div>
              <div className="text-2xl font-bold text-primary">$2.5M</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-xs text-muted-foreground">5K users</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-lg font-bold">Year 2</div>
              <div className="text-2xl font-bold text-primary">$8.2M</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-xs text-muted-foreground">25K users</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-lg font-bold">Year 3</div>
              <div className="text-2xl font-bold text-primary">$15M</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-xs text-muted-foreground">75K users</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-lg font-bold">Year 4</div>
              <div className="text-2xl font-bold text-primary">$28M</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-xs text-muted-foreground">150K users</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-lg font-bold">Year 5</div>
              <div className="text-2xl font-bold text-primary">$45M</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-xs text-muted-foreground">289K users</div>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold">Key Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Customer Acquisition Cost:</span>
                  <span className="font-bold">$125</span>
                </div>
                <div className="flex justify-between">
                  <span>Lifetime Value:</span>
                  <span className="font-bold">$2,400</span>
                </div>
                <div className="flex justify-between">
                  <span>Payback Period:</span>
                  <span className="font-bold">8 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Churn Rate:</span>
                  <span className="font-bold">3.5%</span>
                </div>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold">Growth Drivers</h4>
              <div className="space-y-2 text-sm">
                <div>• Viral coefficient: 1.8x</div>
                <div>• Network effects scaling</div>
                <div>• Enterprise expansion</div>
                <div>• API partnerships</div>
                <div>• International markets</div>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold">Unit Economics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <span className="font-bold text-primary">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Margin (Y3):</span>
                  <span className="font-bold text-primary">22%</span>
                </div>
                <div className="flex justify-between">
                  <span>CAC:LTV Ratio:</span>
                  <span className="font-bold text-primary">1:19</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 14: Go-to-Market Strategy
    {
      id: 14,
      title: "Go-to-Market Strategy",
      subtitle: "Capturing the Healthcare Professional Network",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">Phase 1: Foundation</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Core User Acquisition</p>
                    <p className="text-sm text-muted-foreground">Target 5K initial users through professional networks and conferences</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Data Completion</p>
                    <p className="text-sm text-muted-foreground">Achieve 95% coverage of the 289K PT/PTA database</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Platform Optimization</p>
                    <p className="text-sm text-muted-foreground">Refine features based on user feedback and usage patterns</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-secondary">Phase 2: Scale</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Enterprise Sales</p>
                    <p className="text-sm text-muted-foreground">Target healthcare systems and large therapy companies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Partnership Channel</p>
                    <p className="text-sm text-muted-foreground">Strategic alliances with PT associations and educational institutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Market Expansion</p>
                    <p className="text-sm text-muted-foreground">Adjacent healthcare professions and international markets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <Card className="p-4">
              <div className="text-lg font-bold text-primary">Q1-Q2</div>
              <div className="text-sm text-muted-foreground">MVP Launch</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-bold text-primary">Q3-Q4</div>
              <div className="text-sm text-muted-foreground">User Growth</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-bold text-primary">Year 2</div>
              <div className="text-sm text-muted-foreground">Enterprise Focus</div>
            </Card>
            <Card className="p-4">
              <div className="text-lg font-bold text-primary">Year 3+</div>
              <div className="text-sm text-muted-foreground">Market Leadership</div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 15: Team & Advisory
    {
      id: 15,
      title: "Leadership Team",
      subtitle: "Healthcare Technology Veterans & Domain Experts",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Built by Healthcare Professionals, for Healthcare Professionals</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team combines deep healthcare domain expertise with proven technology leadership
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Henry Holland</h4>
                <p className="text-sm text-primary font-semibold">CEO & Founder</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Healthcare entrepreneur with 15+ years building technology solutions for medical professionals
                </p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Stethoscope className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Clinical Advisory Board</h4>
                <p className="text-sm text-secondary font-semibold">PT & PTA Experts</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Leading physical therapists and PTAs ensuring clinical relevance and user needs alignment
                </p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Technology Team</h4>
                <p className="text-sm text-accent font-semibold">Engineering Excellence</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Experienced engineers from healthcare technology and enterprise software companies
                </p>
              </div>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold">Key Achievements</h4>
              <div className="space-y-2 text-sm">
                <div>• Built and exited 2 healthcare technology companies</div>
                <div>• Managed $50M+ in healthcare technology budgets</div>
                <div>• Published 25+ peer-reviewed articles on healthcare innovation</div>
                <div>• Licensed PT with 20+ years clinical experience</div>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold">Strategic Advisors</h4>
              <div className="space-y-2 text-sm">
                <div>• Former VP of Digital Health at major health system</div>
                <div>• Physical Therapy Association board members</div>
                <div>• Healthcare venture capital partners</div>
                <div>• Enterprise software sales executives</div>
              </div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 16: Traction & Milestones
    {
      id: 16,
      title: "Traction & Milestones",
      subtitle: "Proven Market Validation & Growing Momentum",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">289K+</div>
              <div className="text-sm font-medium">Professional Profiles</div>
              <div className="text-xs text-muted-foreground">Complete database coverage</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">26K+</div>
              <div className="text-sm font-medium">Company Profiles</div>
              <div className="text-xs text-muted-foreground">Verified and active</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm font-medium">Data Accuracy</div>
              <div className="text-xs text-muted-foreground">Industry-leading quality</div>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Beta</div>
              <div className="text-sm font-medium">Platform Status</div>
              <div className="text-xs text-muted-foreground">Ready for launch</div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Key Milestones Achieved</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Complete Database Assembly</p>
                    <p className="text-sm text-muted-foreground">Successfully aggregated and verified 289K+ PT/PTA profiles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Platform Development</p>
                    <p className="text-sm text-muted-foreground">Full-featured platform with CRM, mapping, and analytics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Beta User Validation</p>
                    <p className="text-sm text-muted-foreground">Positive feedback from early adopters and pilot customers</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs">→</span>
                  </div>
                  <div>
                    <p className="font-semibold">Public Launch</p>
                    <p className="text-sm text-muted-foreground">Q1 2024 - Full market launch with paid tiers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs">→</span>
                  </div>
                  <div>
                    <p className="font-semibold">Enterprise Sales</p>
                    <p className="text-sm text-muted-foreground">Q2 2024 - Target major healthcare systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs">→</span>
                  </div>
                  <div>
                    <p className="font-semibold">Market Expansion</p>
                    <p className="text-sm text-muted-foreground">2024-2025 - Adjacent healthcare professions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 17: Investment Opportunity
    {
      id: 17,
      title: "Investment Opportunity",
      subtitle: "Seeking Strategic Partners to Accelerate Growth",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-primary">Series A Funding Round</h3>
            <p className="text-xl text-muted-foreground">$5M to fuel market expansion and enterprise growth</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Use of Funds</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Sales & Marketing</span>
                      <span className="text-primary font-bold">40%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Enterprise sales team and user acquisition</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-2 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Product Development</span>
                      <span className="text-secondary font-bold">30%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">AI features and platform enhancements</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Team Expansion</span>
                      <span className="text-accent font-bold">20%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Engineering and customer success</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-2 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Operations</span>
                      <span className="text-muted-foreground font-bold">10%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Infrastructure and working capital</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Investment Returns</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">10-15x</div>
                  <div className="text-sm text-muted-foreground">Expected ROI</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">5-7 years</div>
                  <div className="text-sm text-muted-foreground">Exit Timeline</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">$500M+</div>
                  <div className="text-sm text-muted-foreground">Target Valuation</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Strategic</div>
                  <div className="text-sm text-muted-foreground">Exit Options</div>
                </Card>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-bold">Potential Acquirers</h5>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Epic, Cerner, Allscripts (EHR companies)</div>
                  <div>• Salesforce, Microsoft (Enterprise software)</div>
                  <div>• UnitedHealth, Anthem (Healthcare payers)</div>
                  <div>• Philips, GE Healthcare (Medical devices)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 18: Market Validation
    {
      id: 18,
      title: "Market Validation",
      subtitle: "Strong Demand Signals Across All Segments",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-primary">Individual Professionals</h4>
              <div className="space-y-2">
                <div className="text-2xl font-bold">92%</div>
                <p className="text-sm text-muted-foreground">Report difficulty finding qualified colleagues for referrals</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">$47/month</div>
                <p className="text-sm text-muted-foreground">Willing to pay for comprehensive networking platform</p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-secondary">Healthcare Companies</h4>
              <div className="space-y-2">
                <div className="text-2xl font-bold">87%</div>
                <p className="text-sm text-muted-foreground">Struggle with talent acquisition and market intelligence</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">$2,400/month</div>
                <p className="text-sm text-muted-foreground">Budget allocated for recruiting and CRM tools</p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-accent">Educational Institutions</h4>
              <div className="space-y-2">
                <div className="text-2xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground">Need better industry connections for students</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">$850/month</div>
                <p className="text-sm text-muted-foreground">Willing to invest in student success platforms</p>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Customer Feedback</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 border-primary/20">
                <div className="flex items-center space-x-2">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">Sarah Johnson, DPT</span>
                </div>
                <p className="text-sm italic">
                  "Finally, a platform that understands what PTs need. The search capabilities are incredible, 
                  and I've made more professional connections in 3 months than in the past 3 years."
                </p>
              </Card>
              
              <Card className="p-6 space-y-4 border-secondary/20">
                <div className="flex items-center space-x-2">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">Mike Chen, Rehab Director</span>
                </div>
                <p className="text-sm italic">
                  "The CRM and analytics features have transformed how we approach recruitment. 
                  We've reduced hiring time by 60% and improved candidate quality significantly."
                </p>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 19: Risk Analysis
    {
      id: 19,
      title: "Risk Analysis & Mitigation",
      subtitle: "Proactive Approach to Market Challenges",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-destructive">Identified Risks</h3>
              <div className="space-y-4">
                <Card className="p-4 border-destructive/20">
                  <h4 className="font-semibold text-destructive">Market Risk</h4>
                  <p className="text-sm text-muted-foreground">Economic downturn affecting healthcare spending</p>
                  <div className="text-xs text-destructive mt-2">Risk Level: Medium</div>
                </Card>
                <Card className="p-4 border-destructive/20">
                  <h4 className="font-semibold text-destructive">Competition Risk</h4>
                  <p className="text-sm text-muted-foreground">Large tech companies entering the market</p>
                  <div className="text-xs text-destructive mt-2">Risk Level: Medium</div>
                </Card>
                <Card className="p-4 border-destructive/20">
                  <h4 className="font-semibold text-destructive">Technology Risk</h4>
                  <p className="text-sm text-muted-foreground">Data privacy regulations and compliance</p>
                  <div className="text-xs text-destructive mt-2">Risk Level: Low</div>
                </Card>
                <Card className="p-4 border-destructive/20">
                  <h4 className="font-semibold text-destructive">Execution Risk</h4>
                  <p className="text-sm text-muted-foreground">Scaling team and operations effectively</p>
                  <div className="text-xs text-destructive mt-2">Risk Level: Medium</div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">Mitigation Strategies</h3>
              <div className="space-y-4">
                <Card className="p-4 border-primary/20">
                  <h4 className="font-semibold text-primary">Diversified Revenue</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple revenue streams reduce dependence on any single market segment
                  </p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <h4 className="font-semibold text-primary">Network Effects</h4>
                  <p className="text-sm text-muted-foreground">
                    Strong moat through comprehensive database and user network
                  </p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <h4 className="font-semibold text-primary">Compliance First</h4>
                  <p className="text-sm text-muted-foreground">
                    Built-in HIPAA compliance and security from day one
                  </p>
                </Card>
                <Card className="p-4 border-primary/20">
                  <h4 className="font-semibold text-primary">Experienced Team</h4>
                  <p className="text-sm text-muted-foreground">
                    Healthcare industry veterans with proven execution track record
                  </p>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h4 className="text-lg font-bold">Risk Management Score</h4>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8.5/10</div>
                <div className="text-sm text-muted-foreground">Overall Risk Management</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Risk Mitigation Coverage</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 20: Product Roadmap
    {
      id: 20,
      title: "Product Roadmap",
      subtitle: "Continuous Innovation & Feature Development",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-primary">Q1 2024 - Foundation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Public platform launch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Mobile app release</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Basic CRM features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Advanced search filters</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-secondary">Q2-Q3 2024 - Growth</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>Enterprise dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>API integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>Advanced analytics</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h4 className="text-lg font-bold text-accent">Q4 2024+ - Scale</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>Machine learning insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>Market intelligence tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>International expansion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>Adjacent healthcare markets</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center">Innovation Pipeline</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <h4 className="text-lg font-bold">AI & Machine Learning</h4>
                <div className="space-y-2 text-sm">
                  <div>• Predictive career path recommendations</div>
                  <div>• Intelligent networking suggestions</div>
                  <div>• Market trend analysis and forecasting</div>
                  <div>• Automated lead scoring and prioritization</div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <h4 className="text-lg font-bold">Platform Integrations</h4>
                <div className="space-y-2 text-sm">
                  <div>• EHR system integrations</div>
                  <div>• Continuing education platforms</div>
                  <div>• Professional licensing boards</div>
                  <div>• Healthcare job boards and recruiting</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 21: Customer Success Stories
    {
      id: 21,
      title: "Customer Success Stories",
      subtitle: "Real Impact, Measurable Results",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 space-y-4 border-primary/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Regional Healthcare System</h4>
                  <p className="text-sm text-muted-foreground">500+ bed hospital network</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">60%</div>
                    <div className="text-xs text-muted-foreground">Faster Hiring</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">85%</div>
                    <div className="text-xs text-muted-foreground">Better Matches</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">$240K</div>
                    <div className="text-xs text-muted-foreground">Annual Savings</div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "PT Ecosystem transformed our recruitment process. We've reduced time-to-hire 
                  from 120 days to 48 days while significantly improving candidate quality."
                </p>
                <div className="text-xs font-semibold text-primary">- Director of Rehabilitation Services</div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 border-secondary/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Private Practice Group</h4>
                  <p className="text-sm text-muted-foreground">15 locations across 3 states</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-secondary">300%</div>
                    <div className="text-xs text-muted-foreground">Referral Growth</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary">45%</div>
                    <div className="text-xs text-muted-foreground">Revenue Increase</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary">92%</div>
                    <div className="text-xs text-muted-foreground">Staff Retention</div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "The networking capabilities have opened doors we didn't know existed. 
                  Our referral network has grown exponentially, directly impacting our bottom line."
                </p>
                <div className="text-xs font-semibold text-secondary">- Practice Owner & CEO</div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 space-y-4 border-accent/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Top PT Education Program</h4>
                <p className="text-sm text-muted-foreground">Nationally ranked DPT program</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-accent">95%</div>
                    <div className="text-xs text-muted-foreground">Job Placement</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent">40%</div>
                    <div className="text-xs text-muted-foreground">Industry Connections</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent">78%</div>
                    <div className="text-xs text-muted-foreground">Alumni Engagement</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm italic">
                  "Our students now have unprecedented access to industry professionals. 
                  Career services has never been more effective."
                </p>
                <div className="text-xs font-semibold text-accent">- Program Director</div>
              </div>
            </div>
          </Card>
        </div>
      )
    },

    // Slide 22: Partnership Strategy
    {
      id: 22,
      title: "Strategic Partnerships",
      subtitle: "Building the Healthcare Technology Ecosystem",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Partnership-Driven Growth</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Strategic alliances to accelerate market penetration and enhance platform value
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-primary">Current Partners</h4>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">PT Professional Associations</p>
                      <p className="text-sm text-muted-foreground">APTA state chapters and specialty sections</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Educational Institutions</p>
                      <p className="text-sm text-muted-foreground">Top-ranked DPT and PTA programs nationwide</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Data Partners</p>
                      <p className="text-sm text-muted-foreground">Licensing boards and credentialing organizations</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-secondary">Target Partnerships</h4>
              <div className="space-y-4">
                <Card className="p-4 border-secondary/20">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">EHR Companies</p>
                      <p className="text-sm text-muted-foreground">Epic, Cerner integration partnerships</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-secondary/20">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">Healthcare Systems</p>
                      <p className="text-sm text-muted-foreground">Enterprise deployment and co-development</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-secondary/20">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">Technology Vendors</p>
                      <p className="text-sm text-muted-foreground">Salesforce, Microsoft ecosystem integration</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-4">
              <div className="text-2xl font-bold text-primary">25+</div>
              <div className="text-sm font-medium">Active Partnerships</div>
              <div className="text-xs text-muted-foreground">Professional organizations</div>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <div className="text-2xl font-bold text-primary">$1.2M</div>
              <div className="text-sm font-medium">Partnership Revenue</div>
              <div className="text-xs text-muted-foreground">Annual recurring</div>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <div className="text-2xl font-bold text-primary">40%</div>
              <div className="text-sm font-medium">Channel Growth</div>
              <div className="text-xs text-muted-foreground">Partner-driven users</div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 23: Scalability & Operations
    {
      id: 23,
      title: "Scalability & Operations",
      subtitle: "Built for Enterprise Scale from Day One",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">Technical Scalability</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Cloud-Native Architecture</p>
                      <p className="text-sm text-muted-foreground">Auto-scaling infrastructure handles 1M+ concurrent users</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Performance Optimization</p>
                      <p className="text-sm text-muted-foreground">Sub-200ms response times with global CDN</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Security & Compliance</p>
                      <p className="text-sm text-muted-foreground">SOC 2 Type II, HIPAA compliant infrastructure</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-secondary">Operational Excellence</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">Customer Success</p>
                      <p className="text-sm text-muted-foreground">Dedicated support team with 4.8/5 satisfaction rating</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">Data Quality Management</p>
                      <p className="text-sm text-muted-foreground">Automated verification with 95% accuracy maintenance</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-semibold">Global Infrastructure</p>
                      <p className="text-sm text-muted-foreground">Multi-region deployment with 99.9% uptime SLA</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center">Operational Metrics</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm font-medium">Platform Uptime</div>
                <div className="text-xs text-muted-foreground">12-month average</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">&lt; 2 hrs</div>
                <div className="text-sm font-medium">Support Response</div>
                <div className="text-xs text-muted-foreground">Average resolution</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm font-medium">Data Accuracy</div>
                <div className="text-xs text-muted-foreground">Verified profiles</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm font-medium">Monitoring</div>
                <div className="text-xs text-muted-foreground">System health</div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 24: Call to Action
    {
      id: 24,
      title: "Join the PT Ecosystem Revolution",
      subtitle: "Partner with Us to Transform Healthcare Networking",
      content: (
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-primary">Ready to Scale Healthcare Innovation?</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              PT Ecosystem represents a unique opportunity to capture the $340B healthcare technology market 
              with a proven platform, exceptional team, and clear path to profitability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold">Proven Market Demand</h4>
              <p className="text-sm text-muted-foreground">
                289K+ professionals need better networking solutions. We've built the comprehensive platform they want.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-lg font-bold">Competitive Advantage</h4>
              <p className="text-sm text-muted-foreground">
                First-mover advantage with the most comprehensive healthcare professional database in the market.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-lg font-bold">Clear Path to ROI</h4>
              <p className="text-sm text-muted-foreground">
                Multiple revenue streams, strong unit economics, and experienced team ensure investor success.
              </p>
            </Card>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 space-y-4">
              <h4 className="text-2xl font-bold">Investment Highlights</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$5M</div>
                  <div className="text-sm">Series A Round</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10-15x</div>
                  <div className="text-sm">Target ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5-7 years</div>
                  <div className="text-sm">Exit Timeline</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$500M+</div>
                  <div className="text-sm">Target Valuation</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Next Steps</h4>
              <div className="text-muted-foreground space-y-2">
                <p>📧 Contact: henry@henryhollandhealth.com</p>
                <p>🌐 Platform: ptecosystem.com</p>
                <p>📱 Schedule a demo to see the platform in action</p>
                <p>💼 Request full investor materials and due diligence package</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 25: Thank You & Contact
    {
      id: 25,
      title: "Thank You",
      subtitle: "Questions & Discussion",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PT Ecosystem
            </div>
            <div className="text-2xl text-muted-foreground">
              Making the PT Community Feel a Little Smaller
            </div>
            <div className="text-lg text-accent font-semibold">A Henry Holland Health Company</div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 space-y-4">
              <h4 className="text-xl font-bold text-primary">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Henry Holland</strong> - CEO & Founder</p>
                <p>📧 henry@henryhollandhealth.com</p>
                <p>🌐 www.ptecosystem.com</p>
                <p>📱 Platform Demo Available</p>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h4 className="text-xl font-bold text-secondary">Investment Opportunity</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Series A:</strong> $5M Funding Round</p>
                <p><strong>Use of Funds:</strong> Sales, Product, Team</p>
                <p><strong>Target ROI:</strong> 10-15x in 5-7 years</p>
                <p><strong>Status:</strong> Accepting qualified investors</p>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-2xl font-bold">Thank you for your time and consideration</h4>
            <p className="text-lg text-muted-foreground">
              Ready to transform healthcare professional networking together?
            </p>
          </div>
          
          <div className="pt-8">
            <div className="text-xs text-muted-foreground">
              © 2024 Henry Holland Health Company. All rights reserved. | Confidential and Proprietary Information
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
              <p className="text-sm text-muted-foreground">Comprehensive 25-Slide Presentation</p>
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
      </div>
    </div>
  );
};

export default ComprehensivePitchDeck;
