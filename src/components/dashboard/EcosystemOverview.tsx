import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      color: 'from-blue-500 to-blue-600',
      features: ['Specializations', 'Certifications', 'Experience Levels', 'Settings'],
      navigate: 'providers'
    },
    {
      id: 'companies',
      title: 'PT Companies',
      count: stats?.companies || 0,
      description: 'Organizations driving the future of physical therapy',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      features: ['All Settings', 'Company Size', 'Technologies', 'Locations'],
      navigate: 'companies'
    },
    {
      id: 'schools',
      title: 'Education Programs',
      count: stats?.schools || 0,
      description: 'Institutions shaping the next generation of PTs',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      features: ['Programs', 'Application Dates', 'Requirements', 'Events'],
      navigate: 'schools'
    },
    {
      id: 'jobs',
      title: 'Career Opportunities',
      count: stats?.jobs || 0,
      description: 'Positions that match therapists with their ideal roles',
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600',
      features: ['All Settings', 'Salary Info', 'Benefits', 'Growth Paths'],
      navigate: 'jobs'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-ecosystem p-8 shadow-elegant">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Network className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PT Ecosystem</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Your comprehensive platform connecting physical therapists, companies, schools, and opportunities 
            in one unified ecosystem.
          </p>
          
          {!statsLoading && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-xl font-semibold text-foreground">
                  {stats?.total.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Total Records</span>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Live Data
              </Badge>
            </div>
          )}
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Ecosystem Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ecosystemSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id} 
              className="group hover:shadow-glow transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
              onClick={() => onNavigateToTab(section.navigate)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-primary">
                          {statsLoading ? (
                            <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                          ) : (
                            section.count.toLocaleString()
                          )}
                        </span>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {section.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {section.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to explore the ecosystem?
              </h3>
              <p className="text-muted-foreground">
                Start with our interactive map or dive into specific categories
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onNavigateToTab('search')}
                className="gap-2"
              >
                <Network className="h-4 w-4" />
                Search All
              </Button>
              <Button 
                onClick={() => onNavigateToTab('map')}
                className="gap-2 bg-gradient-primary hover:opacity-90"
              >
                <MapPin className="h-4 w-4" />
                View Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};