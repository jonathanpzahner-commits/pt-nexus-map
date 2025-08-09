import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface SimpleBulkUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export function SimpleBulkUpload({ open, onOpenChange, onUploadComplete }: SimpleBulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setStatus('idle');
        setError(null);
        setResults(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel (.xlsx) or CSV (.csv) file.",
          variant: "destructive"
        });
      }
    }
  };

  const processFileDirectly = async (file: File): Promise<any[]> => {
    const arrayBuffer = await file.arrayBuffer();
    
    if (file.name.endsWith('.csv')) {
      const text = new TextDecoder().decode(arrayBuffer);
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const record: any = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            record[header] = values[index];
          }
        });
        return record;
      });
    } else {
      // Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      
      return XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        raw: false,
        blankrows: false
      });
    }
  };

  const validateAndInsertProviders = async (records: any[]): Promise<{ successful: number; failed: number; errors: string[] }> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];
    const batchSize = 100;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const validRecords = [];
      
      for (const record of batch) {
        try {
          // Map NPI fields to our provider schema
          const provider = {
            name: record['Provider Organization Name (Legal Business Name)'] || 
                  `${record['Provider First Name'] || ''} ${record['Provider Last Name (Legal Name)'] || ''}`.trim(),
            first_name: record['Provider First Name'] || null,
            last_name: record['Provider Last Name (Legal Name)'] || null,
            phone: record['Provider Business Practice Location Address Telephone Number'] || 
                   record['Provider Business Mailing Address Telephone Number'] || null,
            email: null, // NPI doesn't contain email
            city: record['Provider Business Practice Location Address City Name'] || 
                  record['Provider Business Mailing Address City Name'] || null,
            state: record['Provider Business Practice Location Address State Name'] || 
                   record['Provider Business Mailing Address State Name'] || null,
            zip_code: record['Provider Business Practice Location Address Postal Code'] || 
                      record['Provider Business Mailing Address Postal Code'] || null,
            specializations: record['Healthcare Provider Taxonomy Code_1'] ? [record['Healthcare Provider Taxonomy Code_1']] : [],
            license_number: record['Provider License Number_1'] || null,
            license_state: record['Provider License Number State Code_1'] || null,
            source: 'NPI Database'
          };

          // Only add if we have at least a name
          if (provider.name && provider.name.trim()) {
            validRecords.push(provider);
          }
        } catch (err) {
          failed++;
          errors.push(`Row ${i + 1}: ${err.message}`);
        }
      }
      
      if (validRecords.length > 0) {
        try {
          const { error } = await supabase
            .from('providers')
            .insert(validRecords);
          
          if (error) {
            failed += validRecords.length;
            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
          } else {
            successful += validRecords.length;
          }
        } catch (err) {
          failed += validRecords.length;
          errors.push(`Batch ${Math.floor(i/batchSize) + 1}: Database error`);
        }
      }
      
      setProgress(Math.round(((i + batchSize) / records.length) * 100));
    }
    
    return { successful, failed, errors };
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setStatus('processing');
    setProgress(0);
    setError(null);
    
    try {
      // Process file directly in browser
      const records = await processFileDirectly(file);
      
      if (records.length === 0) {
        throw new Error('No valid records found in file');
      }
      
      // Validate and insert records
      const result = await validateAndInsertProviders(records);
      
      setResults(result);
      setStatus(result.successful > 0 ? 'completed' : 'failed');
      setProgress(100);
      
      if (result.successful > 0) {
        toast({
          title: "Upload completed!",
          description: `Successfully imported ${result.successful} providers.`
        });
        onUploadComplete?.();
      } else {
        toast({
          title: "Upload failed",
          description: "No records were successfully imported.",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError(err.message);
      setStatus('failed');
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = 'NPI,Provider Organization Name (Legal Business Name),Provider First Name,Provider Last Name (Legal Name),Provider Business Practice Location Address City Name,Provider Business Practice Location Address State Name,Provider Business Practice Location Address Postal Code,Provider Business Practice Location Address Telephone Number,Healthcare Provider Taxonomy Code_1,Provider License Number_1,Provider License Number State Code_1';
    const sample = '1234567890,"Sample PT Clinic",John,Smith,"Los Angeles",CA,90210,"555-123-4567","225100000X",12345,CA';
    
    const csvContent = `${headers}\n${sample}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'providers_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetDialog();
      onOpenChange(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Simple Bulk Upload - Providers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download NPI Template
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>

          {file && (
            <Alert>
              <AlertDescription>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}

          {/* Status Display */}
          {status !== 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-medium">
                  {status === 'processing' && 'Processing...'}
                  {status === 'completed' && 'Upload Completed'}
                  {status === 'failed' && 'Upload Failed'}
                </span>
              </div>
              
              {uploading && (
                <Progress value={progress} className="w-full" />
              )}
            </div>
          )}

          {/* Results */}
          {results && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <div>✅ Successful: {results.successful}</div>
                  <div>❌ Failed: {results.failed}</div>
                  {results.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">View Errors</summary>
                      <div className="mt-1 text-sm text-red-600">
                        {results.errors.slice(0, 5).map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                        {results.errors.length > 5 && (
                          <div>... and {results.errors.length - 5} more errors</div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? 'Processing...' : 'Upload & Process'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              {uploading ? 'Processing...' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}