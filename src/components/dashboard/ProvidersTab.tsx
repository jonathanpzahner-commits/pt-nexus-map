import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ProvidersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase
        .from('providers')
        .select('*')
        .order('last_name', { ascending: true });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      if (stateFilter !== 'all') {
        query = query.eq('state', stateFilter);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: states } = useQuery({
    queryKey: ['provider-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('state')
        .not('state', 'is', null);
      
      if (error) throw error;
      const uniqueStates = [...new Set(data.map(p => p.state))].sort();
      return uniqueStates;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Physical Therapists</h2>
          <p className="text-muted-foreground">Licensed PT practitioners in the database</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Filters */}
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states?.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
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
        ) : providers?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No providers found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          providers?.map((provider) => (
            <Card key={provider.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {provider.first_name} {provider.last_name}
                </CardTitle>
                <CardDescription>
                  {provider.license_number && (
                    <Badge variant="secondary">License: {provider.license_number}</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.specializations && provider.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {provider.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  {(provider.city || provider.state) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{[provider.city, provider.state].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{provider.phone}</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{provider.email}</span>
                    </div>
                  )}

                  {provider.website && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <a 
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {provider.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {provider.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};