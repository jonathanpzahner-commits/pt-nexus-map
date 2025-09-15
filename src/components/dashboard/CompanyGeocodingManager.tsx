import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AlertCircle, MapPin, Zap } from 'lucide-react';

const CompanyGeocodingManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Fetch company geocoding statistics
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['company-geocoding-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, latitude, longitude');
      
      if (error) throw error;
      
      const total = data?.length || 0;
      const geocoded = data?.filter(c => c.latitude && c.longitude).length || 0;
      const remaining = total - geocoded;
      const percentage = total > 0 ? Math.round((geocoded / total) * 100) : 0;
      
      return { total, geocoded, remaining, percentage };
    },
    refetchInterval: 10000, // Refetch every 10 seconds
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
        </CardTitle>
        <CardDescription>
          Add latitude and longitude coordinates to company addresses for map display
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{stats.geocoded.toLocaleString()} / {stats.total.toLocaleString()} companies</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {stats.percentage}% complete • {stats.remaining.toLocaleString()} companies need geocoding
            </div>
          </div>
        )}

        {stats?.remaining > 0 && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Ready to geocode companies</p>
                <p className="text-muted-foreground">
                  This will process companies in batches of 100 using the Mapbox geocoding API.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {stats?.remaining > 0 && (
            <Button 
              onClick={startCompanyGeocoding}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isRunning ? 'Geocoding...' : `Geocode Companies (${stats.remaining.toLocaleString()})`}
            </Button>
          )}
        </div>

        {results && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Last Batch Results:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">{results.processed || 0}</span>
                <span className="text-muted-foreground"> companies geocoded</span>
              </div>
              <div>
                <span className="text-red-600 font-medium">{results.failed || 0}</span>
                <span className="text-muted-foreground"> failed</span>
              </div>
            </div>
            {results.message && (
              <p className="text-xs text-muted-foreground mt-2">{results.message}</p>
            )}
          </div>
        )}

        {stats?.remaining === 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-700 dark:text-green-300 font-medium">
              ✅ All companies are geocoded!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              All {stats.total.toLocaleString()} companies now have coordinates for map display.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyGeocodingManager;