import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Users, Building, GraduationCap, Briefcase, Factory, Lightbulb, DollarSign, Mail, Phone, MapPin, Globe, Award, Calendar } from 'lucide-react';
import { AdvancedSearchFilters, SearchFilters } from '../search/AdvancedSearchFilters';
import { NotesSection } from '../notes/NotesSection';

interface SearchOnlyTabProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const SearchOnlyTab = ({ title, description, icon: Icon }: SearchOnlyTabProps) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Only run query when search filters are set
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['advanced-search', searchFilters],
    queryFn: async () => {
      if (!searchFilters) return [];
      
      const searchResults = [];
      
      // Search providers
      if (searchFilters.entityTypes.includes('providers')) {
        let query = supabase.from('providers').select('*');
        
        // Apply provider-specific filters
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,first_name.ilike.%${searchFilters.searchTerm}%,last_name.ilike.%${searchFilters.searchTerm}%,email.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%,current_employer.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%,zip_code.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.licenseState) {
          query = query.eq('license_state', searchFilters.licenseState);
        }
        
        if (searchFilters.currentEmployer) {
          query = query.ilike('current_employer', `%${searchFilters.currentEmployer}%`);
        }
        
        if (searchFilters.specializations.length > 0) {
          // Check if any specialization matches
          const specQuery = searchFilters.specializations.map(spec => `specializations.cs.{${spec}}`).join(',');
          query = query.or(specQuery);
        }
        
        if (searchFilters.yearsExperience[0] > 0 || searchFilters.yearsExperience[1] < 30) {
          query = query.gte('years_experience', searchFilters.yearsExperience[0])
                      .lte('years_experience', searchFilters.yearsExperience[1]);
        }
        
        const { data: providers } = await query.limit(100);
        if (providers) {
          searchResults.push(...providers.map(p => ({ ...p, type: 'provider' })));
        }
      }
      
      // Search companies
      if (searchFilters.entityTypes.includes('companies')) {
        let query = supabase.from('companies').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.companyType) {
          query = query.eq('company_type', searchFilters.companyType);
        }
        
        if (searchFilters.employeeCount[0] > 1 || searchFilters.employeeCount[1] < 10000) {
          query = query.gte('employee_count', searchFilters.employeeCount[0])
                      .lte('employee_count', searchFilters.employeeCount[1]);
        }
        
        const { data: companies } = await query.limit(100);
        if (companies) {
          searchResults.push(...companies.map(c => ({ ...c, type: 'company' })));
        }
      }
      
      // Search schools
      if (searchFilters.entityTypes.includes('schools')) {
        let query = supabase.from('schools').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.accreditation) {
          query = query.ilike('accreditation', `%${searchFilters.accreditation}%`);
        }
        
        const { data: schools } = await query.limit(100);
        if (schools) {
          searchResults.push(...schools.map(s => ({ ...s, type: 'school' })));
        }
      }
      
      // Search job listings
      if (searchFilters.entityTypes.includes('job_listings')) {
        let query = supabase.from('job_listings').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`title.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.employmentType) {
          query = query.eq('employment_type', searchFilters.employmentType);
        }
        
        if (searchFilters.experienceLevel) {
          query = query.eq('experience_level', searchFilters.experienceLevel);
        }
        
        if (searchFilters.isRemote !== null) {
          query = query.eq('is_remote', searchFilters.isRemote);
        }
        
        if (searchFilters.salaryRange[0] > 0 || searchFilters.salaryRange[1] < 300000) {
          query = query.gte('salary_min', searchFilters.salaryRange[0])
                      .lte('salary_max', searchFilters.salaryRange[1]);
        }
        
        const { data: jobs } = await query.limit(100);
        if (jobs) {
          searchResults.push(...jobs.map(j => ({ ...j, type: 'job_listing' })));
        }
      }
      
      // Search PE firms
      if (searchFilters.entityTypes.includes('pe_firms')) {
        let query = supabase.from('pe_firms').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.firmType) {
          query = query.eq('firm_type', searchFilters.firmType);
        }
        
        if (searchFilters.healthcareFocus !== null) {
          query = query.eq('healthcare_focus', searchFilters.healthcareFocus);
        }
        
        if (searchFilters.dealSizeRange[0] > 1000000 || searchFilters.dealSizeRange[1] < 1000000000) {
          query = query.gte('typical_deal_size_min', searchFilters.dealSizeRange[0])
                      .lte('typical_deal_size_max', searchFilters.dealSizeRange[1]);
        }
        
        const { data: peFirms } = await query.limit(100);
        if (peFirms) {
          searchResults.push(...peFirms.map(pf => ({ ...pf, type: 'pe_firm' })));
        }
      }
      
      // Search consultant companies
      if (searchFilters.entityTypes.includes('consultant_companies')) {
        let query = supabase.from('consultant_companies').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,first_name.ilike.%${searchFilters.searchTerm}%,last_name.ilike.%${searchFilters.searchTerm}%,company.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        if (searchFilters.consultingCategories.length > 0) {
          const catQuery = searchFilters.consultingCategories.map(cat => `consulting_categories.cs.{${cat}}`).join(',');
          query = query.or(catQuery);
        }
        
        const { data: consultants } = await query.limit(100);
        if (consultants) {
          searchResults.push(...consultants.map(c => ({ ...c, type: 'consultant_company' })));
        }
      }
      
      // Search equipment companies
      if (searchFilters.entityTypes.includes('equipment_companies')) {
        let query = supabase.from('equipment_companies').select('*');
        
        if (searchFilters.searchTerm) {
          query = query.or(`name.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,city.ilike.%${searchFilters.searchTerm}%`);
        }
        
        if (searchFilters.location) {
          query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
        }
        
        const { data: equipment } = await query.limit(100);
        if (equipment) {
          searchResults.push(...equipment.map(e => ({ ...e, type: 'equipment_company' })));
        }
      }
      
      return searchResults;
    },
    enabled: !!searchFilters // Only run when filters are set
  });

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setShowFilters(false);
  };

  const handleClear = () => {
    setSearchFilters(null);
    setShowFilters(true);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'provider': return <Users className="h-4 w-4" />;
      case 'company': return <Building className="h-4 w-4" />;
      case 'school': return <GraduationCap className="h-4 w-4" />;
      case 'job_listing': return <Briefcase className="h-4 w-4" />;
      case 'equipment_company': return <Factory className="h-4 w-4" />;
      case 'consultant_company': return <Lightbulb className="h-4 w-4" />;
      case 'pe_firm': return <DollarSign className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'provider': return 'bg-blue-500';
      case 'company': return 'bg-green-500';
      case 'school': return 'bg-purple-500';
      case 'job_listing': return 'bg-orange-500';
      case 'equipment_company': return 'bg-gray-500';
      case 'consultant_company': return 'bg-cyan-500';
      case 'pe_firm': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (showFilters || !searchFilters) {
    return (
      <div className="space-y-6">
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
                <strong>Search-First Design:</strong> Use the advanced filters below to find exactly what you're looking for. 
                No more scrolling through endless lists!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <AdvancedSearchFilters
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Search Results</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Found {results?.length || 0} matches
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                Modify Search
              </Button>
              <Button variant="outline" onClick={handleClear}>
                New Search
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching across PT ecosystem...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error searching: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {results && results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clearing some filters.
            </p>
            <Button onClick={() => setShowFilters(true)}>
              Modify Search
            </Button>
          </CardContent>
        </Card>
      )}

      {results && results.length > 0 && !isLoading && (
        <div className="grid gap-4">
          {results.map((item: any) => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getEntityColor(item.type)} text-white`}>
                        {getEntityIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type.replace('_', ' ')}</span>
                      </Badge>
                      <h3 className="text-lg font-semibold">
                        {item.name || `${item.first_name} ${item.last_name}` || item.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Location */}
                      {(item.city || item.state) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{[item.city, item.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}

                      {/* Contact */}
                      {item.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{item.email}</span>
                        </div>
                      )}

                      {item.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{item.phone}</span>
                        </div>
                      )}

                      {/* Website */}
                      {item.website && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                            Website
                          </a>
                        </div>
                      )}

                      {/* Company Type */}
                      {item.company_type && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{item.company_type}</span>
                        </div>
                      )}

                      {/* Years Experience */}
                      {item.years_experience && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{item.years_experience} years exp.</span>
                        </div>
                      )}
                    </div>

                    {/* Specializations/Services */}
                    {(item.specializations || item.services || item.consulting_categories) && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {(item.specializations || item.services || item.consulting_categories || []).slice(0, 5).map((spec: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="ml-4">
                    <NotesSection 
                      entityId={item.id} 
                      entityType={item.type}
                      entityName={item.name || `${item.first_name} ${item.last_name}` || item.title}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};