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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const companySizeOptions = [
  '1-5', '6-10', '11-20', '21-40', '41-75', '76-100', 
  '101-125', '126-150', '151-200', '201-250', '251-500', 
  '501-600', '601-750', '751-1000', '1001-1500', 
  '1501-2500', '2501-3500', '3501-5000', '5000+'
];

const leadershipCategories = {
  owner_ceo: 'Owner/CEO',
  financial: 'Financial',
  operations: 'Operations',
  clinical_excellence: 'Clinical Excellence',
  technology: 'Technology',
  hr_recruitment: 'Human Resources/Recruitment',
  sales_marketing: 'Sales/Marketing',
  facilities: 'Facilities'
};

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  company_type: z.string().min(1, 'Company type is required'),
  description: z.string().optional(),
  number_of_clinics: z.number().min(1).optional(),
  company_size_range: z.string().optional(),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  parent_company: z.string().optional(),
  pe_backed: z.boolean().optional(),
  pe_firm_name: z.string().optional(),
  pe_relationship_start_date: z.string().optional(),
  company_locations: z.string().optional(),
  services: z.string().optional(),
  leadership: z.record(z.string()).optional(),
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
      number_of_clinics: undefined,
      company_size_range: '',
      founded_year: undefined,
      website: '',
      parent_company: '',
      pe_backed: false,
      pe_firm_name: '',
      pe_relationship_start_date: '',
      company_locations: '',
      services: '',
      leadership: {},
    },
  });

  const watchPeBacked = form.watch('pe_backed');

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || '',
        company_type: company.company_type || '',
        description: company.description || '',
        number_of_clinics: company.number_of_clinics || undefined,
        company_size_range: company.company_size_range || '',
        founded_year: company.founded_year || undefined,
        website: company.website || '',
        parent_company: company.parent_company || '',
        pe_backed: company.pe_backed || false,
        pe_firm_name: company.pe_firm_name || '',
        pe_relationship_start_date: company.pe_relationship_start_date || '',
        company_locations: company.company_locations?.join(', ') || '',
        services: company.services?.join(', ') || '',
        leadership: company.leadership || {},
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
        number_of_clinics: data.number_of_clinics,
        company_size_range: data.company_size_range || null,
        founded_year: data.founded_year,
        website: data.website || null,
        parent_company: data.parent_company || null,
        pe_backed: data.pe_backed || false,
        pe_firm_name: data.pe_firm_name || null,
        pe_relationship_start_date: data.pe_relationship_start_date || null,
        company_locations: data.company_locations 
          ? data.company_locations.split(',').map(s => s.trim()).filter(s => s)
          : [],
        services: data.services 
          ? data.services.split(',').map(s => s.trim()).filter(s => s)
          : [],
        leadership: data.leadership || {},
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                name="number_of_clinics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Clinics</FormLabel>
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
                name="company_size_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizeOptions.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Parent company name (if applicable)" {...field} />
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

            {/* PE Backing Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Private Equity Information</h3>
              <FormField
                control={form.control}
                name="pe_backed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Private Equity Backed</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {watchPeBacked && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pe_firm_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PE Firm Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Private equity firm name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pe_relationship_start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Leadership Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(leadershipCategories).map(([category, label]) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`leadership.${category}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={`Enter ${label.toLowerCase()} leadership`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
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