import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  GraduationCap, 
  MapPin, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { AddSchoolDialog } from '@/components/forms/AddSchoolDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export const SchoolsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch schools with search and filtering
  const { data: schools, isLoading: schoolsLoading } = useQuery({
    queryKey: ['schools', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase.from('schools').select('*');
      
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
    queryKey: ['school-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
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
      const { error } = await supabase.from('schools').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({ title: "School deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting school", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">PT Schools</h2>
          <p className="text-muted-foreground">
            Explore physical therapy education programs and universities
          </p>
        </div>
        <div className="flex gap-2">
          <AddSchoolDialog />
          {editingSchool && (
            <AddSchoolDialog 
              school={editingSchool} 
              onClose={() => setEditingSchool(null)}
            />
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by school name..."
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

      {/* Schools Grid */}
      {schoolsLoading ? (
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
      ) : schools && schools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {school.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingSchool(school)}>
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
                          <AlertDialogTitle>Delete School</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {school.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(school.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{school.city}, {school.state}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                {school.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {school.description}
                  </p>
                )}

                {/* School Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {school.accreditation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{school.program_length_months} months</span>
                  </div>

                  {school.tuition_per_year && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">${school.tuition_per_year.toLocaleString()}/year</span>
                    </div>
                  )}

                  {school.average_class_size && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{school.average_class_size} students</span>
                    </div>
                  )}
                </div>

                {/* Programs */}
                {school.programs_offered && school.programs_offered.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Programs:</p>
                    <div className="flex flex-wrap gap-1">
                      {school.programs_offered.slice(0, 3).map((program, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                      {school.programs_offered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{school.programs_offered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Faculty and Specializations */}
                <div className="space-y-2">
                  {school.faculty_count && (
                    <p className="text-sm">
                      <span className="font-medium">Faculty:</span> {school.faculty_count} members
                    </p>
                  )}
                  
                  {school.specializations && school.specializations.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {school.specializations.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {school.specializations.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{school.specializations.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schools Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || stateFilter !== 'all'
                ? "Try adjusting your search filters."
                : "No schools have been added yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};