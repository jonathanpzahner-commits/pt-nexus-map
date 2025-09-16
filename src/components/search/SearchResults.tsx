import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, GraduationCap, Users, Briefcase, MapPin, ExternalLink, Star, Wrench, DollarSign, UserCheck } from 'lucide-react';
import { SearchResult } from '@/types/search';
import { supabase } from '@/integrations/supabase/client';
import { NotesSection } from '@/components/notes/NotesSection';
import { ContactUnlockButton } from '@/components/ui/contact-unlock-button';
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
      case 'consultant_company':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      case 'equipment_company':
        return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'pe_firm':
        return <DollarSign className="h-4 w-4 text-gray-500" />;
      case 'profile':
        return <Users className="h-4 w-4 text-pink-500" />;
      default:
        return <Building2 className="h-4 w-4 text-gray-500" />;
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
      case 'consultant_company':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'equipment_company':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pe_firm':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'profile':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'consultant_company':
        return 'Consultant';
      case 'equipment_company':
        return 'Equipment Vendor';
      case 'pe_firm':
        return 'PE Firm';
      case 'profile':
        return 'Profile';
      default:
        return 'Entity';
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
            {data.accreditation && (
              <div>
                <span className="font-medium">Accreditation: </span>
                <span className="text-muted-foreground">{data.accreditation}</span>
              </div>
            )}
            {data.dce_info && (
              <div>
                <span className="font-medium">DCE: </span>
                <span className="text-muted-foreground">{data.dce_info}</span>
              </div>
            )}
            {data.graduation_season && (
              <div>
                <span className="font-medium">Graduation Season: </span>
                <span className="text-muted-foreground">{data.graduation_season}</span>
              </div>
            )}
            {data.boards_timing && (
              <div>
                <span className="font-medium">Boards: </span>
                <span className="text-muted-foreground">{data.boards_timing}</span>
              </div>
            )}
            {data.career_fair_dates && data.career_fair_dates.length > 0 && (
              <div>
                <span className="font-medium">Career Fairs: </span>
                <span className="text-muted-foreground">{data.career_fair_dates.join(', ')}</span>
              </div>
            )}
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
            <ContactUnlockButton 
              entityId={data.id}
              entityType="provider"
              userId={data.user_id}
              hasContactInfo={!!(data.email || data.phone)}
              size="sm"
            />
          </div>
        );
      
      case 'job_listing':
        return (
          <div className="space-y-2 text-sm">
            {(data.company_name || data.company_id) && (
              <div>
                <span className="font-medium">Company: </span>
                {data.company_id ? (
                  <button
                    onClick={() => window.location.href = `/entity/companies/${data.company_id}`}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    {data.company_name || 'View Company Details'}
                  </button>
                ) : data.company_name ? (
                  <button
                    onClick={async () => {
                      // Search for company by name if no company_id
                      try {
                        const { data: companies } = await supabase
                          .from('companies')
                          .select('id')
                          .ilike('name', data.company_name)
                          .limit(1);
                        
                        if (companies && companies.length > 0) {
                          window.location.href = `/entity/companies/${companies[0].id}`;
                        } else {
                          // If no exact match, search for companies with that name
                          window.location.href = `/search?query=${encodeURIComponent(data.company_name)}&types=companies`;
                        }
                      } catch (error) {
                        console.error('Error finding company:', error);
                        // Fallback to search
                        window.location.href = `/search?query=${encodeURIComponent(data.company_name)}&types=companies`;
                      }
                    }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    {data.company_name}
                  </button>
                ) : null}
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
      
      case 'consultant_company':
        return (
          <div className="space-y-2 text-sm">
            {data.consulting_categories && data.consulting_categories.length > 0 && (
              <div>
                <span className="font-medium">Categories: </span>
                <span className="text-muted-foreground">{data.consulting_categories.join(', ')}</span>
              </div>
            )}
            {data.industries && data.industries.length > 0 && (
              <div>
                <span className="font-medium">Industries: </span>
                <span className="text-muted-foreground">{data.industries.join(', ')}</span>
              </div>
            )}
            {data.years_experience && (
              <div>
                <span className="font-medium">Experience: </span>
                <span className="text-muted-foreground">{data.years_experience} years</span>
              </div>
            )}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <span className="font-medium">Certifications: </span>
                <span className="text-muted-foreground">{data.certifications.join(', ')}</span>
              </div>
            )}
            {data.territories && data.territories.length > 0 && (
              <div>
                <span className="font-medium">Territories: </span>
                <span className="text-muted-foreground">{data.territories.join(', ')}</span>
              </div>
            )}
            <ContactUnlockButton 
              entityId={data.id}
              entityType="consultant_company"
              hasContactInfo={!!(data.email || data.phone)}
              size="sm"
            />
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

      case 'equipment_company':
        return (
          <div className="space-y-2 text-sm">
            {data.equipment_categories && data.equipment_categories.length > 0 && (
              <div>
                <span className="font-medium">Equipment Categories: </span>
                <span className="text-muted-foreground">{data.equipment_categories.join(', ')}</span>
              </div>
            )}
            {data.product_lines && data.product_lines.length > 0 && (
              <div>
                <span className="font-medium">Product Lines: </span>
                <span className="text-muted-foreground">{data.product_lines.join(', ')}</span>
              </div>
            )}
            {data.target_markets && data.target_markets.length > 0 && (
              <div>
                <span className="font-medium">Target Markets: </span>
                <span className="text-muted-foreground">{data.target_markets.join(', ')}</span>
              </div>
            )}
            {data.employee_count && (
              <div>
                <span className="font-medium">Employees: </span>
                <span className="text-muted-foreground">{data.employee_count}</span>
              </div>
            )}
            {data.founded_year && (
              <div>
                <span className="font-medium">Founded: </span>
                <span className="text-muted-foreground">{data.founded_year}</span>
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

      case 'pe_firm':
        return (
          <div className="space-y-2 text-sm">
            {data.investment_stage && data.investment_stage.length > 0 && (
              <div>
                <span className="font-medium">Investment Stage: </span>
                <span className="text-muted-foreground">{data.investment_stage.join(', ')}</span>
              </div>
            )}
            {data.sector_focus && data.sector_focus.length > 0 && (
              <div>
                <span className="font-medium">Sector Focus: </span>
                <span className="text-muted-foreground">{data.sector_focus.join(', ')}</span>
              </div>
            )}
            {data.geographic_focus && data.geographic_focus.length > 0 && (
              <div>
                <span className="font-medium">Geographic Focus: </span>
                <span className="text-muted-foreground">{data.geographic_focus.join(', ')}</span>
              </div>
            )}
            {data.total_aum && (
              <div>
                <span className="font-medium">Total AUM: </span>
                <span className="text-muted-foreground">${data.total_aum.toLocaleString()}</span>
              </div>
            )}
            {data.typical_deal_size_min && data.typical_deal_size_max && (
              <div>
                <span className="font-medium">Typical Deal Size: </span>
                <span className="text-muted-foreground">
                  ${data.typical_deal_size_min.toLocaleString()} - ${data.typical_deal_size_max.toLocaleString()}
                </span>
              </div>
            )}
            {data.healthcare_focus && (
              <div>
                <span className="font-medium">Healthcare Focus: </span>
                <span className="text-muted-foreground">Yes</span>
              </div>
            )}
            {data.founded_year && (
              <div>
                <span className="font-medium">Founded: </span>
                <span className="text-muted-foreground">{data.founded_year}</span>
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

      case 'profile':
        return (
          <div className="space-y-2 text-sm">
            {data.current_position && (
              <div>
                <span className="font-medium">Position: </span>
                <span className="text-muted-foreground">{data.current_position}</span>
              </div>
            )}
            {data.current_employer && (
              <div>
                <span className="font-medium">Employer: </span>
                <span className="text-muted-foreground">{data.current_employer}</span>
              </div>
            )}
            {data.years_experience && (
              <div>
                <span className="font-medium">Experience: </span>
                <span className="text-muted-foreground">{data.years_experience} years</span>
              </div>
            )}
            {data.specializations && data.specializations.length > 0 && (
              <div>
                <span className="font-medium">Specializations: </span>
                <span className="text-muted-foreground">{data.specializations.join(', ')}</span>
              </div>
            )}
            {data.interests && data.interests.length > 0 && (
              <div>
                <span className="font-medium">Interests: </span>
                <span className="text-muted-foreground">{data.interests.join(', ')}</span>
              </div>
            )}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <span className="font-medium">Certifications: </span>
                <span className="text-muted-foreground">{data.certifications.join(', ')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {data.available_for_mentoring && (
                <Badge variant="secondary" className="text-xs">Available for Mentoring</Badge>
              )}
              {data.available_for_collaboration && (
                <Badge variant="secondary" className="text-xs">Available for Collaboration</Badge>
              )}
            </div>
            {data.linkedin_url && (
              <div>
                <a 
                  href={data.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  LinkedIn Profile
                </a>
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
                  Personal Website
                </a>
              </div>
            )}
          </div>
        );

      default:
        return null;
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