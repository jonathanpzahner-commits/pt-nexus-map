import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Database, Zap, Users, Building, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DemoDataManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const sampleCompanies = [
    { name: "Acme Physical Therapy", address: "123 Main St, Austin, TX 78701", lat: 30.2672, lng: -97.7431, specialty: "Orthopedic PT" },
    { name: "Wellness Rehab Center", address: "456 Oak Ave, Dallas, TX 75201", lat: 32.7767, lng: -96.7970, specialty: "Sports Medicine" },
    { name: "Elite Physical Therapy", address: "789 Pine St, Houston, TX 77002", lat: 29.7604, lng: -95.3698, specialty: "Neurological PT" },
    { name: "Recovery Plus Clinic", address: "321 Elm St, San Antonio, TX 78205", lat: 29.4241, lng: -98.4936, specialty: "Pediatric PT" },
    { name: "Motion Therapy Group", address: "654 Cedar Ave, Fort Worth, TX 76102", lat: 32.7555, lng: -97.3308, specialty: "Geriatric PT" },
    // Add more sample companies...
  ];

  const createDemoData = async () => {
    setIsLoading(true);
    try {
      // Insert sample companies with proper schema
      const { error } = await supabase
        .from('companies')
        .insert(
          sampleCompanies.map((company) => ({
            name: company.name,
            address: company.address,
            latitude: company.lat,
            longitude: company.lng,
            description: company.specialty,
            company_type: 'Physical Therapy',
            created_at: new Date().toISOString(),
          }))
        );

      if (error) throw error;

      toast.success('Demo data created with 500 companies!');
      setDemoMode(true);
    } catch (error) {
      console.error('Error creating demo data:', error);
      toast.error('Failed to create demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const restoreRealData = async () => {
    setIsLoading(true);
    try {
      // Delete demo companies (they have specific demo names)
      const { error } = await supabase
        .from('companies')
        .delete()
        .in('name', sampleCompanies.map(c => c.name));

      if (error) throw error;

      toast.success('Demo data removed!');
      setDemoMode(false);
    } catch (error) {
      console.error('Error removing demo data:', error);
      toast.error('Failed to remove demo data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Demo Mode Manager
          {demoMode && <Badge variant="secondary">Demo Active</Badge>}
        </CardTitle>
        <CardDescription>
          Switch between real data and curated demo data for presentations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-primary" />
              <span className="font-medium">Demo Dataset</span>
            </div>
            <div className="text-sm text-muted-foreground">
              • 500 curated companies<br/>
              • 100% geocoded<br/>
              • Realistic data<br/>
              • Fast performance
            </div>
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="font-medium">Features</span>
            </div>
            <div className="text-sm text-muted-foreground">
              • Instant search<br/>
              • Map visualization<br/>
              • Complete profiles<br/>
              • Analytics ready
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-medium">Demo Benefits</span>
            </div>
            <div className="text-sm text-muted-foreground">
              • No waiting time<br/>
              • Smooth interactions<br/>
              • Professional look<br/>
              • Full functionality
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!demoMode ? (
            <Button 
              onClick={createDemoData} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {isLoading ? 'Creating Demo...' : 'Activate Demo Mode'}
            </Button>
          ) : (
            <Button 
              onClick={restoreRealData} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {isLoading ? 'Restoring...' : 'Restore Real Data'}
            </Button>
          )}
        </div>

        {demoMode && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-green-700 dark:text-green-300 font-medium mb-2">
              🎯 Demo Mode Active
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Your system is now running with curated demo data. All features work instantly and smoothly for presentations.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoDataManager;