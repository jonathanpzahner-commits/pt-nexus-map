import { useState, useEffect } from 'react';
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

type EntityType = 'providers' | 'companies' | 'schools' | 'job_listings' | 'equipment_companies' | 'consultant_companies' | 'pe_firms';

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

  // Real-time subscription for job updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bulk-upload-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bulk_upload_jobs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedJob = payload.new as UploadJob;
          setCurrentJob(updatedJob);
          
          // Calculate progress
          if (updatedJob.total_rows && updatedJob.processed_rows) {
            const progress = (updatedJob.processed_rows / updatedJob.total_rows) * 100;
            setUploadProgress(progress);
          }

          // Show completion notifications
          if (updatedJob.status === 'completed') {
            setIsUploading(false);
            toast({
              title: "✅ Upload completed!",
              description: `Successfully processed ${updatedJob.successful_rows || 0} records from ${updatedJob.file_name}`,
            });
            onUploadComplete?.();
          } else if (updatedJob.status === 'failed') {
            setIsUploading(false);
            toast({
              title: "❌ Upload failed",
              description: `Error processing ${updatedJob.file_name}. Check file format and try again.`,
              variant: "destructive",
            });
          } else if (updatedJob.status === 'processing' && updatedJob.total_rows) {
            toast({
              title: "📊 Processing update",
              description: `Processing ${updatedJob.file_name}: ${updatedJob.processed_rows || 0}/${updatedJob.total_rows} rows complete`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, onUploadComplete]);

  const entityTypeOptions = [
    { value: 'providers', label: 'Physical Therapists (Providers)' },
    { value: 'companies', label: 'Companies' },
    { value: 'schools', label: 'Schools' },
    { value: 'job_listings', label: 'Job Listings' },
    { value: 'equipment_companies', label: 'Equipment Companies' },
    { value: 'consultant_companies', label: 'Consultant Companies' },
    { value: 'pe_firms', label: 'PE Firms' },
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
        headers: 'NPI,Entity Type Code,Replacement NPI,Employer Identification Number (EIN),Provider Organization Name (Legal Business Name),Provider Last Name (Legal Name),Provider First Name,Provider Middle Name,Provider Name Prefix Text,Provider Name Suffix Text,Provider Credential Text,Provider Other Organization Name,Provider Other Organization Name Type Code,Provider Other Last Name,Provider Other First Name,Provider Other Middle Name,Provider Other Name Prefix Text,Provider Other Name Suffix Text,Provider Other Credential Text,Provider Other Last Name Type Code,Provider First Line Business Mailing Address,Provider Second Line Business Mailing Address,Provider Business Mailing Address City Name,Provider Business Mailing Address State Name,Provider Business Mailing Address Postal Code,Provider Business Mailing Address Country Code,Provider Business Mailing Address Telephone Number,Provider Business Mailing Address Fax Number,Provider First Line Business Practice Location Address,Provider Second Line Business Practice Location Address,Provider Business Practice Location Address City Name,Provider Business Practice Location Address State Name,Provider Business Practice Location Address Postal Code,Provider Business Practice Location Address Country Code,Provider Business Practice Location Address Telephone Number,Provider Business Practice Location Address Fax Number,Provider Enumeration Date,Last Update Date,NPI Deactivation Reason Code,NPI Deactivation Date,NPI Reactivation Date,Provider Gender Code,Authorized Official Last Name,Authorized Official First Name,Authorized Official Middle Name,Authorized Official Title or Position,Authorized Official Telephone Number,Healthcare Provider Taxonomy Code_1,Provider License Number_1,Provider License Number State Code_1,Healthcare Provider Primary Taxonomy Switch_1,Healthcare Provider Taxonomy Code_2,Provider License Number_2,Provider License Number State Code_2,Healthcare Provider Primary Taxonomy Switch_2,Healthcare Provider Taxonomy Code_3,Provider License Number_3,Provider License Number State Code_3,Healthcare Provider Primary Taxonomy Switch_3,Healthcare Provider Taxonomy Code_4,Provider License Number_4,Provider License Number State Code_4,Healthcare Provider Primary Taxonomy Switch_4,Healthcare Provider Taxonomy Code_5,Provider License Number_5,Provider License Number State Code_5,Healthcare Provider Primary Taxonomy Switch_5,Healthcare Provider Taxonomy Code_6,Provider License Number_6,Provider License Number State Code_6,Healthcare Provider Primary Taxonomy Switch_6,Healthcare Provider Taxonomy Code_7,Provider License Number_7,Provider License Number State Code_7,Healthcare Provider Primary Taxonomy Switch_7,Healthcare Provider Taxonomy Code_8,Provider License Number_8,Provider License Number State Code_8,Healthcare Provider Primary Taxonomy Switch_8,Healthcare Provider Taxonomy Code_9,Provider License Number_9,Provider License Number State Code_9,Healthcare Provider Primary Taxonomy Switch_9,Healthcare Provider Taxonomy Code_10,Provider License Number_10,Provider License Number State Code_10,Healthcare Provider Primary Taxonomy Switch_10,Healthcare Provider Taxonomy Code_11,Provider License Number_11,Provider License Number State Code_11,Healthcare Provider Primary Taxonomy Switch_11,Healthcare Provider Taxonomy Code_12,Provider License Number_12,Provider License Number State Code_12,Healthcare Provider Primary Taxonomy Switch_12,Healthcare Provider Taxonomy Code_13,Provider License Number_13,Provider License Number State Code_13,Healthcare Provider Primary Taxonomy Switch_13,Healthcare Provider Taxonomy Code_14,Provider License Number_14,Provider License Number State Code_14,Healthcare Provider Primary Taxonomy Switch_14,Healthcare Provider Taxonomy Code_15,Provider License Number_15,Provider License Number State Code_15,Healthcare Provider Primary Taxonomy Switch_15,Other Provider Identifier_1,Other Provider Identifier Type Code_1,Other Provider Identifier State_1,Other Provider Identifier Issuer_1,Other Provider Identifier_2,Other Provider Identifier Type Code_2,Other Provider Identifier State_2,Other Provider Identifier Issuer_2,Other Provider Identifier_3,Other Provider Identifier Type Code_3,Other Provider Identifier State_3,Other Provider Identifier Issuer_3,Other Provider Identifier_4,Other Provider Identifier Type Code_4,Other Provider Identifier State_4,Other Provider Identifier Issuer_4,Other Provider Identifier_5,Other Provider Identifier Type Code_5,Other Provider Identifier State_5,Other Provider Identifier Issuer_5,Other Provider Identifier_6,Other Provider Identifier Type Code_6,Other Provider Identifier State_6,Other Provider Identifier Issuer_6,Other Provider Identifier_7,Other Provider Identifier Type Code_7,Other Provider Identifier State_7,Other Provider Identifier Issuer_7,Other Provider Identifier_8,Other Provider Identifier Type Code_8,Other Provider Identifier State_8,Other Provider Identifier Issuer_8,Other Provider Identifier_9,Other Provider Identifier Type Code_9,Other Provider Identifier State_9,Other Provider Identifier Issuer_9,Other Provider Identifier_10,Other Provider Identifier Type Code_10,Other Provider Identifier State_10,Other Provider Identifier Issuer_10,Other Provider Identifier_11,Other Provider Identifier Type Code_11,Other Provider Identifier State_11,Other Provider Identifier Issuer_11,Other Provider Identifier_12,Other Provider Identifier Type Code_12,Other Provider Identifier State_12,Other Provider Identifier Issuer_12,Other Provider Identifier_13,Other Provider Identifier Type Code_13,Other Provider Identifier State_13,Other Provider Identifier Issuer_13,Other Provider Identifier_14,Other Provider Identifier Type Code_14,Other Provider Identifier State_14,Other Provider Identifier Issuer_14,Other Provider Identifier_15,Other Provider Identifier Type Code_15,Other Provider Identifier State_15,Other Provider Identifier Issuer_15,Other Provider Identifier_16,Other Provider Identifier Type Code_16,Other Provider Identifier State_16,Other Provider Identifier Issuer_16,Other Provider Identifier_17,Other Provider Identifier Type Code_17,Other Provider Identifier State_17,Other Provider Identifier Issuer_17,Other Provider Identifier_18,Other Provider Identifier Type Code_18,Other Provider Identifier State_18,Other Provider Identifier Issuer_18,Other Provider Identifier_19,Other Provider Identifier Type Code_19,Other Provider Identifier State_19,Other Provider Identifier Issuer_19,Other Provider Identifier_20,Other Provider Identifier Type Code_20,Other Provider Identifier State_20,Other Provider Identifier Issuer_20,Other Provider Identifier_21,Other Provider Identifier Type Code_21,Other Provider Identifier State_21,Other Provider Identifier Issuer_21,Other Provider Identifier_22,Other Provider Identifier Type Code_22,Other Provider Identifier State_22,Other Provider Identifier Issuer_22,Other Provider Identifier_23,Other Provider Identifier Type Code_23,Other Provider Identifier State_23,Other Provider Identifier Issuer_23,Other Provider Identifier_24,Other Provider Identifier Type Code_24,Other Provider Identifier State_24,Other Provider Identifier Issuer_24,Other Provider Identifier_25,Other Provider Identifier Type Code_25,Other Provider Identifier State_25,Other Provider Identifier Issuer_25,Other Provider Identifier_26,Other Provider Identifier Type Code_26,Other Provider Identifier State_26,Other Provider Identifier Issuer_26,Other Provider Identifier_27,Other Provider Identifier Type Code_27,Other Provider Identifier State_27,Other Provider Identifier Issuer_27,Other Provider Identifier_28,Other Provider Identifier Type Code_28,Other Provider Identifier State_28,Other Provider Identifier Issuer_28,Other Provider Identifier_29,Other Provider Identifier Type Code_29,Other Provider Identifier State_29,Other Provider Identifier Issuer_29,Other Provider Identifier_30,Other Provider Identifier Type Code_30,Other Provider Identifier State_30,Other Provider Identifier Issuer_30,Other Provider Identifier_31,Other Provider Identifier Type Code_31,Other Provider Identifier State_31,Other Provider Identifier Issuer_31,Other Provider Identifier_32,Other Provider Identifier Type Code_32,Other Provider Identifier State_32,Other Provider Identifier Issuer_32,Other Provider Identifier_33,Other Provider Identifier Type Code_33,Other Provider Identifier State_33,Other Provider Identifier Issuer_33,Other Provider Identifier_34,Other Provider Identifier Type Code_34,Other Provider Identifier State_34,Other Provider Identifier Issuer_34,Other Provider Identifier_35,Other Provider Identifier Type Code_35,Other Provider Identifier State_35,Other Provider Identifier Issuer_35,Other Provider Identifier_36,Other Provider Identifier Type Code_36,Other Provider Identifier State_36,Other Provider Identifier Issuer_36,Other Provider Identifier_37,Other Provider Identifier Type Code_37,Other Provider Identifier State_37,Other Provider Identifier Issuer_37,Other Provider Identifier_38,Other Provider Identifier Type Code_38,Other Provider Identifier State_38,Other Provider Identifier Issuer_38,Other Provider Identifier_39,Other Provider Identifier Type Code_39,Other Provider Identifier State_39,Other Provider Identifier Issuer_39,Other Provider Identifier_40,Other Provider Identifier Type Code_40,Other Provider Identifier State_40,Other Provider Identifier Issuer_40,Other Provider Identifier_41,Other Provider Identifier Type Code_41,Other Provider Identifier State_41,Other Provider Identifier Issuer_41,Other Provider Identifier_42,Other Provider Identifier Type Code_42,Other Provider Identifier State_42,Other Provider Identifier Issuer_42,Other Provider Identifier_43,Other Provider Identifier Type Code_43,Other Provider Identifier State_43,Other Provider Identifier Issuer_43,Other Provider Identifier_44,Other Provider Identifier Type Code_44,Other Provider Identifier State_44,Other Provider Identifier Issuer_44,Other Provider Identifier_45,Other Provider Identifier Type Code_45,Other Provider Identifier State_45,Other Provider Identifier Issuer_45,Other Provider Identifier_46,Other Provider Identifier Type Code_46,Other Provider Identifier State_46,Other Provider Identifier Issuer_46,Other Provider Identifier_47,Other Provider Identifier Type Code_47,Other Provider Identifier State_47,Other Provider Identifier Issuer_47,Other Provider Identifier_48,Other Provider Identifier Type Code_48,Other Provider Identifier State_48,Other Provider Identifier Issuer_48,Other Provider Identifier_49,Other Provider Identifier Type Code_49,Other Provider Identifier State_49,Other Provider Identifier Issuer_49,Other Provider Identifier_50,Other Provider Identifier Type Code_50,Other Provider Identifier State_50,Other Provider Identifier Issuer_50,Is Sole Proprietor,Is Organization Subpart,Parent Organization LBN,Parent Organization TIN,Authorized Official Name Prefix Text,Authorized Official Name Suffix Text,Authorized Official Credential Text,Healthcare Provider Taxonomy Group_1,Healthcare Provider Taxonomy Group_2,Healthcare Provider Taxonomy Group_3,Healthcare Provider Taxonomy Group_4,Healthcare Provider Taxonomy Group_5,Healthcare Provider Taxonomy Group_6,Healthcare Provider Taxonomy Group_7,Healthcare Provider Taxonomy Group_8,Healthcare Provider Taxonomy Group_9,Healthcare Provider Taxonomy Group_10,Healthcare Provider Taxonomy Group_11,Healthcare Provider Taxonomy Group_12,Healthcare Provider Taxonomy Group_13,Healthcare Provider Taxonomy Group_14,Healthcare Provider Taxonomy Group_15',
        sample: '1234567890,1,,,"Sample PT Clinic",Smith,John,M,Dr.,,DPT,"Alternate Name",1,Johnson,Jane,A,Ms.,,PT,2,"123 Main St",,"Los Angeles",CA,90210,US,"555-123-4567","555-123-4568","456 Practice Blvd",,"Los Angeles",CA,90210,US,"555-987-6543","555-987-6544","05/15/2010","01/15/2023",,,,M,Johnson,Jane,A,"Practice Manager","555-555-1234","225100000X","12345",CA,Y,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,N,N,,,Dr.,,DPT,"Allopathic & Osteopathic Physicians","","","","","","","","","","","","","",""'
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
      },
      equipment_companies: {
        filename: 'equipment_companies_template.csv',
        headers: 'name,company_type,description,website,founded_year,employee_count,equipment_categories,product_lines,target_markets,certifications,address,city,state,zip_code,phone,email',
        sample: 'MedTech Solutions,Equipment Manufacturer,Leading PT equipment manufacturer,https://medtech.com,2005,150,"Exercise Equipment, Therapy Tables","ProFit Series, TherapyPro Line","Clinics, Hospitals","FDA, ISO 13485",123 Tech Blvd,Austin,TX,78701,555-9876,sales@medtech.com'
      },
      consultant_companies: {
        filename: 'consultant_companies_template.csv',
        headers: 'first_name,last_name,name,email,phone,company,title,consulting_categories,industries,territories,years_experience,city,state,zip_code,website,linkedin_url,certifications',
        sample: 'Jane,Doe,Doe Consulting,jane.doe@consulting.com,555-3456,Healthcare Consulting Solutions,Senior Consultant,"Human Resources, Recruiting - Travel PT","Healthcare, PT Clinics","West Coast, Southwest",8,San Francisco,CA,94102,https://consultingexpert.com,https://linkedin.com/in/janedoe,"Certified Consultant, Healthcare Specialist"'
      },
      pe_firms: {
        filename: 'pe_firms_template.csv',
        headers: 'name,firm_type,description,website,founded_year,total_aum,healthcare_focus,investment_stage,typical_deal_size_min,typical_deal_size_max,geographic_focus,sector_focus,portfolio_companies,address,city,state,phone,email',
        sample: 'HealthVest Partners,Private Equity,Healthcare-focused PE firm,https://healthvest.com,2015,2500000000,true,"Growth, Buyout",10000000,500000000,"North America, Europe","Healthcare Services, Medical Devices","ABC Therapy Group, MedTech Inc",100 Investment St,New York,NY,555-7890,info@healthvest.com'
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