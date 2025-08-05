import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Building,
  Plus
} from 'lucide-react';
import { AddJobDialog } from '@/components/forms/AddJobDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';

export const JobListingsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Fetch job listings with company information
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['job-listings', searchTerm, locationFilter],
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
      
      if (locationFilter !== 'all') {
        query = query.ilike('city', `%${locationFilter}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch unique locations for filter
  const { data: locations } = useQuery({
    queryKey: ['job-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('city, state')
        .not('city', 'is', null)
        .not('state', 'is', null);
      
      if (error) throw error;
      
      const uniqueLocations = [...new Set(data.map(item => `${item.city}, ${item.state}`))];
      return uniqueLocations.sort();
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
        <AddJobDialog />
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
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations?.map((location) => (
              <SelectItem key={location} value={location.split(',')[0]}>
                {location}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {job.title}
                  </h3>
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
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Job Details */}
                <div className="space-y-2">
                  {job.employment_type && (
                    <Badge variant="secondary" className="text-xs">
                      {job.employment_type}
                    </Badge>
                  )}
                  {job.is_remote && (
                    <Badge variant="outline" className="text-xs">
                      Remote
                    </Badge>
                  )}
                </div>

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

                {/* Action Button */}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || locationFilter !== 'all'
                ? "Try adjusting your search filters."
                : "No job listings have been posted yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};