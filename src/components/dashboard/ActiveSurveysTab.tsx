import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';
import { 
  FileText, 
  Users, 
  Calendar, 
  Target, 
  TrendingUp, 
  DollarSign,
  Stethoscope,
  Building,
  GraduationCap,
  Heart,
  Clock,
  ExternalLink
} from 'lucide-react';
import { SurveyBuilderTab } from './SurveyBuilderTab';

export const ActiveSurveysTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Surveys', count: 15 },
    { id: 'apta', name: 'APTA Research', count: 4 },
    { id: 'compensation', name: 'Compensation', count: 3 },
    { id: 'settings', name: 'Practice Settings', count: 2 },
    { id: 'research', name: 'Clinical Research', count: 3 },
    { id: 'education', name: 'Education', count: 2 },
    { id: 'technology', name: 'Technology', count: 1 }
  ];

  const surveys = [
    {
      id: 1,
      title: "2024 APTA Physical Therapy Workforce Study",
      organization: "American Physical Therapy Association",
      category: "apta",
      description: "Annual comprehensive study on PT workforce trends, demographics, and practice patterns across all settings.",
      participants: 2847,
      targetParticipants: 5000,
      deadline: "2024-04-15",
      duration: "15-20 minutes",
      incentive: "$25 gift card",
      topics: ["Workforce Trends", "Demographics", "Practice Patterns", "Job Satisfaction"],
      priority: "high",
      status: "active"
    },
    {
      id: 2,
      title: "Physical Therapy Compensation Survey 2024",
      organization: "PT Salary Survey Collaborative",
      category: "compensation",
      description: "National survey tracking PT salaries, benefits, and compensation trends across different practice settings.",
      participants: 1234,
      targetParticipants: 3000,
      deadline: "2024-03-30",
      duration: "10-12 minutes",
      incentive: "Free salary report",
      topics: ["Salaries", "Benefits", "Bonuses", "Geographic Variations"],
      priority: "high",
      status: "active"
    },
    {
      id: 3,
      title: "Outpatient PT Practice Management Survey",
      organization: "Private Practice Section - APTA",
      category: "settings",
      description: "Study on business practices, challenges, and opportunities in outpatient PT settings.",
      participants: 567,
      targetParticipants: 1500,
      deadline: "2024-04-01",
      duration: "8-10 minutes",
      incentive: "Best practice guide",
      topics: ["Business Operations", "Challenges", "Technology Use", "Growth Strategies"],
      priority: "medium",
      status: "active"
    },
    {
      id: 4,
      title: "Telehealth in Physical Therapy Research",
      organization: "Journal of Physical Therapy Research",
      category: "research",
      description: "Research study on telehealth adoption, effectiveness, and patient outcomes in PT practice.",
      participants: 892,
      targetParticipants: 2000,
      deadline: "2024-05-15",
      duration: "12-15 minutes",
      incentive: "Research findings report",
      topics: ["Telehealth Adoption", "Patient Outcomes", "Technology Barriers", "Best Practices"],
      priority: "medium",
      status: "active"
    },
    {
      id: 5,
      title: "PT Student Clinical Education Experience",
      organization: "Commission on Accreditation in PT Education",
      category: "education",
      description: "Survey on clinical education experiences, challenges, and preparation for practice.",
      participants: 445,
      targetParticipants: 1000,
      deadline: "2024-03-25",
      duration: "6-8 minutes",
      incentive: "Career resources",
      topics: ["Clinical Education", "Preparation", "Challenges", "Mentorship"],
      priority: "medium",
      status: "active"
    },
    {
      id: 6,
      title: "Burnout and Job Satisfaction in Physical Therapy",
      organization: "PT Wellness Research Institute",
      category: "apta",
      description: "Comprehensive study on burnout rates, job satisfaction, and mental health in the PT profession.",
      participants: 1567,
      targetParticipants: 4000,
      deadline: "2024-04-30",
      duration: "15-18 minutes",
      incentive: "$30 gift card",
      topics: ["Burnout", "Job Satisfaction", "Mental Health", "Work-Life Balance"],
      priority: "high",
      status: "active"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-orange-500 bg-orange-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'apta': return <Heart className="h-4 w-4" />;
      case 'compensation': return <DollarSign className="h-4 w-4" />;
      case 'settings': return <Building className="h-4 w-4" />;
      case 'research': return <FileText className="h-4 w-4" />;
      case 'education': return <GraduationCap className="h-4 w-4" />;
      case 'technology': return <Stethoscope className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredSurveys = selectedCategory === 'all' 
    ? surveys 
    : surveys.filter(survey => survey.category === selectedCategory);

  const totalParticipants = surveys.reduce((sum, survey) => sum + survey.participants, 0);
  const avgCompletion = surveys.reduce((sum, survey) => sum + (survey.participants / survey.targetParticipants), 0) / surveys.length * 100;

  return (
    <div className="space-y-6">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage('survey')} position="top" />
      
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Survey Hub</h2>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Surveys</TabsTrigger>
          <TabsTrigger value="builder">Survey Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Surveys</p>
                    <p className="text-2xl font-bold text-foreground">{surveys.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                    <p className="text-2xl font-bold text-foreground">{totalParticipants.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Completion</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round(avgCompletion)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-foreground">{surveys.filter(s => s.priority === 'high').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {getCategoryIcon(category.id)}
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Survey List */}
          <div className="space-y-4">
            {filteredSurveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-secondary/30 rounded-lg">
                          {getCategoryIcon(survey.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{survey.title}</h3>
                          <p className="text-sm text-muted-foreground">{survey.organization}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{survey.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {survey.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="lg:text-right space-y-3">
                      <Badge className={getPriorityColor(survey.priority)}>
                        {survey.priority.toUpperCase()} PRIORITY
                      </Badge>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Deadline: {new Date(survey.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Duration: {survey.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Incentive: {survey.incentive}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Participation Progress</span>
                        <span>{survey.participants.toLocaleString()} / {survey.targetParticipants.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(survey.participants / survey.targetParticipants) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button size="sm" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Take Survey
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Share with Network
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSurveys.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No surveys found in this category.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="builder">
          <SurveyBuilderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};