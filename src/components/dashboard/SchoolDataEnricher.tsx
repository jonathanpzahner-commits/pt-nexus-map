import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Database, CheckCircle2 } from 'lucide-react';

export const SchoolDataEnricher = () => {
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const { toast } = useToast();

  // Get schools that need enrichment (missing description/accreditation/etc)
  const { data: schoolsNeedingEnrichment, isLoading } = useQuery({
    queryKey: ['schools-needing-enrichment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, city, state, description, accreditation')
        .or('description.is.null,accreditation.is.null')
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const enrichmentMutation = useMutation({
    mutationFn: async (schoolIds: string[]) => {
      const { data, error } = await supabase.functions.invoke('enrich-school-data', {
        body: { schoolIds }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Enrichment Complete",
        description: `Successfully enriched ${data.enriched} schools`,
      });
      setEnrichmentProgress(100);
    },
    onError: (error) => {
      toast({
        title: "Enrichment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleEnrichment = () => {
    if (!schoolsNeedingEnrichment?.length) return;
    
    const schoolIds = schoolsNeedingEnrichment.map(school => school.id);
    enrichmentMutation.mutate(schoolIds);
    
    // Simulate progress for better UX
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEnrichmentProgress(progress);
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          School Data Enrichment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schoolsNeedingEnrichment && schoolsNeedingEnrichment.length > 0 ? (
          <>
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                Found {schoolsNeedingEnrichment.length} schools that could benefit from data enrichment.
                We can automatically gather information like accreditation, tuition, program details, and more.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Schools to enrich:
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {schoolsNeedingEnrichment.slice(0, 10).map(school => (
                  <div key={school.id} className="text-sm p-2 bg-muted rounded">
                    {school.name} - {school.city}, {school.state}
                  </div>
                ))}
                {schoolsNeedingEnrichment.length > 10 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {schoolsNeedingEnrichment.length - 10} more
                  </div>
                )}
              </div>
            </div>

            {enrichmentMutation.isPending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Enriching school data...</span>
                  <span>{enrichmentProgress}%</span>
                </div>
                <Progress value={enrichmentProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleEnrichment}
              disabled={enrichmentMutation.isPending}
              className="w-full"
            >
              {enrichmentMutation.isPending ? 'Enriching Data...' : 'Enrich School Data'}
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              All schools have complete data! No enrichment needed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};