import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, Globe, MapPin, Award, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddProviderDialog } from '@/components/forms/AddProviderDialog';

const ProvidersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Fetch providers with search and filtering
  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['providers', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase.from('providers').select('*');
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      if (stateFilter !== 'all') {
        query = query.eq('state', stateFilter);
      }
      
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch unique states for filter
  const { data: states } = useQuery({
    queryKey: ['provider-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('state')
        .not('state', 'is', null);
      
      if (error) throw error;
      
      const uniqueStates = [...new Set(data.map(item => item.state))].filter(Boolean);
      return uniqueStates.sort();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Physical Therapists</h2>
          <p className="text-muted-foreground">
            Browse licensed physical therapists and their specializations
          </p>
        </div>
        <AddProviderDialog />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states?.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Providers Grid */}
      {providersLoading ? (
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
      ) : providers && providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {provider.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {provider.license_state}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  License: {provider.license_number}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Specializations */}
                {provider.specializations && provider.specializations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {provider.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2">
                  {provider.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${provider.email}`} className="text-primary hover:underline">
                        {provider.email}
                      </a>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                        {provider.phone}
                      </a>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {provider.city && provider.state && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.city}, {provider.state}</span>
                    </div>
                  )}
                  {provider.years_experience && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.years_experience} years experience</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {provider.bio && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">About:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {provider.bio}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Physical Therapists Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || stateFilter !== 'all'
                ? "Try adjusting your search filters."
                : "No physical therapists have been added yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProvidersTab;