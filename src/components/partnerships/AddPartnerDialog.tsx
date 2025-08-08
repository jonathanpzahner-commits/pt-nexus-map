import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPartnerDialog = ({ open, onOpenChange }: AddPartnerDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    website: '',
    contact_info: '',
    api_endpoint: '',
    status: 'pending'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('partners')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partner added",
        description: "New partner has been successfully added",
      });
      onOpenChange(false);
      setFormData({
        name: '',
        category: '',
        description: '',
        website: '',
        contact_info: '',
        api_endpoint: '',
        status: 'pending'
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add partner",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const partnerCategories = [
    'Job Platforms',
    'Practice Management',
    'Education & Training',
    'Medical Equipment',
    'EMR/EHR Systems',
    'Telehealth',
    'Insurance',
    'Continuing Education',
    'Other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Partner Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Indeed, WebPT, MedBridge"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {partnerCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the partnership"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://partner.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_info">Contact Information</Label>
            <Textarea
              id="contact_info"
              value={formData.contact_info}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
              placeholder="Contact person, email, phone, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_endpoint">API Endpoint (Optional)</Label>
            <Input
              id="api_endpoint"
              value={formData.api_endpoint}
              onChange={(e) => setFormData(prev => ({ ...prev, api_endpoint: e.target.value }))}
              placeholder="https://api.partner.com/v1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? 'Adding...' : 'Add Partner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};