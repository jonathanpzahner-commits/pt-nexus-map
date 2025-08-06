import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

type EntityType = 'providers' | 'companies' | 'schools' | 'job_listings';

interface UploadJob {
  id: string;
  status: string;
  total_rows?: number;
  processed_rows?: number;
  successful_rows?: number;
  failed_rows?: number;
  results?: any;
  error_details?: any;
  file_name?: string;
  file_path?: string;
  entity_type?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const BulkUploadDialog = ({ open, onOpenChange, onUploadComplete }: BulkUploadDialogProps) => {
  const [entityType, setEntityType] = useState<EntityType>('providers');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentJob, setCurrentJob] = useState<UploadJob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const entityTypeOptions = [
    { value: 'providers', label: 'Physical Therapists (Providers)' },
    { value: 'companies', label: 'Companies' },
    { value: 'schools', label: 'Schools' },
    { value: 'job_listings', label: 'Job Listings' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx, .xls) or CSV file",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      const { data: job } = await supabase
        .from('bulk_upload_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (job) {
        setCurrentJob(job);
        
        if (job.total_rows && job.processed_rows) {
          const progress = (job.processed_rows / job.total_rows) * 100;
          setUploadProgress(progress);
        }

        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(pollInterval);
          setIsUploading(false);
          
          if (job.status === 'completed') {
            toast({
              title: "Upload completed",
              description: `Successfully processed ${job.successful_rows || 0} records`,
            });
            onUploadComplete?.();
          } else {
            toast({
              title: "Upload failed",
              description: "There was an error processing your file",
              variant: "destructive",
            });
          }
        }
      }
    }, 2000);

    return pollInterval;
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique file path
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}-${file.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('bulk-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Create job record
      const { data: job, error: jobError } = await supabase
        .from('bulk_upload_jobs')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          entity_type: entityType,
        })
        .select()
        .single();

      if (jobError || !job) {
        throw new Error(`Failed to create job: ${jobError?.message}`);
      }

      setCurrentJob(job);

      // Start processing
      const { error: processError } = await supabase.functions.invoke('process-bulk-upload', {
        body: { jobId: job.id }
      });

      if (processError) {
        throw new Error(`Failed to start processing: ${processError.message}`);
      }

      // Start polling for status updates
      pollJobStatus(job.id);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templates = {
      providers: {
        filename: 'providers_template.csv',
        headers: 'First Name,Last Name,Email,Phone,City,State/Province,Zip,Current Employer,Current Job Title,Skill Set,Additional Info,Source,LinkedIn',
        sample: 'John,Smith,john@email.com,555-1234,Los Angeles,CA,90210,ABC Therapy,Physical Therapist,"Orthopedic, Sports Medicine",10 years experience,LinkedIn,https://linkedin.com/in/johnsmith'
      },
      companies: {
        filename: 'companies_template.csv',
        headers: 'name,company_type,description,website,founded_year,employee_count,services,company_locations',
        sample: 'ABC Therapy,Private Practice,Leading PT clinic,https://example.com,2010,25,"Physical Therapy, Sports Medicine","Los Angeles CA, San Diego CA"'
      },
      schools: {
        filename: 'schools_template.csv',
        headers: 'name,city,state,description,accreditation,tuition_per_year,program_length_months,faculty_count,average_class_size,programs_offered,specializations',
        sample: 'PT University,Los Angeles,CA,Top PT school,CAPTE,45000,36,20,25,"DPT, PhD","Orthopedic, Neurologic"'
      },
      job_listings: {
        filename: 'job_listings_template.csv',
        headers: 'title,city,state,description,requirements,employment_type,experience_level,salary_min,salary_max,is_remote,company_id',
        sample: 'Physical Therapist,Los Angeles,CA,PT position,DPT required,Full-time,Mid Level,80000,100000,false,'
      }
    };

    const template = templates[entityType];
    const csvContent = `${template.headers}\n${template.sample}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = template.filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setFile(null);
    setCurrentJob(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetDialog();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Upload Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entity Type Selection */}
          <div>
            <Label className="text-sm font-medium">Data Type</Label>
            <Select value={entityType} onValueChange={(value) => setEntityType(value as EntityType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entityTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Download */}
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Download the template file to see the required format and column headers.
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto text-primary"
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </AlertDescription>
          </Alert>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium">Excel/CSV File</Label>
            <div className="mt-1">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-center">
                  <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Click to select file or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Progress */}
          {currentJob && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Upload Progress</span>
                <span className="text-muted-foreground">
                  {currentJob.processed_rows || 0} / {currentJob.total_rows || 0} rows
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              
              {currentJob.status === 'completed' && currentJob.results && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Upload completed! {currentJob.results.successful} records added successfully.
                    {currentJob.results.failed > 0 && ` ${currentJob.results.failed} records failed.`}
                  </AlertDescription>
                </Alert>
              )}

              {currentJob.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload failed. Please check your file format and try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};