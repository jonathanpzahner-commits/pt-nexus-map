import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MapPin, Play, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const GeocodingManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<{
    processed: number;
    failed: number;
    total: number;
  } | null>(null);
  const { toast } = useToast();

  // Fetch geocoding statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['geocoding-stats'],
    queryFn: async () => {
      const { count: totalCount } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true });

      const { count: geocodedCount } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      const total = totalCount || 0;
      const geocoded = geocodedCount || 0;
      const remaining = total - geocoded;

      return {
        total,
        geocoded,
        remaining,
        percentage: total > 0 ? Math.round((geocoded / total) * 100) : 0
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Check for active background job
  const { data: backgroundJob } = useQuery({
    queryKey: ['background-geocode-job'],
    queryFn: async () => {
      const { data } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('job_type', 'background_geocode')
        .eq('status', 'processing')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    refetchInterval: 5000, // Check every 5 seconds
  });

  const startBackgroundGeocoding = async () => {
    setIsRunning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('background-geocode-runner');
      
      if (error) throw error;
      
      toast({
        title: "Background geocoding started!",
        description: "Geocoding will continue automatically in the background. You can close your browser and it will keep running.",
      });
      
    } catch (error) {
      console.error('Background geocoding error:', error);
      toast({
        title: "Error",
        description: "Failed to start background geocoding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Provider Geocoding Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading geocoding statistics...</span>
          </div>
        ) : stats ? (
          <div className="space-y-4">
            {stats.percentage >= 100 ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Geocoding Complete!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    All {stats.total} providers have been geocoded successfully.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Geocoding Progress</span>
                  <span>{stats.percentage}% complete</span>
                </div>
                <Progress value={stats.percentage} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-green-600">{stats.geocoded}</div>
                    <div className="text-muted-foreground">Geocoded</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{stats.remaining}</div>
                    <div className="text-muted-foreground">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{stats.total}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            )}
            
            {progress && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm space-y-2">
                  <div>✅ Processed: {progress.processed}</div>
                  <div>❌ Failed: {progress.failed}</div>
                  <div>📊 Total batches run: {progress.total}</div>
                </div>
              </div>
            )}
            
            {/* Background job status */}
            {backgroundJob && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Background geocoding is running
                  </span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Geocoding continues automatically in the background. You can close your browser.
                </p>
                {backgroundJob.result_data && typeof backgroundJob.result_data === 'object' && (
                  <div className="mt-2 text-xs space-y-1">
                    <div>Processed: {(backgroundJob.result_data as any).totalProcessed || 0}</div>
                    <div>Failed: {(backgroundJob.result_data as any).totalFailed || 0}</div>
                    <div>Batches: {(backgroundJob.result_data as any).batchCount || 0}</div>
                  </div>
                )}
              </div>
            )}

            {stats.remaining > 0 && !backgroundJob && (
              <>
                <Button 
                  onClick={startBackgroundGeocoding} 
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting Background Geocoding...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Background Geocoding
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  This will start background geocoding that continues even if you close your browser. 
                  {stats.remaining} providers still need geocoding.
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to load geocoding statistics.
          </p>
        )}
      </CardContent>
    </Card>
  );
};