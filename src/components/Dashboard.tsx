import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Users, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Map, 
  Search, 
  Upload,
  Home,
  MessageSquare,
  Headphones,
  Mic,
  DollarSign,
  Handshake,
  MapPin,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import ProvidersTab from './dashboard/ProvidersTab';
import { CompaniesTab } from './dashboard/CompaniesTab';
import { SchoolsTab } from './dashboard/SchoolsTab';
import { JobListingsTab } from './dashboard/JobListingsTab';
import { MapContainer } from './map/MapContainer';
import { GlobalSearch } from './search/GlobalSearch';
import { SimpleBulkUpload } from './upload/SimpleBulkUpload';
import { GeocodingManager } from './search/GeocodingManager';
import { FastGeocodingManager } from './dashboard/FastGeocodingManager';

import { EcosystemOverview } from './dashboard/EcosystemOverview';
import { CommunityHub } from './community/CommunityHub';
import { ContinuingEducationTab } from './dashboard/ContinuingEducationTab';
import { ActiveSurveysTab } from './dashboard/ActiveSurveysTab';
import { SearchOnlyTab } from './dashboard/SearchOnlyTab';
import { SurveyAnalyticsTab } from './dashboard/SurveyAnalyticsTab';
import { ConsultantsTab } from './dashboard/ConsultantsTab';
import { CRMDashboard } from './crm/CRMDashboard';
import { ApiManagementTab } from './dashboard/ApiManagementTab';
import { PodcastsTab } from './dashboard/PodcastsTab';

// import { PartnershipDashboard } from './partnerships/PartnershipDashboard';
import { migrateCompanyLocations } from '@/utils/migrateCompanyLocations';
import { toast } from 'sonner';

const Dashboard = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch summary statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
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

  const handleUploadComplete = () => {
    // Refetch stats when upload completes
    refetchStats();
  };

  const handleMigrateLocations = async () => {
    try {
      toast.info('Starting company location migration...');
      const result = await migrateCompanyLocations();
      toast.success(`Migration completed: ${result.migrated} companies updated`);
      refetchStats();
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Migration failed. Please try again.');
    }
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

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
    <div className="space-y-6">
      {/* Admin Controls */}
      <div className="flex justify-end gap-2">
        <Button onClick={handleMigrateLocations} variant="outline" size="sm" className="flex items-center gap-2">
          <Map className="h-4 w-4" />
          Migrate Locations
        </Button>
        <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload Data
        </Button>
      </div>

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full h-auto flex-wrap justify-start gap-1 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">PTs</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Companies</span>
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Schools</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            <span className="hidden sm:inline">Partners</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Con Ed</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Podcasts</span>
          </TabsTrigger>
          <TabsTrigger value="consultants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Consultants</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">CRM</span>
          </TabsTrigger>
          <TabsTrigger value="survey" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Survey</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EcosystemOverview onNavigateToTab={handleNavigateToTab} />
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Global Search</h2>
            </div>
            <GlobalSearch />
          </div>
        </TabsContent>
        
        <TabsContent value="providers" className="space-y-4">
          <SearchOnlyTab 
            title="Physical Therapists & Providers"
            description="Search for PTs by specialty, experience, location, license state, and current employer"
            icon={Users}
          />
        </TabsContent>
        
        <TabsContent value="companies" className="space-y-4">
          <SearchOnlyTab 
            title="PT Companies & Practices"
            description="Find PT clinics, hospitals, and healthcare companies by type, size, location, and services"
            icon={Building}
          />
        </TabsContent>
        
        <TabsContent value="schools" className="space-y-4">
          <SearchOnlyTab 
            title="PT Education Programs"
            description="Search DPT programs by accreditation, tuition, location, program type, and specializations"
            icon={GraduationCap}
          />
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <SearchOnlyTab 
            title="PT Job Opportunities"
            description="Find PT positions by employment type, experience level, salary range, location, and remote options"
            icon={Briefcase}
          />
        </TabsContent>
        
        <TabsContent value="partnerships" className="space-y-4">
          <div className="grid gap-6">
            <div className="flex items-center gap-3">
              <Handshake className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Partnership Opportunities</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-xl border border-border shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Education Partners</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Connect with continuing education providers and academic institutions.</p>
                <div className="text-2xl font-bold text-primary mb-1">{stats?.schools || 0}</div>
                <p className="text-xs text-muted-foreground">Academic institutions</p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border border-border shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">Provider Network</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Comprehensive network of licensed physical therapy professionals.</p>
                <div className="text-2xl font-bold text-accent mb-1">{stats?.providers.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">Licensed providers</p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border border-border shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Building className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Business Network</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Complete ecosystem of PT-related companies and organizations.</p>
                <div className="text-2xl font-bold text-orange-500 mb-1">{stats?.companies.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">Companies mapped</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Map className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Interactive PT Ecosystem Map</h2>
            </div>
            <MapContainer />
          </div>
        </TabsContent>


        <TabsContent value="education" className="space-y-4">
          <ContinuingEducationTab />
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <CommunityHub />
        </TabsContent>

        <TabsContent value="podcasts" className="space-y-4">
          <PodcastsTab />
        </TabsContent>

        <TabsContent value="consultants" className="space-y-4">
          <ConsultantsTab />
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="survey" className="space-y-4">
          <ActiveSurveysTab />
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <ApiManagementTab />
        </TabsContent>
      </Tabs>

      {/* Bulk Upload Dialog */}
      <SimpleBulkUpload 
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default Dashboard;