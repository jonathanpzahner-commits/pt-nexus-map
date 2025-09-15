import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AlertCircle, MapPin, Zap } from 'lucide-react';

interface GeocodingProgress {
  total: number;
  geocoded: number;
  remaining: number;
  percentage: number;
  last_updated: string;
}

const CompanyGeocodingManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Fetch company geocoding statistics using the new progress function
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['company-geocoding-stats'],
    queryFn: async () => {
      console.log('Fetching company geocoding statistics...');
      
      // Use the database function for accurate stats
      const { data, error } = await supabase
        .rpc('get_geocoding_progress');
      
      if (error) {
        console.error('Error getting geocoding progress:', error);
        throw error;
      }
      
      console.log('Company geocoding progress:', data);
      return data as unknown as GeocodingProgress;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });

  const startCompanyGeocoding = async () => {
    if (!stats?.remaining || stats.remaining === 0) {
      toast.info("All companies are already geocoded!");
      return;
    }

    setIsRunning(true);
    setResults(null);

    try {
      console.log('Starting company geocoding...');
      
      const { data, error } = await supabase.functions.invoke('geocode-companies', {
        body: { batch_size: 100 }
      });

      if (error) {
        console.error('Geocoding error:', error);
        throw error;
      }

      console.log('Geocoding results:', data);
      setResults(data);
      
      if (data?.processed > 0) {
        toast.success(`Successfully geocoded ${data.processed} companies!`);
        refetch(); // Refresh stats
      } else {
        toast.warning(`No companies were geocoded. ${data?.failed || 0} failed.`);
      }
      
    } catch (error) {
      console.error('Company geocoding failed:', error);
      toast.error(`Company geocoding failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Company Geocoding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Company Geocoding Manager
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Auto-processing active</span>
          </div>
        </CardTitle>
        <CardDescription>
          Background system automatically geocodes companies every 3 minutes (20 per batch)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{stats.geocoded?.toLocaleString()} / {stats.total?.toLocaleString()} companies</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {stats.percentage}% complete • {stats.remaining?.toLocaleString()} companies remaining
            </div>
            {stats.last_updated && (
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(stats.last_updated).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-medium text-green-700 dark:text-green-300">
                🤖 Background Processing Active
              </div>
              <div className="text-sm text-muted-foreground">
                The system automatically geocodes 20 companies every 3 minutes. All {stats?.total?.toLocaleString()} companies will be processed without any manual intervention.
              </div>
              {stats?.remaining > 0 && (
                <div className="text-xs text-muted-foreground">
                  ⏱️ Estimated completion: ~{Math.ceil(stats.remaining / 20 * 3)} minutes at current rate
                </div>
              )}
            </div>
          </div>
        </div>

        {stats?.remaining === 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-700 dark:text-green-300 font-medium">
              ✅ All companies are geocoded!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              All {stats.total?.toLocaleString()} companies now have coordinates for map display.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyGeocodingManager;