import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Users, Building2, GraduationCap, Briefcase, Map, MessageSquare, BarChart3, Target, TrendingUp, DollarSign, Shield, Zap, Award, Globe, Heart, Brain, Stethoscope, Database, Search, UserCheck, Network } from 'lucide-react';
import marketGrowthChart from '@/assets/pt-market-growth-chart.jpg';
import ecosystemDashboard from '@/assets/pt-ecosystem-dashboard.jpg';
import workforceShortage from '@/assets/pt-workforce-shortage.jpg';
import ptClinicProfessional from '@/assets/pt-clinic-professional.jpg';
import businessTeamMeeting from '@/assets/business-team-meeting.jpg';

const ComprehensivePitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // SEO: dynamic title, description, canonical
  useEffect(() => {
    const title = "PT Ecosystem Pitch Deck | 25-slide investor presentation";
    document.title = title;

    const metaDescContent = "PT Ecosystem: 25-slide deck covering problem, solution, market, traction, financials, roadmap. 289K+ PTs/PTAs, 26K+ companies.";
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = metaDescContent;

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = window.location.origin + '/pitch-deck';
  }, []);

  const slides = [
    // Slide 1: Title
    {
      title: "PT Ecosystem",
      content: (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Stethoscope className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold text-primary mb-4">PT Ecosystem</h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Comprehensive Physical Therapy Intelligence Platform
            </p>
            <div className="text-lg text-muted-foreground space-y-2">
              <p>Connecting the entire PT industry</p>
              <p>289,000+ Physical Therapists & PTAs</p>
              <p>26,000+ Healthcare Companies</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: Problem Statement
    {
      title: "The Problem",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Fragmented PT Industry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border-red-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Information Silos</h3>
              </div>
              <p>PT professionals struggle to find comprehensive industry data, connect with peers, and access market intelligence</p>
            </Card>
            <Card className="p-6 border-red-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Workforce Shortage</h3>
              </div>
              <p>APTA projects PT shortages through 2037, making talent acquisition and retention critical</p>
            </Card>
            <Card className="p-6 border-red-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Network className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Limited Networking</h3>
              </div>
              <p>Lack of centralized platform for professional connections and industry collaboration</p>
            </Card>
            <Card className="p-6 border-red-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Market Intelligence Gap</h3>
              </div>
              <p>Companies lack comprehensive data on competitors, market trends, and business opportunities</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 3: Solution Overview
    {
      title: "Our Solution",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Comprehensive PT Intelligence Platform</h2>
          <div className="text-center mb-8">
            <img src={ecosystemDashboard} alt="PT Ecosystem Dashboard" className="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Comprehensive Database</h3>
              </div>
              <p>289,000+ PTs/PTAs and 26,000+ companies with detailed profiles and contact information</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Professional Network</h3>
              </div>
              <p>Connect with peers, find mentors, and build professional relationships across the industry</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Market Intelligence</h3>
              </div>
              <p>Real-time industry insights, trends analysis, and competitive intelligence</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 4: Market Size & Opportunity
    {
      title: "Market Opportunity",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">$87.83B Market by 2031</h2>
          <div className="text-center mb-8">
            <img src={marketGrowthChart} alt="PT Market Growth Chart" className="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">$87.83B</div>
              <p className="text-sm text-muted-foreground">US PT Market Size by 2031</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">Growing</div>
              <p className="text-sm text-muted-foreground">Steady market expansion driven by aging population</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">Shortage</div>
              <p className="text-sm text-muted-foreground">APTA projects PT workforce shortages through 2037</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 5: Target Market
    {
      title: "Target Market",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold">PT Professionals</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Physical Therapists seeking career opportunities</li>
                <li>• PTAs looking for networking and education</li>
                <li>• Students and new graduates entering the field</li>
                <li>• Experienced PTs seeking mentorship opportunities</li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold">Healthcare Organizations</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• PT clinics and private practices</li>
                <li>• Hospital systems and rehabilitation centers</li>
                <li>• Healthcare staffing agencies</li>
                <li>• Equipment manufacturers and suppliers</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 6: Product Features
    {
      title: "Key Features",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Platform Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Search className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Advanced Search</h3>
              </div>
              <p className="text-sm">Filter by location, specialty, experience, and more</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Map className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Geographic Mapping</h3>
              </div>
              <p className="text-sm">Interactive maps showing PT density and opportunities</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Professional Network</h3>
              </div>
              <p className="text-sm">Connect, message, and collaborate with peers</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Market Analytics</h3>
              </div>
              <p className="text-sm">Industry trends and competitive intelligence</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Briefcase className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Job Board</h3>
              </div>
              <p className="text-sm">PT-specific job listings and career opportunities</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Education Hub</h3>
              </div>
              <p className="text-sm">CEU tracking and professional development resources</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 7: Competitive Advantage
    {
      title: "Competitive Advantage",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Why We Win</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Comprehensive Data</h3>
              </div>
              <p>Largest database of PT professionals and companies with verified, up-to-date information</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Industry Focus</h3>
              </div>
              <p>Built specifically for PT professionals, not a generic healthcare platform</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Network Effects</h3>
              </div>
              <p>Value increases as more professionals and companies join the platform</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Technology Edge</h3>
              </div>
              <p>Advanced search, mapping, and analytics powered by modern technology stack</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 8: Business Model
    {
      title: "Business Model",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Revenue Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Subscription Tiers</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Basic: Free access with limited features</li>
                <li>• Professional: Enhanced networking and search</li>
                <li>• Enterprise: Full platform access and analytics</li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Premium Services</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Contact information unlock credits</li>
                <li>• Job posting and featured listings</li>
                <li>• Custom market research reports</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 9: Current Traction
    {
      title: "Traction",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Platform Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">289,000+</div>
              <p className="text-muted-foreground">Physical Therapists & PTAs</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">26,000+</div>
              <p className="text-muted-foreground">Healthcare Companies</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">Active</div>
              <p className="text-muted-foreground">Growing user base</p>
            </Card>
          </div>
          <div className="text-center">
            <img src={ptClinicProfessional} alt="PT Professional Environment" className="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
          </div>
        </div>
      )
    },

    // Slide 10: Go-to-Market Strategy
    {
      title: "Go-to-Market Strategy",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Customer Acquisition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Professional Outreach</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• APTA conference presence and partnerships</li>
                <li>• PT school partnerships and student programs</li>
                <li>• Professional association collaborations</li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Enterprise Sales</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Direct sales to healthcare organizations</li>
                <li>• Staffing agency partnerships</li>
                <li>• Equipment manufacturer integrations</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 11: Financial Model
    {
      title: "Financial Model",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Revenue Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Revenue Streams</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Subscription Revenue</span>
                  <span className="font-medium">Primary</span>
                </li>
                <li className="flex justify-between">
                  <span>Contact Access Credits</span>
                  <span className="font-medium">Secondary</span>
                </li>
                <li className="flex justify-between">
                  <span>Job Postings</span>
                  <span className="font-medium">Growth</span>
                </li>
                <li className="flex justify-between">
                  <span>Enterprise Services</span>
                  <span className="font-medium">Future</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Market Opportunity</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Total Market Size</span>
                  <span className="font-medium">$87.83B by 2031</span>
                </li>
                <li className="flex justify-between">
                  <span>Workforce Trend</span>
                  <span className="font-medium">Shortage through 2037</span>
                </li>
                <li className="flex justify-between">
                  <span>M&A Activity</span>
                  <span className="font-medium">Active PE Investment</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 12: Investment Opportunity
    {
      title: "Investment Opportunity",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Why Invest Now</h2>
          <div className="text-center mb-8">
            <img src={workforceShortage} alt="PT Workforce Trends" className="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Growing Market</h3>
              <p className="text-sm text-muted-foreground">$87.83B market size by 2031</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Workforce Crisis</h3>
              <p className="text-sm text-muted-foreground">PT shortages create urgent need</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">PE Interest</h3>
              <p className="text-sm text-muted-foreground">Active M&A in PT sector</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 13: Team
    {
      title: "Our Team",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="text-center mb-8">
            <img src={businessTeamMeeting} alt="Professional Team" className="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Healthcare Expertise</h3>
              <p className="text-sm text-muted-foreground">Deep industry knowledge and relationships</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Technology Leadership</h3>
              <p className="text-sm text-muted-foreground">Proven track record in platform development</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Business Development</h3>
              <p className="text-sm text-muted-foreground">Strategic partnerships and growth expertise</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 14: Technology Platform
    {
      title: "Technology Platform",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Built for Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Modern Architecture</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Cloud-native infrastructure</li>
                <li>• Scalable database design</li>
                <li>• Real-time data processing</li>
                <li>• Mobile-responsive platform</li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Security & Privacy</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• HIPAA-compliant infrastructure</li>
                <li>• End-to-end encryption</li>
                <li>• Privacy-first design</li>
                <li>• SOC 2 Type II ready</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 15: User Experience
    {
      title: "User Experience",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Intuitive Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Smart Search</h3>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered search with natural language processing</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Map className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Interactive Maps</h3>
              </div>
              <p className="text-sm text-muted-foreground">Visual exploration of PT opportunities by location</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Social Features</h3>
              </div>
              <p className="text-sm text-muted-foreground">Professional networking and collaboration tools</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 16: Strategic Partnerships
    {
      title: "Strategic Partnerships",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Industry Collaboration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Educational Institutions</h3>
              </div>
              <p className="text-muted-foreground">Partnerships with PT schools for student access and career placement</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Professional Organizations</h3>
              </div>
              <p className="text-muted-foreground">Collaboration with APTA and state associations for industry alignment</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 17: Product Roadmap
    {
      title: "Product Roadmap",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Development Timeline</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">Q1</span>
                </div>
                <h3 className="text-xl font-semibold">Current Phase</h3>
              </div>
              <p className="text-muted-foreground">Core platform features, user onboarding, basic search and networking</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">Q2</span>
                </div>
                <h3 className="text-xl font-semibold">Enhanced Features</h3>
              </div>
              <p className="text-muted-foreground">Advanced analytics, mobile app, premium subscription tiers</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-purple-600">Q3</span>
                </div>
                <h3 className="text-xl font-semibold">Enterprise Solutions</h3>
              </div>
              <p className="text-muted-foreground">Custom dashboards, API access, white-label solutions</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 18: Market Validation
    {
      title: "Market Validation",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Industry Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">User Research</h3>
              </div>
              <p className="text-muted-foreground">Extensive interviews with PT professionals and healthcare organizations to validate platform needs</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Market Trends</h3>
              </div>
              <p className="text-muted-foreground">Growing demand for PT services drives need for better industry connections and intelligence</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 19: Risk Management
    {
      title: "Risk Management",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Addressing Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border-orange-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold">Data Privacy</h3>
              </div>
              <p className="text-muted-foreground">HIPAA compliance and robust privacy controls to protect sensitive healthcare information</p>
            </Card>
            <Card className="p-6 border-blue-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Network className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Network Effects</h3>
              </div>
              <p className="text-muted-foreground">Strong first-mover advantage and comprehensive data create barriers to entry</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 20: Competition Analysis
    {
      title: "Competition Analysis",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Market Position</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Generic Platforms</h3>
              </div>
              <p className="text-muted-foreground">LinkedIn, Indeed lack PT-specific features and comprehensive industry data</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Our Advantage</h3>
              </div>
              <p className="text-muted-foreground">PT-specific focus, comprehensive database, and integrated professional networking</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 21: Success Metrics
    {
      title: "Key Performance Indicators",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Measuring Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">User Growth</div>
              <p className="text-sm text-muted-foreground">Monthly active users and retention rates</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">Engagement</div>
              <p className="text-sm text-muted-foreground">Search queries, connections made, content views</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">Revenue</div>
              <p className="text-sm text-muted-foreground">Subscription growth and premium feature adoption</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 22: Exit Strategy
    {
      title: "Exit Opportunities",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Strategic Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Strategic Acquisition</h3>
              </div>
              <p className="text-muted-foreground">Healthcare technology companies, staffing agencies, or equipment manufacturers seeking PT market access</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Private Equity</h3>
              </div>
              <p className="text-muted-foreground">Strong M&A activity in PT sector with active PE investment interest</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 23: Social Impact
    {
      title: "Making a Difference",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Industry Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Better Patient Care</h3>
              </div>
              <p className="text-muted-foreground">Connecting patients with the right PT professionals improves outcomes and quality of life</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Professional Growth</h3>
              </div>
              <p className="text-muted-foreground">Supporting PT career development and continuing education strengthens the profession</p>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 24: Call to Action
    {
      title: "Partnership Opportunity",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center mb-8">Join Our Journey</h2>
          <div className="text-center space-y-6">
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Partner with us to transform the physical therapy industry and address the growing workforce shortage while building a scalable, profitable business.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Growing Market</h3>
                <p className="text-sm text-muted-foreground">$87.83B opportunity</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Proven Traction</h3>
                <p className="text-sm text-muted-foreground">289K+ professionals</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Strategic Focus</h3>
                <p className="text-sm text-muted-foreground">PT-specific platform</p>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 25: Thank You
    {
      title: "Thank You",
      content: (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Stethoscope className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-primary mb-4">Thank You</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Questions & Discussion
            </p>
            <div className="text-lg text-muted-foreground space-y-2">
              <p>PT Ecosystem</p>
              <p>Transforming Physical Therapy</p>
              <p>One Connection at a Time</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">PT Ecosystem - Pitch Deck</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Slide {currentSlide + 1} of {slides.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="hidden md:flex"
              >
                <Play className="w-4 h-4 mr-2" />
                Present
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Slide Content */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-8 min-h-[600px]">
          {slides[currentSlide].content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted hover:bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            variant="outline"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Slide Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                index === currentSlide
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-medium mb-1">Slide {index + 1}</div>
              <div className="text-xs text-muted-foreground truncate">
                {slide.title}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ComprehensivePitchDeck;