import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Play, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
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
        <p className="text-sm text-muted-foreground">
          Your providers need geographic coordinates for radius search to work. 
          This will process your 15,258 providers and add latitude/longitude coordinates.
        </p>
        
        {progress && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm space-y-2">
              <div>✅ Processed: {progress.processed}</div>
              <div>❌ Failed: {progress.failed}</div>
              <div>📊 Total batches run: {progress.total}</div>
            </div>
          </div>
        )}
        
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
              Start Batch Geocoding
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Note: This processes providers in batches of 50 to avoid rate limits. 
          It may take several minutes to complete all 15,258 providers.
        </p>
      </CardContent>
    </Card>
  );
};