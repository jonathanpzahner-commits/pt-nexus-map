import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, MapPin, DollarSign, Clock, Building, Calendar, Edit, Trash2 } from 'lucide-react';
import { AddJobDialog } from '@/components/forms/AddJobDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { NotesSection } from '@/components/notes/NotesSection';

export const JobListingsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingJob, setEditingJob] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job listings with search and filtering
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['job-listings', searchTerm, cityFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('job_listings')
        .select(`
          *,
          companies (
            name,
            company_type
          )
        `);
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      if (cityFilter !== 'all') {
        query = query.eq('city', cityFilter);
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('employment_type', typeFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch unique cities for filter
  const { data: cities } = useQuery({
    queryKey: ['job-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('city')
        .not('city', 'is', null);
      
      if (error) throw error;
      
      const uniqueCities = [...new Set(data.map(item => item.city))].filter(Boolean);
      return uniqueCities.sort();
    },
  });

  // Fetch unique employment types for filter
  const { data: employmentTypes } = useQuery({
    queryKey: ['employment-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('employment_type')
        .not('employment_type', 'is', null);
      
      if (error) throw error;
      
      const uniqueTypes = [...new Set(data.map(item => item.employment_type))].filter(Boolean);
      return uniqueTypes.sort();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('job_listings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-listings'] });
      toast({ title: "Job listing deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting job listing", description: error.message, variant: "destructive" });
    },
  });

  const formatSalary = (min?: number, max?: number): string | null => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Listings</h2>
          <p className="text-muted-foreground">
            Find physical therapy job opportunities across the country
          </p>
        </div>
        <div className="flex gap-2">
          <AddJobDialog />
          {editingJob && (
            <AddJobDialog 
              job={editingJob} 
              onClose={() => setEditingJob(null)}
            />
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities?.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {employmentTypes?.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings Grid */}
      {jobsLoading ? (
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
      ) : jobs && jobs.length > 0 ? (
        <div className="space-y-8">
          {jobs.map((job) => (
            <div key={job.id} className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {job.employment_type}
                        </Badge>
                        {job.is_remote && (
                          <Badge variant="secondary" className="text-xs">
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingJob(job)}
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
                            <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this job listing for {job.title}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(job.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {job.companies && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{job.companies.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.city}, {job.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {job.description}
                    </p>
                  )}

                  {/* Salary */}
                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    </div>
                  )}

                  {/* Experience Level */}
                  {job.experience_level && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{job.experience_level}</span>
                    </div>
                  )}

                  {/* Requirements */}
                  {job.requirements && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Requirements:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <NotesSection 
                entityType="job_listing"
                entityId={job.id}
                entityName={job.title}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || cityFilter !== 'all' || typeFilter !== 'all'
                ? "Try adjusting your search filters."
                : "No job listings have been posted yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};