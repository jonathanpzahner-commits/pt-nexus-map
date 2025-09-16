import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  Network,
  MapPin
} from 'lucide-react';

interface EcosystemOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export const EcosystemOverview = ({ onNavigateToTab }: EcosystemOverviewProps) => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['ecosystem-stats'],
    queryFn: async () => {
      const [providers, companies, schools, jobs] = await Promise.all([
        supabase.from('providers').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('schools').select('*', { count: 'exact', head: true }),
        supabase.from('job_listings').select('*', { count: 'exact', head: true })
      ]);

      return {
        providers: providers.count || 0,
        companies: companies.count || 0,
        schools: schools.count || 0,
        jobs: jobs.count || 0,
        total: (providers.count || 0) + (companies.count || 0) + (schools.count || 0) + (jobs.count || 0)
      };
    },
  });

  const ecosystemSections = [
    {
      id: 'providers',
      title: 'Physical Therapists',
      count: stats?.providers || 0,
      description: 'Licensed practitioners ready to transform patient care',
      icon: Users,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      features: ['Specializations', 'Certifications', 'Experience Levels', 'Settings'],
      navigate: 'providers'
    },
    {
      id: 'companies',
      title: 'PT Companies',
      count: stats?.companies || 0,
      description: 'Organizations driving the future of physical therapy',
      icon: Building2,
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      features: ['All Settings', 'Company Size', 'Technologies', 'Locations'],
      navigate: 'companies'
    },
    {
      id: 'schools',
      title: 'Education Programs',
      count: stats?.schools || 0,
      description: 'Institutions shaping the next generation of PTs',
      icon: GraduationCap,
      gradient: 'from-purple-500 via-violet-600 to-indigo-600',
      features: ['Programs', 'Application Dates', 'Requirements', 'Events'],
      navigate: 'schools'
    },
    {
      id: 'jobs',
      title: 'Career Opportunities',
      count: stats?.jobs || 0,
      description: 'Positions that match therapists with their ideal roles',
      icon: Briefcase,
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      features: ['All Settings', 'Salary Info', 'Benefits', 'Growth Paths'],
      navigate: 'jobs'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage('overview')} position="top" />
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-12 shadow-elegant border border-border/50">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow animate-float">
              <Network className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                PT Ecosystem Platform
              </h1>
              <p className="text-lg text-muted-foreground">
                Revolutionizing Physical Therapy Industry Connections
              </p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            Your comprehensive platform connecting physical therapists, companies, educational institutions, 
            and career opportunities in one unified, intelligent ecosystem. Built for the future of healthcare.
          </p>
          
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
              🚀 Live Data
            </span>
            <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
              ✨ AI-Powered
            </span>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>

      {/* Ecosystem Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ecosystemSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card 
                className="group hover:shadow-glow transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden relative"
                onClick={() => onNavigateToTab(section.navigate)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${section.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-display font-bold group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-3xl font-display font-bold text-foreground">
                            {statsLoading ? (
                              <div className="h-8 w-20 bg-muted animate-pulse rounded-lg"></div>
                            ) : (
                              section.count.toLocaleString()
                            )}
                          </span>
                          <div className="flex items-center gap-1 text-accent">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {section.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20 shadow-soft animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Ready to explore the PT ecosystem?
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Start with our comprehensive search, dive into specific categories, or visualize connections 
                on our interactive map. The future of physical therapy networking starts here.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => onNavigateToTab('search')}
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow px-8 py-3 text-lg font-medium"
              >
                <Network className="h-5 w-5 mr-2" />
                Explore Ecosystem
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigateToTab('map')}
                className="border-primary/30 hover:bg-primary/10 px-8 py-3"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Interactive Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};