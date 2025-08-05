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

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  company_type: z.string().min(1, 'Company type is required'),
  description: z.string().optional(),
  employee_count: z.number().min(1).optional(),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  company_locations: z.string().optional(),
  services: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface AddCompanyDialogProps {
  company?: any;
  onClose?: () => void;
}

export const AddCompanyDialog = ({ company, onClose }: AddCompanyDialogProps = {}) => {
  const [open, setOpen] = useState(!!company);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!company;

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      company_type: '',
      description: '',
      employee_count: undefined,
      founded_year: undefined,
      website: '',
      company_locations: '',
      services: '',
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || '',
        company_type: company.company_type || '',
        description: company.description || '',
        employee_count: company.employee_count || undefined,
        founded_year: company.founded_year || undefined,
        website: company.website || '',
        company_locations: company.company_locations?.join(', ') || '',
        services: company.services?.join(', ') || '',
      });
      setOpen(true);
    }
  }, [company, form]);

  const mutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const companyData = {
        name: data.name,
        company_type: data.company_type,
        description: data.description || null,
        employee_count: data.employee_count,
        founded_year: data.founded_year,
        website: data.website || null,
        company_locations: data.company_locations 
          ? data.company_locations.split(',').map(s => s.trim()).filter(s => s)
          : [],
        services: data.services 
          ? data.services.split(',').map(s => s.trim()).filter(s => s)
          : [],
      };

      if (isEditing) {
        const { error } = await supabase.from('companies').update(companyData).eq('id', company.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('companies').insert(companyData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Success',
        description: isEditing ? 'Company updated successfully!' : 'Company added successfully!',
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update company. Please try again.' : 'Failed to add company. Please try again.',
        variant: 'destructive',
      });
      console.error('Error with company:', error);
    },
  });

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    if (!isEditing) form.reset();
  };

  const onSubmit = (data: CompanyFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Company' : 'Add New Company'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="HealthFirst Rehabilitation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type *</FormLabel>
                    <FormControl>
                      <Input placeholder="Clinic Chain, Equipment Supplier, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employee_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="250" 
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
                name="founded_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2010" 
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
                name="website"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.company.com" {...field} />
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
                      placeholder="Brief description of the company..."
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
              name="company_locations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locations</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="California, Oregon, Washington (comma-separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Outpatient PT, Sports Medicine, Equipment Sales (comma-separated)" 
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
                {mutation.isPending ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Company' : 'Add Company')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};