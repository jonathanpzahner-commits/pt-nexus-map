import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Search, 
  ExternalLink,
  Download,
  Star,
  Calendar,
  Users,
  Filter
} from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  publisher?: string;
  publishDate: string;
  type: 'research' | 'book' | 'textbook' | 'manual';
  category: string;
  description: string;
  rating: number;
  downloads: number;
  price?: number;
  isFree: boolean;
  url: string;
  tags: string[];
}

const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Evidence-Based Manual Therapy Techniques for Lower Back Pain',
    authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
    journal: 'Journal of Physical Therapy Research',
    publishDate: '2024-01-15',
    type: 'research',
    category: 'Orthopedics',
    description: 'Comprehensive systematic review analyzing the effectiveness of manual therapy interventions for chronic lower back pain.',
    rating: 4.8,
    downloads: 2450,
    isFree: true,
    url: '#',
    tags: ['Manual Therapy', 'Lower Back Pain', 'Evidence-Based', 'Systematic Review']
  },
  {
    id: '2',
    title: 'Clinical Practice Management: From Startup to Success',
    authors: ['Jennifer Martinez', 'PT, MBA'],
    publisher: 'PT Business Publications',
    publishDate: '2023-11-20',
    type: 'book',
    category: 'Practice Management',
    description: 'Complete guide to starting, managing, and growing a successful physical therapy practice in today\'s healthcare environment.',
    rating: 4.6,
    downloads: 1890,
    price: 49.99,
    isFree: false,
    url: '#',
    tags: ['Business', 'Practice Management', 'Entrepreneurship', 'Healthcare']
  },
  {
    id: '3',
    title: 'Neuroplasticity and Motor Learning in Stroke Rehabilitation',
    authors: ['Dr. Robert Kim', 'Dr. Lisa Patel', 'Dr. James Wilson'],
    journal: 'Neurorehabilitation Today',
    publishDate: '2024-02-10',
    type: 'research',
    category: 'Neurology',
    description: 'Latest research on neuroplasticity principles and their application in stroke recovery protocols.',
    rating: 4.9,
    downloads: 3200,
    isFree: true,
    url: '#',
    tags: ['Neuroplasticity', 'Stroke', 'Motor Learning', 'Rehabilitation']
  },
  {
    id: '4',
    title: 'Pediatric Physical Therapy Assessment and Treatment Manual',
    authors: ['Dr. Amanda Foster'],
    publisher: 'Pediatric PT Press',
    publishDate: '2023-09-05',
    type: 'textbook',
    category: 'Pediatrics',
    description: 'Comprehensive textbook covering developmental assessments and treatment approaches for pediatric populations.',
    rating: 4.7,
    downloads: 1550,
    price: 89.99,
    isFree: false,
    url: '#',
    tags: ['Pediatrics', 'Assessment', 'Development', 'Treatment']
  },
  {
    id: '5',
    title: 'Sports Injury Prevention Protocols: A Data-Driven Approach',
    authors: ['Dr. Mark Thompson', 'Dr. Jessica Lee'],
    journal: 'Sports Physical Therapy Journal',
    publishDate: '2024-03-01',
    type: 'research',
    category: 'Sports Medicine',
    description: 'Analysis of injury prevention strategies across multiple sports using machine learning and outcome data.',
    rating: 4.5,
    downloads: 1750,
    isFree: false,
    price: 29.99,
    url: '#',
    tags: ['Sports Medicine', 'Injury Prevention', 'Data Analysis', 'Athletes']
  },
  {
    id: '6',
    title: 'Geriatric Physical Therapy: Evidence and Practice',
    authors: ['Dr. Patricia Davis', 'Dr. William Brown'],
    publisher: 'Aging & Rehabilitation Press',
    publishDate: '2023-12-15',
    type: 'textbook',
    category: 'Geriatrics',
    description: 'Essential guide to physical therapy interventions for older adults, including fall prevention and mobility enhancement.',
    rating: 4.4,
    downloads: 980,
    price: 75.00,
    isFree: false,
    url: '#',
    tags: ['Geriatrics', 'Fall Prevention', 'Mobility', 'Aging']
  }
];

const categories = ['All', 'Orthopedics', 'Neurology', 'Sports Medicine', 'Pediatrics', 'Geriatrics', 'Practice Management'];
const types = ['All', 'research', 'book', 'textbook', 'manual'];

export const ResearchPublicationsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPublications = mockPublications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         pub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    const matchesType = selectedType === 'All' || pub.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getPublicationsByType = (type: string) => {
    if (type === 'all') return filteredPublications;
    return filteredPublications.filter(pub => pub.type === type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return <FileText className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'textbook': return <BookOpen className="h-4 w-4" />;
      case 'manual': return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">PT Research & Publications</h2>
        <Badge variant="outline">{filteredPublications.length} publications</Badge>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search publications, authors, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="default">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Publication Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Research
          </TabsTrigger>
          <TabsTrigger value="book" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="textbook" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Textbooks
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manuals
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {getPublicationsByType(activeTab).map((publication) => (
              <Card key={publication.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(publication.type)}
                      <h3 className="text-lg font-semibold">{publication.title}</h3>
                      <Badge variant="secondary">{publication.category}</Badge>
                      {publication.isFree && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          FREE
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {publication.authors.join(', ')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(publication.publishDate).toLocaleDateString()}
                        </div>
                        {publication.journal && (
                          <div>Published in: {publication.journal}</div>
                        )}
                        {publication.publisher && (
                          <div>Publisher: {publication.publisher}</div>
                        )}
                      </div>
                      
                      <p className="text-sm">{publication.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{publication.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span className="text-sm">{publication.downloads} downloads</span>
                        </div>
                        {publication.price && (
                          <div className="text-sm font-medium">${publication.price}</div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {publication.tags.map(tag => (
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
                      {publication.isFree ? 'Download' : 'Purchase'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPublications.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No publications found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria or browse by category.</p>
        </div>
      )}
    </div>
  );
};