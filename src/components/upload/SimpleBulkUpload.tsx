import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Download, CheckCircle, XCircle, Clock, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface SimpleBulkUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

interface SheetInfo {
  name: string;
  rowCount: number;
  selected: boolean;
}

export function SimpleBulkUpload({ open, onOpenChange, onUploadComplete }: SimpleBulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'processing' | 'completed' | 'failed'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeExcelFile = async (file: File) => {
    setStatus('analyzing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      setWorkbook(wb);
      
      const sheetInfos: SheetInfo[] = wb.SheetNames.map(name => {
        const ws = wb.Sheets[name];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        return {
          name,
          rowCount: Math.max(0, data.length - 1), // Subtract header row
          selected: true // Select all by default
        };
      });
      
      setSheets(sheetInfos);
      setTotalRecords(sheetInfos.reduce((sum, sheet) => sum + sheet.rowCount, 0));
      setStatus('idle');
      
      toast({
        title: "File analyzed",
        description: `Found ${sheetInfos.length} sheets with ${sheetInfos.reduce((sum, s) => sum + s.rowCount, 0)} total records.`
      });
    } catch (err) {
      setError(`Failed to analyze file: ${err.message}`);
      setStatus('failed');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setSheets([]);
        setWorkbook(null);
        
        // If it's Excel, analyze the sheets
        if (selectedFile.name.endsWith('.xlsx')) {
          await analyzeExcelFile(selectedFile);
        } else {
          // For CSV, create a single sheet entry
          setSheets([{ name: 'CSV Data', rowCount: 0, selected: true }]);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel (.xlsx) or CSV (.csv) file.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleSheetSelection = (sheetIndex: number) => {
    setSheets(prev => prev.map((sheet, index) => 
      index === sheetIndex ? { ...sheet, selected: !sheet.selected } : sheet
    ));
  };

  const selectAllSheets = () => {
    setSheets(prev => prev.map(sheet => ({ ...sheet, selected: true })));
  };

  const deselectAllSheets = () => {
    setSheets(prev => prev.map(sheet => ({ ...sheet, selected: false })));
  };

  const processMultipleSheets = async (): Promise<any[]> => {
    const allRecords: any[] = [];
    const selectedSheets = sheets.filter(sheet => sheet.selected);
    
    if (file?.name.endsWith('.csv')) {
      // Handle CSV file
      const text = await file.text();
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
    }
    
    // Handle Excel file with multiple sheets
    for (const sheetInfo of selectedSheets) {
      if (!workbook) continue;
      
      const worksheet = workbook.Sheets[sheetInfo.name];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        raw: false,
        blankrows: false
      });
      
      // Add sheet name to each record for tracking
      const recordsWithSheet = sheetData.map((record: any) => ({
        ...record,
        _sourceSheet: sheetInfo.name
      }));
      
      allRecords.push(...recordsWithSheet);
    }
    
    return allRecords;
  };

  const validateAndInsertProviders = async (records: any[]): Promise<{ successful: number; failed: number; errors: string[]; bySheet: any }> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];
    const bySheet: any = {};
    const batchSize = 100;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const validRecords = [];
      
      for (const record of batch) {
        const sourceSheet = record._sourceSheet || 'Unknown';
        if (!bySheet[sourceSheet]) {
          bySheet[sourceSheet] = { successful: 0, failed: 0 };
        }
        
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
            source: 'NPI Database',
            // Note: latitude/longitude will be auto-populated by trigger
          };

          // Only add if we have at least a name
          if (provider.name && provider.name.trim()) {
            validRecords.push({ ...provider, _sourceSheet: sourceSheet });
          }
        } catch (err) {
          failed++;
          bySheet[sourceSheet].failed++;
          errors.push(`${sourceSheet} - Row ${i + 1}: ${err.message}`);
        }
      }
      
      if (validRecords.length > 0) {
        try {
          // Remove _sourceSheet before inserting to database
          const cleanRecords = validRecords.map(({ _sourceSheet, ...record }) => record);
          
          const { error } = await supabase
            .from('providers')
            .insert(cleanRecords);
          
          if (error) {
            failed += validRecords.length;
            validRecords.forEach(record => {
              bySheet[record._sourceSheet].failed++;
            });
            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
          } else {
            successful += validRecords.length;
            validRecords.forEach(record => {
              bySheet[record._sourceSheet].successful++;
            });
            
            // Auto-geocoding will happen via database triggers
            console.log(`Inserted ${validRecords.length} providers - geocoding will happen automatically`);
          }
        } catch (err) {
          failed += validRecords.length;
          validRecords.forEach(record => {
            bySheet[record._sourceSheet].failed++;
          });
          errors.push(`Batch ${Math.floor(i/batchSize) + 1}: Database error`);
        }
      }
      
      setProcessedRecords(prev => prev + batch.length);
      setProgress(Math.round(((i + batchSize) / records.length) * 100));
    }
    
    return { successful, failed, errors, bySheet };
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const selectedSheets = sheets.filter(sheet => sheet.selected);
    if (selectedSheets.length === 0) {
      toast({
        title: "No sheets selected",
        description: "Please select at least one sheet to process.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    setStatus('processing');
    setProgress(0);
    setProcessedRecords(0);
    setError(null);
    
    try {
      // Process selected sheets
      const records = await processMultipleSheets();
      
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
          description: `Successfully imported ${result.successful} providers from ${selectedSheets.length} sheet(s).`
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
    setWorkbook(null);
    setSheets([]);
    setStatus('idle');
    setProgress(0);
    setProcessedRecords(0);
    setTotalRecords(0);
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
      case 'analyzing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Multi-Sheet Bulk Upload - Providers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">{/* file */}
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
                <div className="space-y-2">
                  <div>Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                  {sheets.length > 1 && (
                    <div className="text-sm text-gray-600">
                      Found {sheets.length} sheets with {totalRecords} total records
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Sheet Selection */}
          {sheets.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Select Sheets to Process
                </h3>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={selectAllSheets}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllSheets}>
                    Deselect All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {sheets.map((sheet, index) => (
                  <div key={sheet.name} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={sheet.selected}
                      onCheckedChange={() => toggleSheetSelection(index)}
                      disabled={uploading}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{sheet.name}</div>
                      <div className="text-xs text-gray-500">{sheet.rowCount} records</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Display */}
          {status !== 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-medium">
                  {status === 'analyzing' && 'Analyzing file...'}
                  {status === 'processing' && `Processing... (${processedRecords}/${totalRecords} records)`}
                  {status === 'completed' && 'Upload Completed'}
                  {status === 'failed' && 'Upload Failed'}
                </span>
              </div>
              
              {(uploading || status === 'analyzing') && (
                <Progress value={progress} className="w-full" />
              )}
            </div>
          )}

          {/* Results */}
          {results && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Overall Results:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>✅ Successful: {results.successful}</div>
                    <div>❌ Failed: {results.failed}</div>
                  </div>
                  
                  {results.bySheet && Object.keys(results.bySheet).length > 1 && (
                    <div className="mt-3">
                      <div className="font-medium text-sm mb-2">Results by Sheet:</div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(results.bySheet).map(([sheetName, stats]: [string, any]) => (
                          <div key={sheetName} className="flex justify-between">
                            <span className="truncate">{sheetName}:</span>
                            <span>✅{stats.successful} ❌{stats.failed}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">View Errors ({results.errors.length})</summary>
                      <div className="mt-1 text-sm text-red-600 max-h-32 overflow-y-auto">
                        {results.errors.slice(0, 10).map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                        {results.errors.length > 10 && (
                          <div>... and {results.errors.length - 10} more errors</div>
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
              disabled={!file || uploading || sheets.filter(s => s.selected).length === 0}
              className="flex-1"
            >
              {uploading ? 'Processing...' : 
               sheets.length > 1 ? `Upload ${sheets.filter(s => s.selected).length} Sheet(s)` : 
               'Upload & Process'}
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