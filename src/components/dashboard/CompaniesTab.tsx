import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Users, Calendar, Globe, MapPin, Plus } from 'lucide-react';
import { AddCompanyDialog } from '@/components/forms/AddCompanyDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CompaniesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch companies with search and filtering
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies', searchTerm, typeFilter],
    queryFn: async () => {
      let query = supabase.from('companies').select('*');
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('company_type', typeFilter);
      }
      
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch unique company types for filter
  const { data: companyTypes } = useQuery({
    queryKey: ['company-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_type')
        .not('company_type', 'is', null);
      
      if (error) throw error;
      
      const uniqueTypes = [...new Set(data.map(item => item.company_type))].filter(Boolean);
      return uniqueTypes.sort();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Companies</h2>
          <p className="text-muted-foreground">
            Discover PT-related businesses, clinics, and service providers
          </p>
        </div>
        <AddCompanyDialog />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {companyTypes?.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      {companiesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {company.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {company.company_type}
                  </Badge>
                </div>
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Visit Website
                  </a>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {company.description}
                  </p>
                )}

                {/* Company Details */}
                <div className="space-y-2">
                  {company.employee_count && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{company.employee_count} employees</span>
                    </div>
                  )}
                  {company.founded_year && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Founded in {company.founded_year}</span>
                    </div>
                  )}
                </div>

                {/* Locations */}
                {company.company_locations && company.company_locations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Locations:</p>
                    <div className="flex flex-wrap gap-1">
                      {company.company_locations.slice(0, 2).map((location, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                      {company.company_locations.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{company.company_locations.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Services */}
                {company.services && company.services.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {company.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {company.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || typeFilter !== 'all'
                ? "Try adjusting your search filters."
                : "No companies have been added yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};