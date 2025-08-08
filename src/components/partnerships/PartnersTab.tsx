import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Settings, Trash2 } from 'lucide-react';
import { AddPartnerDialog } from './AddPartnerDialog';
import { useToast } from '@/hooks/use-toast';

export const PartnersTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partner removed",
        description: "Partner has been successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove partner",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <div>Loading partners...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Platform Partners</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No partners added yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Partner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {partner.category}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {partner.description}
                </p>
                
                {partner.website && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(partner.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(partner.id)}
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

      <AddPartnerDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};