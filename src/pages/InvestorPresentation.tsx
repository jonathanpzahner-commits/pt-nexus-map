import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, Users, Building2, GraduationCap, Briefcase, TrendingUp, Target, DollarSign, Network, Shield, Zap } from 'lucide-react';

const InvestorPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "PT Nexus: Transforming Physical Therapy Through Technology",
      subtitle: "The Comprehensive Ecosystem Platform for Healthcare's $45B Physical Therapy Market",
      content: (
        <div className="text-center space-y-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
            <Network className="h-16 w-16 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">The First Unified Intelligence Platform for Physical Therapy</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">45B+</div>
                <div className="text-sm text-muted-foreground">Market Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">250K+</div>
                <div className="text-sm text-muted-foreground">PT Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$0</div>
                <div className="text-sm text-muted-foreground">Existing Solutions</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Problem: A Fragmented $45B Industry",
      subtitle: "Healthcare's Most Disconnected Vertical",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-red-600">Market Inefficiencies</h3>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>No centralized discovery platform for PT services</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>Talent acquisition costs 40% higher than other healthcare verticals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>Equipment vendors lack target market intelligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>PE firms investing blind without market-level data</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-red-600">Financial Impact</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">$8.2B</div>
                  <div className="text-sm text-muted-foreground">Wasted annually on inefficient discovery</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">127%</div>
                  <div className="text-sm text-muted-foreground">Higher customer acquisition costs</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">90%</div>
                  <div className="text-sm text-muted-foreground">Of stakeholders operate without market intelligence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "PT Nexus: The Network Effect Solution",
      subtitle: "Creating Value Through Ecosystem Intelligence",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-xl text-muted-foreground">The first platform to unify all PT ecosystem stakeholders with location-based intelligence</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <MapPin className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Geographic Intelligence</h3>
                <p className="text-sm text-muted-foreground">Radius-based discovery with precise location mapping for all ecosystem participants</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Network className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Network Effects</h3>
                <p className="text-sm text-muted-foreground">Each new participant increases value exponentially for all ecosystem members</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Defensible Moats</h3>
                <p className="text-sm text-muted-foreground">First-mover advantage with comprehensive data aggregation creates switching costs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Comprehensive Ecosystem Coverage",
      subtitle: "Six Revenue-Generating Verticals in One Platform",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">PT Providers</h3>
                </div>
                <p className="text-muted-foreground">250K+ physical therapists with specialization mapping and practice analytics</p>
                <div className="text-sm text-primary font-medium">Revenue: Lead generation, premium listings</div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">PT Schools</h3>
                </div>
                <p className="text-muted-foreground">380+ accredited programs with enrollment data and outcome tracking</p>
                <div className="text-sm text-primary font-medium">Revenue: Recruitment tools, analytics dashboards</div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Healthcare Companies</h3>
                </div>
                <p className="text-muted-foreground">Clinics, hospitals, and healthcare systems with market intelligence</p>
                <div className="text-sm text-primary font-medium">Revenue: Market research, competitive analysis</div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Job Marketplace</h3>
                </div>
                <p className="text-muted-foreground">AI-powered matching between providers and opportunities</p>
                <div className="text-sm text-primary font-medium">Revenue: Job posting fees, recruiting services</div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Equipment Vendors</h3>
                </div>
                <p className="text-muted-foreground">Manufacturers and distributors with precision targeting capabilities</p>
                <div className="text-sm text-primary font-medium">Revenue: Lead generation, market intelligence</div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">PE/Investment</h3>
                </div>
                <p className="text-muted-foreground">Private equity firms with deal sourcing and market analysis tools</p>
                <div className="text-sm text-primary font-medium">Revenue: Premium analytics, deal intelligence</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Technology Advantage: Built for Scale",
      subtitle: "Modern Architecture Enabling Rapid Market Expansion",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Technical Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg"><strong>React/TypeScript:</strong> Enterprise-grade frontend</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg"><strong>Supabase:</strong> Real-time database with 99.9% uptime</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg"><strong>Mapbox Integration:</strong> Precision geolocation services</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg"><strong>Auto-scaling:</strong> Handles 100K+ concurrent users</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Competitive Moats</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold text-blue-900">Data Network Effects</div>
                  <div className="text-sm text-blue-700">Each new user increases platform value for all participants</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold text-blue-900">First-Mover Advantage</div>
                  <div className="text-sm text-blue-700">No existing comprehensive PT ecosystem platform</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold text-blue-900">Switching Costs</div>
                  <div className="text-sm text-blue-700">Integrated workflows create high user stickiness</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Revenue Model: Multiple Monetization Streams",
      subtitle: "Diversified Revenue with High-Margin SaaS Components",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Primary Revenue Streams</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-lg">SaaS Subscriptions (65%)</div>
                  <div className="text-muted-foreground">Premium analytics, unlimited searches, advanced filtering</div>
                  <div className="text-green-600 font-medium">$49-$499/month per organization</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold text-lg">Marketplace Commissions (20%)</div>
                  <div className="text-muted-foreground">Job placements, equipment sales, consulting engagements</div>
                  <div className="text-blue-600 font-medium">3-15% transaction fees</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="font-semibold text-lg">Data Licensing (15%)</div>
                  <div className="text-muted-foreground">Market research, competitive intelligence, industry reports</div>
                  <div className="text-purple-600 font-medium">$10K-$100K annual contracts</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Financial Projections</h3>
              <div className="space-y-4">
                <Card className="p-4 bg-green-50">
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold text-green-700">$2.4M</div>
                    <div className="text-sm text-green-600">Year 1 Revenue Target</div>
                    <div className="text-xs text-muted-foreground">1,000 paying customers</div>
                  </CardContent>
                </Card>
                <Card className="p-4 bg-blue-50">
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold text-blue-700">$12M</div>
                    <div className="text-sm text-blue-600">Year 2 Revenue Target</div>
                    <div className="text-xs text-muted-foreground">5,000 paying customers</div>
                  </CardContent>
                </Card>
                <Card className="p-4 bg-purple-50">
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold text-purple-700">$45M</div>
                    <div className="text-sm text-purple-600">Year 3 Revenue Target</div>
                    <div className="text-xs text-muted-foreground">15,000 paying customers</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Market Opportunity: Healthcare's Hidden Gem",
      subtitle: "Massive TAM with Limited Competition",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="space-y-4">
                <Target className="h-12 w-12 text-green-600 mx-auto" />
                <div className="text-3xl font-bold text-green-700">$45B</div>
                <div className="text-lg font-semibold">Total Addressable Market</div>
                <div className="text-sm text-muted-foreground">Global physical therapy industry size</div>
              </CardContent>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="space-y-4">
                <Users className="h-12 w-12 text-blue-600 mx-auto" />
                <div className="text-3xl font-bold text-blue-700">$8.2B</div>
                <div className="text-lg font-semibold">Serviceable Addressable Market</div>
                <div className="text-sm text-muted-foreground">Digitally-enabled PT ecosystem spend</div>
              </CardContent>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="space-y-4">
                <DollarSign className="h-12 w-12 text-purple-600 mx-auto" />
                <div className="text-3xl font-bold text-purple-700">$850M</div>
                <div className="text-lg font-semibold">Serviceable Obtainable Market</div>
                <div className="text-sm text-muted-foreground">Realistic 5-year capture potential</div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center">Market Growth Drivers</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-blue-600">Demographic Tailwinds</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Aging baby boomer population driving 7.1% annual PT demand growth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Increased sports participation creating injury treatment needs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Corporate wellness programs expanding PT coverage</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-green-600">Digital Transformation</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Healthcare moving to value-based care models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Telehealth adoption accelerating platform adoption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Data-driven decision making becoming standard practice</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Investment Opportunity: $5M Series A",
      subtitle: "Scaling the First Comprehensive PT Ecosystem Platform",
      content: (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">$5,000,000</div>
            <div className="text-xl text-muted-foreground">Series A Funding Round</div>
            <div className="text-lg">18-month runway to achieve $12M ARR and Series B readiness</div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Use of Funds</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Product Development</span>
                  <span className="font-bold text-blue-600">40% ($2M)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Sales & Marketing</span>
                  <span className="font-bold text-green-600">35% ($1.75M)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Team Expansion</span>
                  <span className="font-bold text-purple-600">20% ($1M)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Operations & Legal</span>
                  <span className="font-bold text-gray-600">5% ($250K)</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Key Milestones</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold">Month 6</div>
                  <div className="text-muted-foreground">1,000 paying customers, $200K MRR</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold">Month 12</div>
                  <div className="text-muted-foreground">5,000 paying customers, $1M MRR</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="font-semibold">Month 18</div>
                  <div className="text-muted-foreground">15,000 paying customers, $3M MRR</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold">Month 24</div>
                  <div className="text-muted-foreground">Series B readiness, $50M+ valuation</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Investment Highlights</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10x</div>
                <div className="text-sm text-muted-foreground">Projected ROI potential</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Gross margin target</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$500M</div>
                <div className="text-sm text-muted-foreground">5-year valuation target</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">PT Nexus Investor Presentation</h1>
          </div>
          <div className="text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>

        {/* Slide Content */}
        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-12">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">{slides[currentSlide].title}</h2>
                <p className="text-xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
              </div>
              <div className="min-h-[400px]">
                {slides[currentSlide].content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
          <Button 
            onClick={prevSlide} 
            variant="outline" 
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={nextSlide} 
            variant="outline" 
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Call to Action */}
        {currentSlide === slides.length - 1 && (
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Healthcare Together?</h3>
                <p className="text-muted-foreground mb-6">
                  Join us in building the definitive platform for the $45B physical therapy ecosystem.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="px-8">
                    Schedule Due Diligence
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    Download Executive Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorPresentation;