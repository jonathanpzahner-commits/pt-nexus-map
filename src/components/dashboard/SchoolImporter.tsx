import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, Upload } from 'lucide-react';

export const SchoolImporter = () => {
  const [importProgress, setImportProgress] = useState(0);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('import-schools-with-locations');

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.successful} schools, ${data.failed} failed`,
      });
      setImportProgress(100);
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImport = () => {
    importMutation.mutate();
    
    // Simulate progress for better UX
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setImportProgress(progress);
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Physical Therapy Schools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            This will import a comprehensive list of physical therapy schools across the United States 
            with automatically determined city and state information.
          </AlertDescription>
        </Alert>

        {importMutation.isPending && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Importing schools...</span>
              <span>{importProgress}%</span>
            </div>
            <Progress value={importProgress} className="w-full" />
          </div>
        )}

        <Button 
          onClick={handleImport}
          disabled={importMutation.isPending}
          className="w-full"
        >
          {importMutation.isPending ? 'Importing Schools...' : 'Import Schools Database'}
        </Button>
      </CardContent>
    </Card>
  );
};