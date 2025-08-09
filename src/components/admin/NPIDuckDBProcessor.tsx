import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, AlertCircle, Play, Database, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessingJob {
  id: string;
  job_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress_data?: {
    progress: number;
    message: string;
    processedCount?: number;
  };
  result_data?: {
    totalProcessed: number;
    message: string;
    method: string;
  };
  error_details?: string;
  created_at: string;
  completed_at?: string;
}

export const NPIDuckDBProcessor = () => {
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const { toast } = useToast();

  // Check for existing jobs
  useEffect(() => {
    checkForExistingJob();
    const interval = setInterval(checkForExistingJob, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkForExistingJob = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('job_type', 'npi_duckdb_import')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (jobs && jobs.length > 0) {
        const job = jobs[0];
        if (job.status === 'pending' || job.status === 'running') {
          setCurrentJob({
            id: job.id,
            job_type: job.job_type,
            status: job.status as 'pending' | 'running' | 'completed' | 'failed',
            progress_data: job.progress_data as any,
            result_data: job.result_data as any,
            error_details: job.error_details,
            created_at: job.created_at,
            completed_at: job.completed_at
          });
        } else if (job.status === 'completed' || job.status === 'failed') {
          setCurrentJob({
            id: job.id,
            job_type: job.job_type,
            status: job.status as 'pending' | 'running' | 'completed' | 'failed',
            progress_data: job.progress_data as any,
            result_data: job.result_data as any,
            error_details: job.error_details,
            created_at: job.created_at,
            completed_at: job.completed_at
          });
        }
      }
    } catch (error) {
      console.error('Error checking for existing job:', error);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `npi-files/${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('bulk-uploads')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('bulk-uploads')
        .getPublicUrl(fileName);

      setUploadedFileUrl(publicUrl);
      setFileUrl(publicUrl);

      toast({
        title: "File Uploaded",
        description: "Your NPI file has been uploaded successfully",
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const startProcessing = async () => {
    const sourceUrl = uploadedFileUrl || fileUrl;
    if (!sourceUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a file URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('npi-duckdb-processor', {
        body: {
          action: 'start',
          user_id: user.id,
          email: email.trim() || undefined,
          file_url: sourceUrl.trim()
        }
      });

      if (error) throw error;

      toast({
        title: "Processing Started",
        description: "DuckDB NPI processing job has been started. This is much more efficient than the streaming approach.",
      });

      setCurrentJob({
        id: data.jobId,
        job_type: 'npi_duckdb_import',
        status: 'pending',
        created_at: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Error starting processing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start processing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'running':
      case 'pending':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const duration = endTime - startTime;
    
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          NPI DuckDB Processor
        </CardTitle>
        <CardDescription>
          Process NPI files efficiently using DuckDB for high-performance analytics.
          This approach is much faster and more memory-efficient than streaming processing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentJob && (
          <Alert>
            <div className="flex items-center gap-2">
              {getStatusIcon(currentJob.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getStatusColor(currentJob.status)}`}>
                    Status: {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                  </span>
                  <Badge variant="secondary">
                    DuckDB Processing
                  </Badge>
                </div>
                
                {currentJob.progress_data && (
                  <div className="mt-2 space-y-2">
                    <Progress value={currentJob.progress_data.progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {currentJob.progress_data.message}
                    </p>
                    {currentJob.progress_data.processedCount && (
                      <p className="text-sm font-medium">
                        Processed: {currentJob.progress_data.processedCount.toLocaleString()} providers
                      </p>
                    )}
                  </div>
                )}

                {currentJob.result_data && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      ✅ {currentJob.result_data.message}
                    </p>
                    <p className="text-sm text-green-600">
                      Total processed: {currentJob.result_data.totalProcessed.toLocaleString()} providers
                    </p>
                    <p className="text-xs text-green-500">
                      Method: {currentJob.result_data.method}
                    </p>
                  </div>
                )}

                {currentJob.error_details && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      ❌ Processing failed
                    </p>
                    <p className="text-sm text-red-600">
                      {currentJob.error_details}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Started: {new Date(currentJob.created_at).toLocaleString()}</span>
                  <span>Duration: {formatDuration(currentJob.created_at, currentJob.completed_at)}</span>
                </div>
              </div>
            </div>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload NPI File (.zip or .csv)</Label>
              <div className="space-y-2">
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".zip,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={currentJob?.status === 'running' || currentJob?.status === 'pending' || uploading}
                />
                {file && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                )}
                <Button
                  onClick={uploadFile}
                  disabled={!file || uploading || currentJob?.status === 'running' || currentJob?.status === 'pending'}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground text-sm font-medium">OR</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">NPI File URL</Label>
            <Input
              id="fileUrl"
              type="url"
              placeholder="https://download.cms.gov/nppes/NPPES_Data_Dissemination_December_2024.zip"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={currentJob?.status === 'running' || currentJob?.status === 'pending'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email for completion notification (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={currentJob?.status === 'running' || currentJob?.status === 'pending'}
            />
          </div>

          <Button
            onClick={startProcessing}
            disabled={
              loading ||
              currentJob?.status === 'running' ||
              currentJob?.status === 'pending' ||
              (!uploadedFileUrl && !fileUrl.trim())
            }
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? "Starting..." : "Start DuckDB Processing"}
          </Button>
        </div>

        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>DuckDB Advantages:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Processes large CSV files without loading entirely into memory</li>
              <li>Built-in compression support (gzip, zip)</li>
              <li>SQL-based filtering happens at the database level for efficiency</li>
              <li>Significantly faster than streaming line-by-line processing</li>
              <li>Handles the 7GB+ NPI file without memory crashes</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};