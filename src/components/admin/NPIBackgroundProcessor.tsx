import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Play, Loader2, CheckCircle, AlertCircle, Clock, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProcessingJob {
  id: string;
  job_type: string;
  status: string;
  progress_data: any;
  result_data: any;
  error_details?: string;
  created_at: string;
  completed_at?: string;
}

export const NPIBackgroundProcessor = () => {
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkForExistingJob();
    const interval = setInterval(checkForExistingJob, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkForExistingJob = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('job_type', 'npi_import')
        .in('status', ['pending', 'running'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (jobs && jobs.length > 0) {
        setCurrentJob(jobs[0]);
      } else {
        // Check for most recent completed job
        const { data: completedJobs, error: completedError } = await supabase
          .from('processing_jobs')
          .select('*')
          .eq('job_type', 'npi_import')
          .in('status', ['completed', 'failed'])
          .order('created_at', { ascending: false })
          .limit(1);

        if (!completedError && completedJobs && completedJobs.length > 0) {
          setCurrentJob(completedJobs[0]);
        }
      }
    } catch (error) {
      console.error('Error checking for existing job:', error);
    }
  };

  const startProcessing = async () => {
    setIsStarting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('npi-background-processor', {
        body: { 
          action: 'start',
          user_id: user?.id,
          email: email || undefined
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Background Processing Started! 🚀",
        description: "NPI processing is now running in the background. You can close this page and check back later.",
      });
      
      // Start polling for the new job
      setTimeout(checkForExistingJob, 2000);
      
    } catch (error) {
      console.error('Error starting processing:', error);
      toast({
        title: "Error",
        description: "Failed to start NPI processing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          NPI Background Processor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info section */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            🚀 Background Processing
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-200">
            This will download and process the entire NPI database (~7M records) to extract 
            Physical Therapists and PTAs. The process runs entirely in the background - 
            you can close your browser and check back later!
          </p>
        </div>

        {/* Current Job Status */}
        {currentJob && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(currentJob.status)}
                  <span className="font-medium">Current Job Status</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentJob.status)}`}>
                  {currentJob.status.toUpperCase()}
                </span>
              </div>

              {currentJob.progress_data && (
                <div className="space-y-3">
                  {currentJob.progress_data.progress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{currentJob.progress_data.message || 'Processing...'}</span>
                        <span>{currentJob.progress_data.progress}%</span>
                      </div>
                      <Progress value={currentJob.progress_data.progress} className="h-2" />
                    </div>
                  )}

                  {currentJob.progress_data.totalProcessed && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                          {currentJob.progress_data.totalProcessed.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {currentJob.progress_data.ptFound?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-gray-500">PTs Found</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {currentJob.progress_data.inserted?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-gray-500">Imported</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentJob.result_data && currentJob.status === 'completed' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    ✅ Processing Complete!
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">
                        {currentJob.result_data.totalProcessed?.toLocaleString()}
                      </div>
                      <div className="text-green-600 dark:text-green-400">Total Processed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {currentJob.result_data.ptFound?.toLocaleString()}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400">PTs Found</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {currentJob.result_data.inserted?.toLocaleString()}
                      </div>
                      <div className="text-purple-600 dark:text-purple-400">Imported</div>
                    </div>
                  </div>
                </div>
              )}

              {currentJob.error_details && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                    ❌ Processing Failed
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {currentJob.error_details}
                  </p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                <div>Started: {new Date(currentJob.created_at).toLocaleString()}</div>
                {currentJob.completed_at && (
                  <div>Completed: {new Date(currentJob.completed_at).toLocaleString()}</div>
                )}
                <div>Duration: {formatDuration(currentJob.created_at, currentJob.completed_at)}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start New Job */}
        {(!currentJob || ['completed', 'failed'].includes(currentJob.status)) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEmailInput(!showEmailInput)}
                variant="outline"
                size="sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                {showEmailInput ? 'Hide' : 'Add'} Email Notification
              </Button>
            </div>

            {showEmailInput && (
              <div className="space-y-2">
                <Label htmlFor="email">Email for completion notification</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="max-w-sm"
                />
              </div>
            )}

            <Button 
              onClick={startProcessing} 
              disabled={isStarting}
              className="w-full"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting Background Process...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start NPI Background Processing
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Processing runs entirely in the background on Supabase servers</p>
          <p>• You can close your browser and check back later</p>
          <p>• Estimated processing time: 30-60 minutes for full NPI database</p>
          <p>• Optional email notification when processing completes</p>
          <p>• Filters for PT taxonomy codes and imports clean, structured data</p>
        </div>
      </CardContent>
    </Card>
  );
};