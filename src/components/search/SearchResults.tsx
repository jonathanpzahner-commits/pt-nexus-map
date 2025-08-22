import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, GraduationCap, Users, Briefcase, MapPin, ExternalLink, Star } from 'lucide-react';
import { SearchResult } from '@/hooks/useSearch';
import { NotesSection } from '@/components/notes/NotesSection';
import { useState } from 'react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults = ({ results, isLoading }: SearchResultsProps) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'company':
        return <Building2 className="h-4 w-4 text-blue-500" />;
      case 'school':
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'provider':
        return <Users className="h-4 w-4 text-amber-500" />;
      case 'job_listing':
        return <Briefcase className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeBadgeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'company':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'school':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'provider':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'job_listing':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formatEntityType = (type: SearchResult['type']) => {
    switch (type) {
      case 'company':
        return 'Company';
      case 'school':
        return 'School';
      case 'provider':
        return 'Provider';
      case 'job_listing':
        return 'Job';
    }
  };

  const renderEntityDetails = (result: SearchResult) => {
    const { data, type } = result;
    
    switch (type) {
      case 'company':
        return (
          <div className="space-y-2 text-sm">
            {data.services && data.services.length > 0 && (
              <div>
                <span className="font-medium">Services: </span>
                <span className="text-muted-foreground">{data.services.join(', ')}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Company Size: </span>
              <span className="text-muted-foreground">{data.company_size_range || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-medium">Number of Clinics: </span>
              <span className="text-muted-foreground">{data.number_of_clinics || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-medium">Parent Company: </span>
              <span className="text-muted-foreground">{data.parent_company || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-medium">PE Backed: </span>
              {data.pe_backed ? (
                <div className="inline-flex flex-col">
                  <span className="text-muted-foreground">Yes</span>
                  {data.pe_firm_name && (
                    <span className="text-xs text-muted-foreground">
                      by {data.pe_firm_name}
                      {data.pe_relationship_start_date && ` (since ${new Date(data.pe_relationship_start_date).getFullYear()})`}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">No</span>
              )}
            </div>
            {data.leadership && Object.keys(data.leadership).length > 0 && (
              <div>
                <span className="font-medium">Leadership: </span>
                <div className="mt-1 space-y-1">
                  {Object.entries(data.leadership).map(([key, value]) => {
                    if (!value) return null;
                    const leadershipLabels = {
                      owner_ceo: 'Owner/CEO',
                      financial: 'Financial',
                      operations: 'Operations',
                      clinical_excellence: 'Clinical Excellence',
                      technology: 'Technology',
                      hr_recruitment: 'HR/Recruitment',
                      sales_marketing: 'Sales/Marketing',
                      facilities: 'Facilities'
                    };
                    return (
                      <div key={key} className="text-xs text-muted-foreground">
                        <span className="font-medium">{leadershipLabels[key as keyof typeof leadershipLabels] || key}:</span> {String(value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {data.founded_year && (
              <div>
                <span className="font-medium">Founded: </span>
                <span className="text-muted-foreground">{data.founded_year}</span>
              </div>
            )}
            {(data.glassdoor_rating || data.glassdoor_url) && (
              <div>
                <span className="font-medium">Glassdoor: </span>
                {data.glassdoor_rating && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {data.glassdoor_rating}/5
                  </span>
                )}
                {data.glassdoor_url && (
                  <a 
                    href={data.glassdoor_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline ml-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Reviews
                  </a>
                )}
              </div>
            )}
            {data.website && (
              <div>
                <a 
                  href={data.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit Website
                </a>
              </div>
            )}
          </div>
        );
      
      case 'school':
        return (
          <div className="space-y-2 text-sm">
            {data.programs_offered && data.programs_offered.length > 0 && (
              <div>
                <span className="font-medium">Programs: </span>
                <span className="text-muted-foreground">{data.programs_offered.join(', ')}</span>
              </div>
            )}
            {data.tuition_per_year && (
              <div>
                <span className="font-medium">Tuition: </span>
                <span className="text-muted-foreground">${data.tuition_per_year.toLocaleString()}/year</span>
              </div>
            )}
            {data.program_length_months && (
              <div>
                <span className="font-medium">Program Length: </span>
                <span className="text-muted-foreground">{data.program_length_months} months</span>
              </div>
            )}
            {data.accreditation && (
              <div>
                <span className="font-medium">Accreditation: </span>
                <span className="text-muted-foreground">{data.accreditation}</span>
              </div>
            )}
          </div>
        );
      
      case 'provider':
        return (
          <div className="space-y-2 text-sm">
            {data.specializations && data.specializations.length > 0 && (
              <div>
                <span className="font-medium">Specializations: </span>
                <span className="text-muted-foreground">{data.specializations.join(', ')}</span>
              </div>
            )}
            {data.years_experience && (
              <div>
                <span className="font-medium">Experience: </span>
                <span className="text-muted-foreground">{data.years_experience} years</span>
              </div>
            )}
            {data.license_number && (
              <div>
                <span className="font-medium">License: </span>
                <span className="text-muted-foreground">{data.license_number} ({data.license_state})</span>
              </div>
            )}
            {data.email && (
              <div>
                <a 
                  href={`mailto:${data.email}`}
                  className="text-primary hover:underline"
                >
                  {data.email}
                </a>
              </div>
            )}
          </div>
        );
      
      case 'job_listing':
        return (
          <div className="space-y-2 text-sm">
            {data.company_name && (
              <div>
                <span className="font-medium">Company: </span>
                <span className="text-muted-foreground">{data.company_name}</span>
              </div>
            )}
            {data.salary_min && data.salary_max && (
              <div>
                <span className="font-medium">Salary: </span>
                <span className="text-muted-foreground">
                  ${data.salary_min.toLocaleString()} - ${data.salary_max.toLocaleString()}
                </span>
              </div>
            )}
            {data.experience_level && (
              <div>
                <span className="font-medium">Experience Level: </span>
                <span className="text-muted-foreground">{data.experience_level}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {data.is_remote && (
                <Badge variant="secondary" className="text-xs">Remote</Badge>
              )}
              {data.source && data.source !== 'internal' && (
                <Badge variant="outline" className="text-xs">
                  {data.source === 'indeed' ? 'Indeed' : data.source}
                </Badge>
              )}
            </div>
            {data.external_url && (
              <div>
                <button
                  onClick={() => window.open(data.external_url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  Apply on {data.source === 'indeed' ? 'Indeed' : 'External Site'}
                </button>
              </div>
            )}
            {data.requirements && (
              <div>
                <span className="font-medium">Requirements: </span>
                <span className="text-muted-foreground">{data.requirements}</span>
              </div>
            )}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">No results found</div>
            <div className="text-sm">Try adjusting your search terms or filters</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        const isExpanded = expandedResults.has(result.id);
        
        return (
          <Card key={result.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(result.type)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeBadgeColor(result.type)}`}
                    >
                      {formatEntityType(result.type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {result.subtitle}
                  </div>
                  {result.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {result.location}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(result.id)}
                >
                  {isExpanded ? 'Less' : 'More'}
                </Button>
              </div>
              {result.description && !isExpanded && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              )}
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pt-0 space-y-4">
                {result.description && (
                  <p className="text-sm">{result.description}</p>
                )}
                
                {renderEntityDetails(result)}
                
                <NotesSection
                  entityType={result.type}
                  entityId={result.id}
                  entityName={result.title}
                />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};