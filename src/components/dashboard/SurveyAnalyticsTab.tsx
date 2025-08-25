import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';

export const SurveyAnalyticsTab = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      const [responsesResult, analyticsResult] = await Promise.all([
        supabase.from('survey_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('survey_analytics').select('*').order('created_at', { ascending: false })
      ]);

      if (responsesResult.data) setResponses(responsesResult.data);
      if (analyticsResult.data) setAnalytics(analyticsResult.data);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleLabels: Record<string, string> = {
    pt_owner: 'PT Owner',
    pt_ceo_coo: 'CEO/COO',
    pt_consultant: 'Consultant',
    healthcare_recruiter: 'Recruiter',
    talent_leadership: 'Talent Leadership',
    physical_therapist: 'Physical Therapist'
  };

  const getOverviewStats = () => {
    const totalResponses = responses.length;
    const betaInterested = responses.filter(r => r.beta_interest).length;
    const avgTimeSpent = analytics.length > 0 
      ? Math.round(analytics.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / analytics.length)
      : 0;
    
    const roleDistribution = responses.reduce((acc, r) => {
      acc[r.respondent_role] = (acc[r.respondent_role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalResponses,
      betaInterested,
      avgTimeSpent,
      roleDistribution
    };
  };

  const getPricingData = () => {
    const pricingCounts = responses.reduce((acc, r) => {
      if (r.pricing_willingness) {
        acc[r.pricing_willingness] = (acc[r.pricing_willingness] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pricingCounts).map(([key, value]) => ({
      range: key.replace(/_/g, ' '),
      count: value
    }));
  };

  const getChallengesData = () => {
    const challengeCounts = responses.reduce((acc, r) => {
      if (r.current_challenges) {
        r.current_challenges.forEach((challenge: string) => {
          acc[challenge] = (acc[challenge] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(challengeCounts)
      .sort(([,a], [,b]) => Number(b) - Number(a))
      .slice(0, 10)
      .map(([challenge, count]) => ({ challenge, count }));
  };

  const stats = getOverviewStats();
  const pricingData = getPricingData();
  const challengesData = getChallengesData();

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading survey analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Survey Analytics</h2>
        <Button onClick={fetchSurveyData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beta Interest</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.betaInterested}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalResponses > 0 ? Math.round((stats.betaInterested / stats.totalResponses) * 100) : 0}% conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(Number(stats.avgTimeSpent) / 60)}m {Number(stats.avgTimeSpent) % 60}s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
            <p className="text-xs text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="leads">Beta Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Response by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.roleDistribution).map(([role, count]) => ({
                        name: roleLabels[role] || role,
                        value: count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {Object.entries(stats.roleDistribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Top Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={challengesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="challenge" angle={-45} textAnchor="end" height={100} fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pricing Willingness */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pricing Willingness</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pricingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>All Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Beta Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell>
                        {new Date(response.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {roleLabels[response.respondent_role] || response.respondent_role}
                        </Badge>
                      </TableCell>
                      <TableCell>{response.company_name || 'N/A'}</TableCell>
                      <TableCell>{response.years_experience || 'N/A'}</TableCell>
                      <TableCell>{response.pricing_willingness || 'N/A'}</TableCell>
                      <TableCell>
                        {response.beta_interest ? (
                          <Badge className="bg-green-500">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Beta Testing Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses
                    .filter(response => response.beta_interest && response.contact_email)
                    .map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          {new Date(response.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{response.contact_name || 'N/A'}</TableCell>
                        <TableCell>{response.contact_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {roleLabels[response.respondent_role] || response.respondent_role}
                          </Badge>
                        </TableCell>
                        <TableCell>{response.company_name || 'N/A'}</TableCell>
                        <TableCell>{response.years_experience || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};