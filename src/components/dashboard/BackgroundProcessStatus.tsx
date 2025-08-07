import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, MapPin, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BackgroundProcessStatus = () => {
  const { data: schoolStats } = useQuery({
    queryKey: ['school-processing-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('description, accreditation, tuition_per_year');
      
      if (error) throw error;
      
      const total = data.length;
      const remaining = data.filter(school => 
        !school.description || !school.accreditation || !school.tuition_per_year
      ).length;
      
      return { total, remaining, completed: total - remaining };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: providerStats } = useQuery({
    queryKey: ['provider-processing-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('latitude, longitude');
      
      if (error) throw error;
      
      const total = data.length;
      const remaining = data.filter(provider => 
        !provider.latitude || !provider.longitude
      ).length;
      
      return { total, remaining, completed: total - remaining };
    },
    refetchInterval: 30000,
  });

  const calculateETA = (remaining: number, processingRate: number) => {
    if (remaining === 0) return "Complete";
    
    const minutesRemaining = Math.ceil(remaining / processingRate * 5); // 5-minute intervals
    const hours = Math.floor(minutesRemaining / 60);
    const minutes = minutesRemaining % 60;
    
    if (hours > 0) {
      return `~${hours}h ${minutes}m`;
    }
    return `~${minutes}m`;
  };

  const schoolProcessingRate = 10; // 10 schools per 5-minute interval
  const providerProcessingRate = 20; // 20 providers per 5-minute interval

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Background Processing Status
        </CardTitle>
        <CardDescription>
          Automated enrichment is running every 5 minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* School Enrichment */}
        {schoolStats && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">School Data Enrichment</span>
              </div>
              <Badge variant={schoolStats.remaining === 0 ? "default" : "secondary"}>
                ETA: {calculateETA(schoolStats.remaining, schoolProcessingRate)}
              </Badge>
            </div>
            <Progress 
              value={(schoolStats.completed / schoolStats.total) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{schoolStats.completed} / {schoolStats.total} completed</span>
              <span>{schoolStats.remaining} remaining</span>
            </div>
          </div>
        )}

        {/* Provider Geocoding */}
        {providerStats && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Provider Geocoding</span>
              </div>
              <Badge variant={providerStats.remaining === 0 ? "default" : "secondary"}>
                ETA: {calculateETA(providerStats.remaining, providerProcessingRate)}
              </Badge>
            </div>
            <Progress 
              value={(providerStats.completed / providerStats.total) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{providerStats.completed} / {providerStats.total} completed</span>
              <span>{providerStats.remaining} remaining</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Processing 10 schools & 20 providers every 5 minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundProcessStatus;