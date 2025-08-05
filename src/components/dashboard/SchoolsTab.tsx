import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Users, GraduationCap, ExternalLink, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SchoolsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase
        .from('schools')
        .select(`
          *,
          faculty(*)
        `)
        .order('name', { ascending: true });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
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
    queryKey: ['school-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('state')
        .not('state', 'is', null);
      
      if (error) throw error;
      const uniqueStates = [...new Set(data.map(s => s.state))].sort();
      return uniqueStates;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">PT Education Programs</h2>
          <p className="text-muted-foreground">Schools and universities offering PT degrees</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search schools..."
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

      {/* Schools Grid */}
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
        ) : schools?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No schools found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          schools?.map((school) => (
            <Card key={school.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{school.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {[school.city, school.state].filter(Boolean).join(', ')}
                    </CardDescription>
                  </div>
                  {school.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={school.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {school.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {school.accreditation_status && (
                    <div className="space-y-1">
                      <span className="font-medium">Accreditation</span>
                      <div>
                        <Badge 
                          variant={school.accreditation_status === 'Accredited' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {school.accreditation_status}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {school.program_length && (
                    <div className="space-y-1">
                      <span className="font-medium">Program Length</span>
                      <p className="text-muted-foreground">{school.program_length}</p>
                    </div>
                  )}

                  {school.tuition && (
                    <div className="space-y-1">
                      <span className="font-medium">Tuition</span>
                      <p className="text-muted-foreground">${school.tuition.toLocaleString()}</p>
                    </div>
                  )}

                  {school.class_size && (
                    <div className="space-y-1">
                      <span className="font-medium">Class Size</span>
                      <p className="text-muted-foreground">{school.class_size} students</p>
                    </div>
                  )}
                </div>

                {/* Program Types */}
                {school.program_types && school.program_types.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Programs Offered</h4>
                    <div className="flex flex-wrap gap-1">
                      {school.program_types.map((program, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculty Count */}
                {school.faculty && school.faculty.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{school.faculty.length} faculty members</span>
                  </div>
                )}

                {/* Specializations */}
                {school.specializations && school.specializations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {school.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {school.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{school.specializations.length - 3} more
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