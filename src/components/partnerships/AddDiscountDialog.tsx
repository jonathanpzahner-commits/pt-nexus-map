import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface AddDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddDiscountDialog = ({ open, onOpenChange }: AddDiscountDialogProps) => {
  const [formData, setFormData] = useState({
    partner_id: '',
    title: '',
    description: '',
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
    is_active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners = [] } = useQuery({
    queryKey: ['partners-for-discounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const submitData = {
        ...data,
        partner_id: data.partner_id || null,
        discount_value: parseFloat(data.discount_value),
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        end_date: data.end_date || null
      };

      const { error } = await supabase
        .from('discounts')
        .insert([submitData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast({
        title: "Discount created",
        description: "New discount has been successfully created",
      });
      onOpenChange(false);
      setFormData({
        partner_id: '',
        title: '',
        description: '',
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        is_active: true
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create discount",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner">Partner (Optional)</Label>
            <Select 
              value={formData.partner_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, partner_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select partner or leave blank for general discount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">General Discount</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 20% off WebPT Premium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the discount and how to use it"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Discount Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="DISCOUNT20"
                required
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                Generate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select 
                value={formData.discount_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                {formData.discount_type === 'percentage' ? 'Percentage' : 'Amount ($)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                placeholder={formData.discount_type === 'percentage' ? '20' : '50'}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
            <Input
              id="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
              placeholder="Leave blank for unlimited use"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
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
              {createMutation.isPending ? 'Creating...' : 'Create Discount'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};