import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Gift, DollarSign } from 'lucide-react';

export const AnalyticsTab = () => {
  const { data: analytics } = useQuery({
    queryKey: ['partnership-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partnership_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: benefitStats } = useQuery({
    queryKey: ['benefit-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_benefits')
        .select(`
          benefit_type,
          status,
          created_at
        `);
      
      if (error) throw error;
      
      // Process data for charts
      const benefitsByType = data.reduce((acc: any, benefit: any) => {
        acc[benefit.benefit_type] = (acc[benefit.benefit_type] || 0) + 1;
        return acc;
      }, {});

      const benefitsByStatus = data.reduce((acc: any, benefit: any) => {
        acc[benefit.status] = (acc[benefit.status] || 0) + 1;
        return acc;
      }, {});

      return {
        byType: Object.entries(benefitsByType).map(([type, count]) => ({
          name: type,
          value: count
        })),
        byStatus: Object.entries(benefitsByStatus).map(([status, count]) => ({
          name: status,
          value: count
        })),
        total: data.length,
        claimed: data.filter((b: any) => b.status === 'claimed').length
      };
    }
  });

  // Mock data for demonstration
  const mockData = [
    { month: 'Jan', clicks: 120, conversions: 24, revenue: 2400 },
    { month: 'Feb', clicks: 180, conversions: 36, revenue: 3600 },
    { month: 'Mar', clicks: 250, conversions: 50, revenue: 5000 },
    { month: 'Apr', clicks: 190, conversions: 38, revenue: 3800 },
    { month: 'May', clicks: 220, conversions: 44, revenue: 4400 },
    { month: 'Jun', clicks: 280, conversions: 56, revenue: 5600 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Partnership Analytics</h3>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,260</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benefits Claimed</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitStats?.claimed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Out of {benefitStats?.total || 0} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$29,200</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" />
                <Bar dataKey="conversions" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Analysis */}
      {benefitStats && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Benefits by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {benefitStats.byType.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {benefitStats.byStatus.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};