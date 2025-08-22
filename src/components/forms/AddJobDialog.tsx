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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  company_name: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  employment_type: z.string().min(1, 'Employment type is required'),
  experience_level: z.string().optional(),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  is_remote: z.boolean().default(false),
  external_url: z.string().url().optional().or(z.literal('')),
});

type JobFormData = z.infer<typeof jobSchema>;

interface AddJobDialogProps {
  job?: any;
  onClose?: () => void;
}

export const AddJobDialog = ({ job, onClose }: AddJobDialogProps = {}) => {
  const [open, setOpen] = useState(!!job);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!job;

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      city: '',
      state: '',
      company_name: '',
      description: '',
      requirements: '',
      employment_type: 'Full-time',
      experience_level: '',
      salary_min: undefined,
      salary_max: undefined,
      is_remote: false,
      external_url: '',
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title || '',
        city: job.city || '',
        state: job.state || '',
        company_name: job.company_name || '',
        description: job.description || '',
        requirements: job.requirements || '',
        employment_type: job.employment_type || 'Full-time',
        experience_level: job.experience_level || '',
        salary_min: job.salary_min || undefined,
        salary_max: job.salary_max || undefined,
        is_remote: job.is_remote || false,
        external_url: job.external_url || '',
      });
      setOpen(true);
    }
  }, [job, form]);

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const jobData = {
        title: data.title,
        city: data.city,
        state: data.state,
        company_name: data.company_name || null,
        description: data.description || null,
        requirements: data.requirements || null,
        employment_type: data.employment_type,
        experience_level: data.experience_level || null,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        is_remote: data.is_remote,
        external_url: data.external_url || null,
        source: data.external_url ? 'external' : 'internal',
      };

      if (isEditing) {
        const { error } = await supabase.from('job_listings').update(jobData).eq('id', job.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('job_listings').insert(jobData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Success',
        description: isEditing ? 'Job listing updated successfully!' : 'Job listing posted successfully!',
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update job listing. Please try again.' : 'Failed to post job listing. Please try again.',
        variant: 'destructive',
      });
      console.error('Error with job listing:', error);
    },
  });

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    if (!isEditing) form.reset();
  };

  const onSubmit = (data: JobFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job Listing' : 'Post New Job'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Physical Therapist - Outpatient Orthopedics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Therapy Centers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Per Diem">Per Diem</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        <SelectItem value="Lead/Management">Lead/Management</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary (Annual)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="75000" 
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
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary (Annual)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="95000" 
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
              name="is_remote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Remote Work Available
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="external_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Job Link (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://indeed.com/viewjob?jk=..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed job description..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Job requirements and qualifications..."
                      className="min-h-[80px]"
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
                {mutation.isPending ? (isEditing ? 'Updating...' : 'Posting...') : (isEditing ? 'Update Job' : 'Post Job')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};