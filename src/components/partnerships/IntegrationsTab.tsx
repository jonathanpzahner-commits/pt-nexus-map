import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, Key, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const IntegrationsTab = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partnership_integrations')
        .select(`
          *,
          partners (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners-for-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, category')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('partnership_integrations')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integration updated",
        description: "Integration settings have been saved",
      });
      setIsEditing(false);
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('partnership_integrations')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integration created",
        description: "New integration has been set up",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div>Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">API Integrations</h3>
        <Button onClick={() => {
          setSelectedIntegration({
            partner_id: '',
            integration_type: 'api',
            api_key: '',
            webhook_url: '',
            configuration: {},
            is_active: true
          });
          setIsEditing(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Integration List */}
        <div className="space-y-4">
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">No integrations configured yet</p>
                <p className="text-sm text-muted-foreground">
                  Set up API connections with your partners to enable automated data sync and user benefits.
                </p>
              </CardContent>
            </Card>
          ) : (
            integrations.map((integration) => (
              <Card 
                key={integration.id} 
                className={`cursor-pointer transition-colors ${
                  selectedIntegration?.id === integration.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedIntegration(integration);
                  setIsEditing(false);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {integration.partners?.name || 'Unknown Partner'}
                    </CardTitle>
                    <Badge variant={getStatusColor(integration.status)} className="flex items-center gap-1">
                      {getStatusIcon(integration.status)}
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {integration.integration_type} • {integration.partners?.category}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Key className="h-3 w-3" />
                    {integration.api_key ? 'API Key configured' : 'No API key'}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Integration Details/Editor */}
        <div>
          {selectedIntegration ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {isEditing ? 'Configure Integration' : 'Integration Details'}
                  </CardTitle>
                  {!isEditing && (
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <IntegrationForm 
                    integration={selectedIntegration}
                    partners={partners}
                    onSave={(data) => {
                      if (selectedIntegration.id) {
                        updateMutation.mutate({ id: selectedIntegration.id, data });
                      } else {
                        createMutation.mutate(data);
                      }
                    }}
                    onCancel={() => setIsEditing(false)}
                    isLoading={updateMutation.isPending || createMutation.isPending}
                  />
                ) : (
                  <IntegrationDetails integration={selectedIntegration} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select an integration to view or configure its settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const IntegrationDetails = ({ integration }: { integration: any }) => (
  <div className="space-y-4">
    <div>
      <Label>Partner</Label>
      <p className="text-sm text-muted-foreground mt-1">
        {integration.partners?.name || 'Unknown Partner'}
      </p>
    </div>
    
    <div>
      <Label>Integration Type</Label>
      <p className="text-sm text-muted-foreground mt-1 capitalize">
        {integration.integration_type}
      </p>
    </div>
    
    <div>
      <Label>API Key</Label>
      <p className="text-sm text-muted-foreground mt-1">
        {integration.api_key ? '••••••••••••••••' : 'Not configured'}
      </p>
    </div>
    
    {integration.webhook_url && (
      <div>
        <Label>Webhook URL</Label>
        <p className="text-sm text-muted-foreground mt-1 break-all">
          {integration.webhook_url}
        </p>
      </div>
    )}
    
    <div className="flex items-center space-x-2">
      <Switch checked={integration.is_active} disabled />
      <Label>Active</Label>
    </div>
  </div>
);

const IntegrationForm = ({ 
  integration, 
  partners, 
  onSave, 
  onCancel, 
  isLoading 
}: {
  integration: any;
  partners: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(integration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="partner_id">Partner</Label>
        <Select 
          value={formData.partner_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, partner_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select partner" />
          </SelectTrigger>
          <SelectContent>
            {partners.map((partner) => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="integration_type">Integration Type</Label>
        <Select 
          value={formData.integration_type} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, integration_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api">REST API</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="oauth">OAuth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api_key">API Key</Label>
        <Input
          id="api_key"
          type="password"
          value={formData.api_key}
          onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
          placeholder="Enter API key"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook_url">Webhook URL (Optional)</Label>
        <Input
          id="webhook_url"
          type="url"
          value={formData.webhook_url}
          onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
          placeholder="https://your-app.com/webhooks/partner"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="configuration">Configuration (JSON)</Label>
        <Textarea
          id="configuration"
          value={JSON.stringify(formData.configuration, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData(prev => ({ ...prev, configuration: parsed }));
            } catch {
              // Invalid JSON, keep the string for now
            }
          }}
          placeholder='{"setting1": "value1", "setting2": "value2"}'
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label>Active</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Integration'}
        </Button>
      </div>
    </form>
  );
};
