import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Pause, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeocodeStats {
  companies: { total: number; missing: number; percentage: number };
  providers: { total: number; missing: number; percentage: number };
  schools: { total: number; missing: number; percentage: number };
  job_listings: { total: number; missing: number; percentage: number };
}

interface GeocodeJob {
  table: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  processed: number;
  successful: number;
  failed: number;
  total: number;
  errors: string[];
}

export function AutoGeocodeManager() {
  const [stats, setStats] = useState<GeocodeStats | null>(null);
  const [jobs, setJobs] = useState<Record<string, GeocodeJob>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadStats = async () => {
    setLoading(true);
    try {
      const [companiesRes, providersRes, schoolsRes, jobsRes] = await Promise.all([
        supabase.from('companies').select('id, latitude, longitude', { count: 'exact' }),
        supabase.from('providers').select('id, latitude, longitude', { count: 'exact' }),
        supabase.from('schools').select('id', { count: 'exact' }),
        supabase.from('job_listings').select('id', { count: 'exact' })
      ]);

      const [companiesMissingRes, providersMissingRes] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact' }).or('latitude.is.null,longitude.is.null'),
        supabase.from('providers').select('id', { count: 'exact' }).or('latitude.is.null,longitude.is.null')
      ]);

      const newStats: GeocodeStats = {
        companies: {
          total: companiesRes.count || 0,
          missing: companiesMissingRes.count || 0,
          percentage: companiesRes.count ? Math.round(((companiesMissingRes.count || 0) / companiesRes.count) * 100) : 0
        },
        providers: {
          total: providersRes.count || 0,
          missing: providersMissingRes.count || 0,
          percentage: providersRes.count ? Math.round(((providersMissingRes.count || 0) / providersRes.count) * 100) : 0
        },
        schools: {
          total: schoolsRes.count || 0,
          missing: schoolsRes.count || 0, // All schools need geocoding
          percentage: 100
        },
        job_listings: {
          total: jobsRes.count || 0,
          missing: jobsRes.count || 0, // All job listings need geocoding
          percentage: 100
        }
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error loading statistics",
        description: "Failed to load geocoding statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startGeocodingJob = async (table: string) => {
    setJobs(prev => ({
      ...prev,
      [table]: {
        table,
        status: 'running',
        processed: 0,
        successful: 0,
        failed: 0,
        total: stats?.[table as keyof GeocodeStats]?.missing || 0,
        errors: []
      }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('batch-geocode-all', {
        body: {
          table,
          batch_size: 100,
          max_batches: 50 // Process max 5000 records per run
        }
      });

      if (error) {
        throw error;
      }

      setJobs(prev => ({
        ...prev,
        [table]: {
          ...prev[table],
          status: data.successful > 0 ? 'completed' : 'failed',
          processed: data.processed,
          successful: data.successful,
          failed: data.failed,
          errors: data.errors || []
        }
      }));

      toast({
        title: `Geocoding completed for ${table}`,
        description: `${data.successful}/${data.processed} records geocoded successfully`,
        variant: data.successful > 0 ? "default" : "destructive"
      });

      // Refresh stats
      await loadStats();

    } catch (error) {
      console.error(`Error geocoding ${table}:`, error);
      setJobs(prev => ({
        ...prev,
        [table]: {
          ...prev[table],
          status: 'failed',
          errors: [error.message]
        }
      }));

      toast({
        title: `Geocoding failed for ${table}`,
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const startAllJobs = async () => {
    if (!stats) return;

    for (const [table, stat] of Object.entries(stats)) {
      if (stat.missing > 0) {
        await startGeocodingJob(table);
        // Add delay between jobs to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage === 0) return <Badge variant="default" className="bg-green-500">Complete</Badge>;
    if (percentage <= 25) return <Badge variant="default" className="bg-yellow-500">Good</Badge>;
    if (percentage <= 50) return <Badge variant="default" className="bg-orange-500">Needs Work</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Automated Geocoding System
          </CardTitle>
          <CardDescription>
            Automatically add coordinates to all entities for map functionality. 
            New uploads will be geocoded automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadStats} variant="outline" disabled={loading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
            <Button 
              onClick={startAllJobs} 
              disabled={loading || !stats || Object.values(jobs).some(job => job.status === 'running')}
            >
              <Play className="h-4 w-4 mr-2" />
              Start All Geocoding
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stats).map(([table, stat]) => {
                const job = jobs[table];
                return (
                  <Card key={table}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm capitalize">
                          {table.replace('_', ' ')}
                        </CardTitle>
                        {getStatusBadge(stat.percentage)}
                      </div>
                      <CardDescription className="text-xs">
                        {stat.missing} of {stat.total} missing coordinates ({stat.percentage}%)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {job && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <span className="text-sm font-medium">
                              {job.status === 'running' && `Processing... (${job.processed}/${job.total})`}
                              {job.status === 'completed' && `Completed: ${job.successful}/${job.processed}`}
                              {job.status === 'failed' && 'Failed'}
                            </span>
                          </div>
                          
                          {job.status === 'running' && (
                            <Progress 
                              value={job.total > 0 ? (job.processed / job.total) * 100 : 0} 
                              className="w-full" 
                            />
                          )}

                          {job.errors.length > 0 && (
                            <Alert>
                              <AlertDescription className="text-xs">
                                {job.errors.slice(0, 3).map((error, i) => (
                                  <div key={i}>{error}</div>
                                ))}
                                {job.errors.length > 3 && (
                                  <div>...and {job.errors.length - 3} more errors</div>
                                )}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      <Button
                        size="sm"
                        onClick={() => startGeocodingJob(table)}
                        disabled={loading || stat.missing === 0 || job?.status === 'running'}
                        className="w-full"
                      >
                        {job?.status === 'running' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Geocoding
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <strong>Auto-geocoding is now enabled:</strong>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>New bulk uploads will automatically geocode all records</li>
                <li>Individual record additions will trigger background geocoding</li>
                <li>Existing data can be batch geocoded using the buttons above</li>
                <li>The map will show all entities with precise or approximate locations</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}