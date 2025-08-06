import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, Globe, MapPin, Award, Calendar, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddProviderDialog } from '@/components/forms/AddProviderDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { NotesSection } from '@/components/notes/NotesSection';

const ProvidersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch total count
  const { data: totalCount } = useQuery({
    queryKey: ['providers-count', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase.from('providers').select('*', { count: 'exact', head: true });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }
      
      if (stateFilter !== 'all') {
        query = query.eq('state', stateFilter);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch providers with search, filtering, and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  
  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['providers', searchTerm, stateFilter, currentPage],
    queryFn: async () => {
      let query = supabase.from('providers').select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }
      
      if (stateFilter !== 'all') {
        query = query.eq('state', stateFilter);
      }
      
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error } = await query
        .order('name')
        .range(from, to);
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('providers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast({ title: "Provider deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting provider", description: error.message, variant: "destructive" });
    },
  });

  // Calculate pagination values
  const totalPages = Math.ceil((totalCount || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount || 0);

  // Reset to page 1 when search/filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStateFilterChange = (value: string) => {
    setStateFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Physical Therapists</h2>
          <p className="text-muted-foreground">
            Browse licensed physical therapists and their specializations
            {totalCount !== undefined && (
              <span className="block mt-1 font-medium">
                {totalCount.toLocaleString()} total providers
                {(searchTerm || stateFilter !== 'all') && (
                  <span className="text-primary"> (filtered)</span>
                )}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <AddProviderDialog />
          {editingProvider && (
            <AddProviderDialog 
              provider={editingProvider} 
              onClose={() => setEditingProvider(null)}
            />
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or city..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stateFilter} onValueChange={handleStateFilterChange}>
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

      {/* Results Summary */}
      {totalCount !== undefined && providers && providers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-t border-b">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {totalCount.toLocaleString()} providers
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm px-3 py-1 bg-muted rounded">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

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
        <div className="space-y-8">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {provider.name}
                      </h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {provider.license_state}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProvider(provider)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Provider</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {provider.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(provider.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
              
              <NotesSection 
                entityType="provider"
                entityId={provider.id}
                entityName={provider.name}
              />
            </div>
          ))}
          
          {/* Pagination Controls at Bottom */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm px-3 py-1 bg-muted rounded">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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