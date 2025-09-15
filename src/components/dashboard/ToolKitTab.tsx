import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Megaphone, 
  Users, 
  Search, 
  GraduationCap,
  Briefcase,
  TrendingUp,
  FileText,
  Lightbulb,
  Target,
  Star,
  ExternalLink,
  Download,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface ToolResource {
  id: string;
  title: string;
  category: 'marketing' | 'recruiting' | 'career' | 'education' | 'business' | 'clinical';
  type: 'template' | 'guide' | 'checklist' | 'tool' | 'calculator' | 'course';
  description: string;
  targetAudience: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  isFree: boolean;
  price?: number;
  tags: string[];
  url: string;
}

const mockResources: ToolResource[] = [
  {
    id: '1',
    title: 'PT Clinic Social Media Marketing Kit',
    category: 'marketing',
    type: 'template',
    description: 'Complete social media templates, posting schedules, and content ideas specifically designed for PT practices.',
    targetAudience: ['Clinic Owners', 'Marketing Professionals'],
    difficulty: 'beginner',
    rating: 4.7,
    downloads: 1850,
    isFree: true,
    tags: ['Social Media', 'Templates', 'Content Marketing', 'Engagement'],
    url: '#'
  },
  {
    id: '2',
    title: 'New Graduate PT Job Interview Prep Guide',
    category: 'career',
    type: 'guide',
    description: 'Comprehensive interview preparation including common questions, salary negotiation tips, and portfolio examples.',
    targetAudience: ['Students', 'New Graduates'],
    difficulty: 'beginner',
    rating: 4.9,
    downloads: 3200,
    isFree: true,
    tags: ['Interview Prep', 'Career', 'New Graduate', 'Job Search'],
    url: '#'
  },
  {
    id: '3',
    title: 'PT Staff Retention Strategies Checklist',
    category: 'recruiting',
    type: 'checklist',
    description: 'Evidence-based checklist for improving employee satisfaction and reducing turnover in PT practices.',
    targetAudience: ['Clinic Owners', 'HR Managers', 'Practice Managers'],
    difficulty: 'intermediate',
    rating: 4.5,
    downloads: 980,
    isFree: false,
    price: 19.99,
    tags: ['Retention', 'Employee Satisfaction', 'HR', 'Management'],
    url: '#'
  },
  {
    id: '4',
    title: 'Clinical Competency Assessment Template',
    category: 'education',
    type: 'template',
    description: 'Structured assessment forms for evaluating student and new graduate clinical skills across PT specialties.',
    targetAudience: ['Professors', 'Clinical Instructors', 'Supervisors'],
    difficulty: 'intermediate',
    rating: 4.6,
    downloads: 1200,
    isFree: true,
    tags: ['Assessment', 'Education', 'Clinical Skills', 'Competency'],
    url: '#'
  },
  {
    id: '5',
    title: 'Practice Revenue Calculator & Optimizer',
    category: 'business',
    type: 'calculator',
    description: 'Interactive tool to analyze practice revenue streams and identify optimization opportunities.',
    targetAudience: ['Clinic Owners', 'Practice Managers', 'Consultants'],
    difficulty: 'advanced',
    rating: 4.8,
    downloads: 750,
    isFree: false,
    price: 49.99,
    tags: ['Revenue', 'Financial Analysis', 'Business Optimization', 'ROI'],
    url: '#'
  },
  {
    id: '6',
    title: 'Patient Outcome Tracking Spreadsheet',
    category: 'clinical',
    type: 'tool',
    description: 'Excel template for tracking patient outcomes with built-in analytics and reporting features.',
    targetAudience: ['Clinicians', 'Researchers', 'Quality Managers'],
    difficulty: 'intermediate',
    rating: 4.4,
    downloads: 1650,
    isFree: true,
    tags: ['Outcomes', 'Data Tracking', 'Analytics', 'Patient Care'],
    url: '#'
  },
  {
    id: '7',
    title: 'PT Specialty Certification Roadmap',
    category: 'career',
    type: 'guide',
    description: 'Step-by-step guide to pursuing specialty certifications with timeline recommendations and study resources.',
    targetAudience: ['Clinicians', 'Career Changers'],
    difficulty: 'beginner',
    rating: 4.7,
    downloads: 2100,
    isFree: true,
    tags: ['Certification', 'Career Development', 'Specialization', 'Professional Growth'],
    url: '#'
  },
  {
    id: '8',
    title: 'Patient Referral Network Builder',
    category: 'marketing',
    type: 'template',
    description: 'Templates and strategies for building relationships with physicians and creating effective referral systems.',
    targetAudience: ['Clinic Owners', 'Business Development'],
    difficulty: 'intermediate',
    rating: 4.3,
    downloads: 890,
    isFree: false,
    price: 29.99,
    tags: ['Referrals', 'Networking', 'Business Development', 'Relationships'],
    url: '#'
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Wrench },
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'recruiting', name: 'Recruiting & HR', icon: Users },
  { id: 'career', name: 'Career Development', icon: TrendingUp },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'business', name: 'Business & Finance', icon: DollarSign },
  { id: 'clinical', name: 'Clinical Practice', icon: FileText }
];

const targetAudiences = ['All', 'Students', 'New Graduates', 'Clinicians', 'Clinic Owners', 'Professors', 'Consultants'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export const ToolKitTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesAudience = selectedAudience === 'All' || resource.targetAudience.includes(selectedAudience);
    const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesAudience && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return <FileText className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'checklist': return <Target className="h-4 w-4" />;
      case 'tool': return <Wrench className="h-4 w-4" />;
      case 'calculator': return <TrendingUp className="h-4 w-4" />;
      case 'course': return <GraduationCap className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">PT Professional Toolkit</h2>
        <Badge variant="outline">{filteredResources.length} resources</Badge>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools, templates, guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Target Audience:</p>
            <div className="flex flex-wrap gap-1">
              {targetAudiences.map(audience => (
                <Badge
                  key={audience}
                  variant={selectedAudience === audience ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedAudience(audience)}
                >
                  {audience}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 text-xs">
              <category.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(resource.type)}
                      <h3 className="text-lg font-semibold">{resource.title}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {resource.type}
                      </Badge>
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                      {resource.isFree && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          FREE
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm">{resource.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{resource.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.downloads} downloads</span>
                        </div>
                        {resource.price && (
                          <div className="font-medium">${resource.price}</div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Target Audience:</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.targetAudience.map(audience => (
                            <Badge key={audience} variant="outline" className="text-xs">
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {resource.isFree ? 'Download' : 'Get Tool'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No tools found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria or browse by category.</p>
        </div>
      )}
    </div>
  );
};