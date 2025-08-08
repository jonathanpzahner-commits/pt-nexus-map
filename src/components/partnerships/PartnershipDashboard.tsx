import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Gift, Settings } from 'lucide-react';
import { PartnersTab } from './PartnersTab';
import { DiscountsTab } from './DiscountsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { IntegrationsTab } from './IntegrationsTab';

export const PartnershipDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats } = useQuery({
    queryKey: ['partnership-stats'],
    queryFn: async () => {
      const [partnersRes, discountsRes, benefitsRes] = await Promise.all([
        supabase.from('partners').select('id', { count: 'exact' }),
        supabase.from('discounts').select('id', { count: 'exact' }),
        supabase.from('user_benefits').select('id', { count: 'exact' })
      ]);
      
      return {
        partners: partnersRes.count || 0,
        discounts: discountsRes.count || 0,
        benefits: benefitsRes.count || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partnership Management</h2>
          <p className="text-muted-foreground">
            Manage partnerships, discounts, and integrations with industry platforms
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.partners || 0}</div>
            <p className="text-xs text-muted-foreground">
              Industry platforms integrated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Discounts</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.discounts || 0}</div>
            <p className="text-xs text-muted-foreground">
              User benefits available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Benefits Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.benefits || 0}</div>
            <p className="text-xs text-muted-foreground">
              User benefits claimed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage your latest partnership integrations with platforms like Indeed, WebPT, and more.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('partners')}
                >
                  Manage Partners
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create and manage discount codes and special offers for your users across partner platforms.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('discounts')}
                >
                  Manage Discounts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="discounts">
          <DiscountsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};