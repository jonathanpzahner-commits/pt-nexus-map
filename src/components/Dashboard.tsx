import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, Building, Briefcase, GraduationCap } from 'lucide-react';
import ProvidersTab from './dashboard/ProvidersTab';
import CompaniesTab from './dashboard/CompaniesTab';
import SchoolsTab from './dashboard/SchoolsTab';
import JobListingsTab from './dashboard/JobListingsTab';

const Dashboard = () => {
  // Fetch summary statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
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
      };
    },
  });

  const summaryCards = [
    {
      title: "Physical Therapists",
      value: stats?.providers || 0,
      description: "Licensed practitioners",
      icon: Users,
    },
    {
      title: "Companies",
      value: stats?.companies || 0,
      description: "PT-related businesses",
      icon: Building,
    },
    {
      title: "Schools",
      value: stats?.schools || 0,
      description: "Education programs",
      icon: GraduationCap,
    },
    {
      title: "Job Listings",
      value: stats?.jobs || 0,
      description: "Open positions",
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">PTs</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="space-y-4">
          <ProvidersTab />
        </TabsContent>
        
        <TabsContent value="companies" className="space-y-4">
          <CompaniesTab />
        </TabsContent>
        
        <TabsContent value="schools" className="space-y-4">
          <SchoolsTab />
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <JobListingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;