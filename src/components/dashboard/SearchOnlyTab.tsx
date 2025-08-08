import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search } from 'lucide-react';
import { GlobalSearch } from '../search/GlobalSearch';

interface SearchOnlyTabProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const SearchOnlyTab = ({ title, description, icon: Icon }: SearchOnlyTabProps) => {
  // Determine entity types based on title
  const getEntityTypesFromTitle = (title: string): string[] => {
    if (title.includes('Physical Therapists')) return ['providers'];
    if (title.includes('Companies')) return ['companies', 'consultant_companies', 'equipment_companies'];
    if (title.includes('Education')) return ['schools'];
    if (title.includes('Job')) return ['job_listings'];
    return ['companies', 'schools', 'providers', 'job_listings'];
  };

  const entityTypes = getEntityTypesFromTitle(title);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              <strong>Focused Search:</strong> This section is pre-filtered to show only {title.toLowerCase()}. 
              Use the search and filters below to find exactly what you need.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Focused Search with Pre-filtered Context */}
      <div className="space-y-4">
        <GlobalSearch contextTypes={entityTypes} />
      </div>
    </div>
  );
};