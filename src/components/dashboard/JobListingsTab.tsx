import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Calendar, DollarSign, Clock, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";

export const JobListingsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from('job_listings')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (locationFilter !== 'all') {
        query = query.or(`city.ilike.%${locationFilter}%,state.ilike.%${locationFilter}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  const { data: locations } = useQuery({
    queryKey: ['job-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('city, state')
        .not('city', 'is', null)
        .not('state', 'is', null);
      
      if (error) throw error;
      const uniqueLocations = [...new Set(data.map(j => `${j.city}, ${j.state}`))].sort();
      return uniqueLocations;
    }
  });

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Listings</h2>
          <p className="text-muted-foreground">Current PT job opportunities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations?.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
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
        ) : jobs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No job listings found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          jobs?.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      {job.companies && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{job.companies.name}</span>
                        </div>
                      )}
                      {(job.city || job.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{[job.city, job.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(job.created_at))} ago</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {job.employment_type && (
                      <Badge variant="secondary">{job.employment_type}</Badge>
                    )}
                    {job.is_remote && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {formatSalary(job.salary_min, job.salary_max) && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                  )}

                  {job.experience_level && (
                    <div>
                      <span className="font-medium">Experience: </span>
                      <span className="text-muted-foreground">{job.experience_level}</span>
                    </div>
                  )}

                  {job.application_deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  {job.posted_by && (
                    <div>
                      <span className="font-medium">Posted by: </span>
                      <span className="text-muted-foreground">{job.posted_by}</span>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Requirements</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 5).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requirements.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Benefits</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.benefits.slice(0, 4).map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {job.benefits.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.benefits.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    Job ID: {job.id.slice(0, 8)}
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};