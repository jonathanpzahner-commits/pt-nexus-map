import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeocodeResults {
  summary: {
    totalProcessed: number;
    totalUpdated: number;
    totalFailed: number;
    processingTime: string;
  };
  results: Record<string, any>;
}

export const FastGeocodingManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<GeocodeResults | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const startFastGeocoding = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    try {
      toast({
        title: "Fast Geocoding Started",
        description: "Processing large dataset with offline geocoder...",
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 2000);

      const { data, error } = await supabase.functions.invoke('fast-offline-geocoder', {
        body: {
          tables: ['providers', 'companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms'],
          batchSize: 1000
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw error;
      }

      setResults(data);
      
      toast({
        title: "Fast Geocoding Complete!",
        description: `Updated ${data.summary.totalUpdated} records in ${data.summary.processingTime}`,
      });

    } catch (error) {
      console.error('Fast geocoding error:', error);
      toast({
        title: "Geocoding Error",
        description: error.message || "Failed to complete fast geocoding",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Fast Offline Geocoding
        </CardTitle>
        <CardDescription>
          High-performance geocoding using offline database for big data processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This uses an offline geocoding database for ultra-fast processing of large datasets. 
            Processing thousands of records should complete in under 5 minutes.
          </AlertDescription>
        </Alert>

        {!results && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Offline Database Lookup</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>~3-5 Minutes for 10k Records</span>
              </div>
            </div>
            
            <Button 
              onClick={startFastGeocoding}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Processing Large Dataset...' : 'Start Fast Geocoding'}
            </Button>
          </div>
        )}

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Fast Geocoding Complete!</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{results.summary.totalProcessed}</div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.summary.totalUpdated}</div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{results.summary.totalFailed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Results by Table:</h4>
              {Object.entries(results.results).map(([table, result]: [string, any]) => (
                <div key={table} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">{table}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{result.updated} updated</Badge>
                    {result.failed > 0 && (
                      <Badge variant="destructive">{result.failed} failed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => setResults(null)}
              variant="outline"
              className="w-full"
            >
              Run Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};