import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  description: z.string().optional(),
  accreditation: z.string().optional(),
  program_length_months: z.number().min(1).optional(),
  tuition_per_year: z.number().min(0).optional(),
  average_class_size: z.number().min(1).optional(),
  programs_offered: z.string().optional(),
  faculty_count: z.number().min(1).optional(),
  specializations: z.string().optional(),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

export const AddSchoolDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      description: '',
      accreditation: '',
      program_length_months: undefined,
      tuition_per_year: undefined,
      average_class_size: undefined,
      programs_offered: '',
      faculty_count: undefined,
      specializations: '',
    },
  });

  const addSchoolMutation = useMutation({
    mutationFn: async (data: SchoolFormData) => {
      const schoolData = {
        name: data.name,
        city: data.city,
        state: data.state,
        description: data.description || null,
        accreditation: data.accreditation || null,
        program_length_months: data.program_length_months,
        tuition_per_year: data.tuition_per_year,
        average_class_size: data.average_class_size,
        programs_offered: data.programs_offered 
          ? data.programs_offered.split(',').map(s => s.trim()).filter(s => s)
          : [],
        faculty_count: data.faculty_count,
        specializations: data.specializations 
          ? data.specializations.split(',').map(s => s.trim()).filter(s => s)
          : [],
      };

      const { error } = await supabase
        .from('schools')
        .insert(schoolData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Success',
        description: 'School added successfully!',
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add school. Please try again.',
        variant: 'destructive',
      });
      console.error('Error adding school:', error);
    },
  });

  const onSubmit = (data: SchoolFormData) => {
    addSchoolMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New PT School</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>School Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Southern California" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Los Angeles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accreditation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accreditation</FormLabel>
                    <FormControl>
                      <Input placeholder="CAPTE Accredited" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program_length_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Length (months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="36" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tuition_per_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuition Per Year ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="45000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="average_class_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Class Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="85" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faculty_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the school and program..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programs_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programs Offered</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Doctor of Physical Therapy (DPT), PhD in Physical Therapy (comma-separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Neurological, Orthopedic, Cardiovascular (comma-separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addSchoolMutation.isPending}>
                {addSchoolMutation.isPending ? 'Adding...' : 'Add School'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};