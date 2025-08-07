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

  const runBatchGeocoding = async () => {
    setIsRunning(true);
    setProgress(null);
    
    try {
      let totalProcessed = 0;
      let totalFailed = 0;
      let batchCount = 0;
      
      // Run multiple batches until complete
      while (true) {
        batchCount++;
        const { data, error } = await supabase.functions.invoke('batch-geocode-providers');
        
        if (error) throw error;
        
        if (data.processed === 0 && data.failed === 0) {
          // No more providers to process
          break;
        }
        
        // If we're only getting failures and no successes, stop after a few attempts
        if (data.processed === 0 && data.failed > 0 && batchCount >= 3) {
          toast({
            title: "Geocoding stopped",
            description: "No providers with valid address data found. Please upload providers with city/state information.",
            variant: "destructive",
          });
          break;
        }
        
        totalProcessed += data.processed;
        totalFailed += data.failed;
        
        setProgress({
          processed: totalProcessed,
          failed: totalFailed,
          total: totalProcessed + totalFailed
        });
        
        toast({
          title: `Batch ${batchCount} completed`,
          description: `Processed: ${data.processed}, Failed: ${data.failed}`,
        });
        
        // Small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Geocoding completed!",
        description: `Successfully geocoded ${totalProcessed} providers. ${totalFailed} failed.`,
      });
      
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Failed to run batch geocoding. Please try again.",
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
            
            {stats.remaining > 0 && (
              <>
                <Button 
                  onClick={runBatchGeocoding} 
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running Geocoding...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Batch Geocoding
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Note: This processes providers in batches of 50 to avoid rate limits. 
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