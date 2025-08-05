import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Users, Building, ExternalLink, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CompaniesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies', searchTerm, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select(`
          *,
          company_locations(*)
        `)
        .order('name', { ascending: true });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (typeFilter !== 'all') {
        query = query.eq('company_type', typeFilter);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: companyTypes } = useQuery({
    queryKey: ['company-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_type')
        .not('company_type', 'is', null);
      
      if (error) throw error;
      const uniqueTypes = [...new Set(data.map(c => c.company_type))].sort();
      return uniqueTypes;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Healthcare Companies</h2>
          <p className="text-muted-foreground">Organizations providing PT services</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {companyTypes?.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : companies?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No companies found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          companies?.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {company.company_type && (
                        <Badge variant="secondary">{company.company_type}</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {company.website && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {company.employee_count ? `${company.employee_count} employees` : 'Size not specified'}
                    </span>
                  </div>

                  {company.founded_year && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>Founded {company.founded_year}</span>
                    </div>
                  )}
                </div>

                {/* Company Locations */}
                {company.company_locations && company.company_locations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Locations</h4>
                    <div className="space-y-1">
                      {company.company_locations.slice(0, 3).map((location) => (
                        <div key={location.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {[location.city, location.state].filter(Boolean).join(', ')}
                            {location.location_type && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {location.location_type}
                              </Badge>
                            )}
                          </span>
                        </div>
                      ))}
                      {company.company_locations.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{company.company_locations.length - 3} more locations
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Services */}
                {company.services && company.services.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Services</h4>
                    <div className="flex flex-wrap gap-1">
                      {company.services.slice(0, 4).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {company.services.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.services.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};