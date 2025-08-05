import { useState, useEffect } from 'react';
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
  state: z.string().min(2, 'State is required'),
  description: z.string().optional(),
  accreditation: z.string().optional(),
  tuition_per_year: z.number().min(0).optional(),
  program_length_months: z.number().min(1).optional(),
  faculty_count: z.number().min(1).optional(),
  average_class_size: z.number().min(1).optional(),
  programs_offered: z.string().optional(),
  specializations: z.string().optional(),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface AddSchoolDialogProps {
  school?: any;
  onClose?: () => void;
}

export const AddSchoolDialog = ({ school, onClose }: AddSchoolDialogProps = {}) => {
  const [open, setOpen] = useState(!!school);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!school;

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      description: '',
      accreditation: '',
      tuition_per_year: undefined,
      program_length_months: undefined,
      faculty_count: undefined,
      average_class_size: undefined,
      programs_offered: '',
      specializations: '',
    },
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name || '',
        city: school.city || '',
        state: school.state || '',
        description: school.description || '',
        accreditation: school.accreditation || '',
        tuition_per_year: school.tuition_per_year ? Number(school.tuition_per_year) : undefined,
        program_length_months: school.program_length_months || undefined,
        faculty_count: school.faculty_count || undefined,
        average_class_size: school.average_class_size || undefined,
        programs_offered: school.programs_offered?.join(', ') || '',
        specializations: school.specializations?.join(', ') || '',
      });
      setOpen(true);
    }
  }, [school, form]);

  const mutation = useMutation({
    mutationFn: async (data: SchoolFormData) => {
      const schoolData = {
        name: data.name,
        city: data.city,
        state: data.state,
        description: data.description || null,
        accreditation: data.accreditation || null,
        tuition_per_year: data.tuition_per_year,
        program_length_months: data.program_length_months,
        faculty_count: data.faculty_count,
        average_class_size: data.average_class_size,
        programs_offered: data.programs_offered 
          ? data.programs_offered.split(',').map(s => s.trim()).filter(s => s)
          : [],
        specializations: data.specializations 
          ? data.specializations.split(',').map(s => s.trim()).filter(s => s)
          : [],
      };

      if (isEditing) {
        const { error } = await supabase.from('schools').update(schoolData).eq('id', school.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schools').insert(schoolData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Success',
        description: isEditing ? 'School updated successfully!' : 'School added successfully!',
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update school. Please try again.' : 'Failed to add school. Please try again.',
        variant: 'destructive',
      });
      console.error('Error with school:', error);
    },
  });

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    if (!isEditing) form.reset();
  };

  const onSubmit = (data: SchoolFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit School' : 'Add New School'}</DialogTitle>
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
                      <Input placeholder="University of California PT Program" {...field} />
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
                      <Input placeholder="CAPTE" {...field} />
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
                    <FormLabel>Annual Tuition</FormLabel>
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
              <FormField
                control={form.control}
                name="average_class_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Class Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="40" 
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
                      placeholder="Brief description of the school and its programs..."
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
                      placeholder="DPT, MPT, PhD in PT (comma-separated)" 
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
                      placeholder="Sports Medicine, Neurological PT, Pediatric PT (comma-separated)" 
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
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update School' : 'Add School')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};