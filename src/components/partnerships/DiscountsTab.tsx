import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit, Trash2 } from 'lucide-react';
import { AddDiscountDialog } from './AddDiscountDialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const DiscountsTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discounts')
        .select(`
          *,
          partners (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (discountId: string) => {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', discountId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast({
        title: "Discount removed",
        description: "Discount has been successfully removed",
      });
    }
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Discount code copied to clipboard",
    });
  };

  const getStatusColor = (discount: any) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = discount.end_date ? new Date(discount.end_date) : null;
    
    if (!discount.is_active) return 'destructive';
    if (now < startDate) return 'secondary';
    if (endDate && now > endDate) return 'destructive';
    return 'default';
  };

  const getStatusText = (discount: any) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = discount.end_date ? new Date(discount.end_date) : null;
    
    if (!discount.is_active) return 'Inactive';
    if (now < startDate) return 'Upcoming';
    if (endDate && now > endDate) return 'Expired';
    return 'Active';
  };

  if (isLoading) {
    return <div>Loading discounts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Discounts & Benefits</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Discount
        </Button>
      </div>

      {discounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No discounts created yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Discount
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {discounts.map((discount) => (
            <Card key={discount.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{discount.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {discount.partners?.name || 'General Discount'}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(discount)}>
                    {getStatusText(discount)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {discount.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Discount Code</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {discount.code}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyCode(discount.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Discount Value</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {discount.discount_type === 'percentage' 
                        ? `${discount.discount_value}% off`
                        : `$${discount.discount_value} off`
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Valid From</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(discount.start_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  {discount.end_date && (
                    <div>
                      <p className="text-sm font-medium">Valid Until</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(discount.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(discount.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddDiscountDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};