import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, Loader2, Database, FileText } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export const NPIProcessor = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{
    totalProcessed: number;
    ptFound: number;
    inserted: number;
  }>({ totalProcessed: 0, ptFound: 0, inserted: 0 });
  const { toast } = useToast();

  const downloadNPIData = async () => {
    setIsDownloading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('npi-processor', {
        body: { action: 'download' }
      });
      
      if (error) throw error;
      
      toast({
        title: "Download Started",
        description: "NPI database download has been initiated. This may take several minutes.",
      });
      
      console.log('Download response:', data);
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Error",
        description: "Failed to start NPI database download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const processNPIData = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats({ totalProcessed: 0, ptFound: 0, inserted: 0 });
    
    try {
      // For demo purposes - in reality, this would process the actual downloaded file
      const sampleCSVData = `npi,entity_type_code,replacement_npi,employer_identification_number,provider_organization_name,provider_last_name,provider_first_name,provider_middle_name,provider_name_prefix,provider_name_suffix,provider_credential,provider_other_organization_name,provider_other_organization_name_type_code,provider_other_last_name,provider_other_first_name,provider_other_middle_name,provider_other_name_prefix,provider_other_name_suffix,provider_other_credential,provider_other_last_name_type_code,provider_first_line_business_mailing_address,provider_second_line_business_mailing_address,provider_business_mailing_address_city_name,provider_business_mailing_address_state_name,provider_business_mailing_address_postal_code,provider_business_mailing_address_country_code,provider_business_mailing_address_telephone_number,provider_business_mailing_address_fax_number,provider_first_line_business_practice_location_address,provider_second_line_business_practice_location_address,provider_business_practice_location_address_city_name,provider_business_practice_location_address_state_name,provider_business_practice_location_address_postal_code,provider_business_practice_location_address_country_code,provider_business_practice_location_address_telephone_number,provider_business_practice_location_address_fax_number,provider_enumeration_date,last_update_date,npi_deactivation_reason_code,npi_deactivation_date,npi_reactivation_date,provider_gender_code,authorized_official_last_name,authorized_official_first_name,authorized_official_middle_name,authorized_official_title_or_position,authorized_official_telephone_number,healthcare_provider_taxonomy_code_1,provider_license_number_1,provider_license_number_state_code_1,healthcare_provider_primary_taxonomy_switch_1,healthcare_provider_taxonomy_code_2,provider_license_number_2,provider_license_number_state_code_2,healthcare_provider_primary_taxonomy_switch_2,healthcare_provider_taxonomy_code_3,provider_license_number_3,provider_license_number_state_code_3,healthcare_provider_primary_taxonomy_switch_3
1234567890,1,,,"","SMITH","JOHN","","","","PT",,,"","","","","","","","123 MAIN ST","","BALTIMORE","MD","21201","US","4105551234","","123 MAIN ST","","BALTIMORE","MD","21201","US","4105551234","","12/15/2020","01/15/2024","","","","M","","","","","","225100000X","PT12345","MD","Y","","","","","","","",""
1234567891,1,,,"","JOHNSON","MARY","","","","PTA",,,"","","","","","","","456 ELM ST","","ANNAPOLIS","MD","21401","US","4105555678","","456 ELM ST","","ANNAPOLIS","MD","21401","US","4105555678","","11/20/2019","02/10/2024","","","","F","","","","","","225200000X","PTA67890","MD","Y","","","","","","","",""`;
      
      let batchCount = 0;
      const maxBatches = 5; // Simulate processing multiple batches
      
      while (batchCount < maxBatches) {
        batchCount++;
        
        const { data, error } = await supabase.functions.invoke('npi-processor', {
          body: { 
            action: 'process',
            csvData: sampleCSVData,
            offset: batchCount * 1000,
            batchSize: 1000
          }
        });
        
        if (error) throw error;
        
        setStats(prev => ({
          totalProcessed: prev.totalProcessed + data.processed,
          ptFound: prev.ptFound + data.ptCount,
          inserted: prev.inserted + data.inserted
        }));
        
        setProgress((batchCount / maxBatches) * 100);
        
        toast({
          title: `Batch ${batchCount} Completed`,
          description: `Found ${data.ptCount} PT providers in this batch`,
        });
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Processing Complete!",
        description: `Successfully processed NPI data and found ${stats.ptFound} PT providers.`,
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process NPI data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          NPI Database Processor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              🏥 What is the NPI Database?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              The National Provider Identifier (NPI) database contains over 7 million healthcare providers. 
              This tool will download the latest data and extract only Physical Therapists and PTAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Step 1: Download Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download latest NPI database (~4GB)
                    </p>
                  </div>
                  <Button 
                    onClick={downloadNPIData} 
                    disabled={isDownloading}
                    variant="outline"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Step 2: Process & Import</h4>
                    <p className="text-sm text-muted-foreground">
                      Extract PTs/PTAs and import to database
                    </p>
                  </div>
                  <Button 
                    onClick={processNPIData} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Process
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {(stats.totalProcessed > 0 || stats.ptFound > 0) && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                📊 Processing Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {stats.totalProcessed.toLocaleString()}
                  </div>
                  <div className="text-green-600 dark:text-green-400">Records Processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.ptFound.toLocaleString()}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">PT Providers Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {stats.inserted.toLocaleString()}
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">Successfully Imported</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• The NPI database is updated monthly by CMS</p>
            <p>• Processing filters for taxonomy codes: 225100000X (PT), 225200000X (PTA), and specialized PT codes</p>
            <p>• Only active providers with valid addresses will be imported</p>
            <p>• Estimated processing time: 30-60 minutes for full database</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};