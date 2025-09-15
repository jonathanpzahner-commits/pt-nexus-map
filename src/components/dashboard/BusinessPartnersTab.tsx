import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building, 
  Users, 
  Plus, 
  Search, 
  Eye, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Star,
  Activity
} from 'lucide-react';

interface BusinessPartner {
  id: string;
  name: string;
  company: string;
  type: string[];
  relationship: 'vendor' | 'consultant' | 'client' | 'strategic-partner';
  priority: 'high' | 'medium' | 'low';
  lastActivity: string;
  nextAction: string;
  website?: string;
  linkedIn?: string;
  contact: {
    email: string;
    phone: string;
  };
  recentActivity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  industryMovements: Array<{
    date: string;
    type: string;
    description: string;
    impact: 'positive' | 'neutral' | 'negative';
  }>;
}

// Mock data for possible introductions
const mockIntroductions = [
  {
    id: '1',
    partner1: 'Sarah Mitchell (PT Excellence Consultants)',
    partner2: 'Dr. Jennifer Rodriguez (Prime Rehab Network)',
    reason: 'Sarah specializes in operational efficiency - could help Jennifer with her contract renewal strategy',
    synergy: 'high',
    mutualBenefit: 'Sarah gains new client, Jennifer gets expert consultation'
  },
  {
    id: '2',
    partner1: 'Michael Chen (HealthTech Solutions)',
    partner2: 'David Thompson (Apex Physical Therapy)',
    reason: 'David is exploring tech upgrades - Michael has the perfect EMR solutions for growing practices',
    synergy: 'medium',
    mutualBenefit: 'Michael expands client base, David gets cutting-edge technology'
  },
  {
    id: '3',
    partner1: 'Dr. Jennifer Rodriguez (Prime Rehab Network)',
    partner2: 'David Thompson (Apex Physical Therapy)',
    reason: 'Both CEOs could share insights on scaling operations and joint venture opportunities',
    synergy: 'high',
    mutualBenefit: 'Knowledge sharing and potential strategic partnership'
  }
];

const synergyColors = {
  high: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Mock data for demonstration
const mockPartners: BusinessPartner[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    company: 'PT Excellence Consultants',
    type: ['Business Consultant', 'CEO'],
    relationship: 'consultant',
    priority: 'high',
    lastActivity: '2 days ago',
    nextAction: 'Follow up on Q4 strategy proposal',
    website: 'https://ptexcellence.com',
    linkedIn: 'https://linkedin.com/in/sarahmitchell',
    contact: {
      email: 'sarah@ptexcellence.com',
      phone: '(555) 123-4567'
    },
    recentActivity: [
      { date: '2024-01-15', type: 'Meeting', description: 'Q4 strategic planning session' },
      { date: '2024-01-10', type: 'Email', description: 'Sent proposal for operational efficiency review' }
    ],
    industryMovements: [
      { date: '2024-01-14', type: 'Expansion', description: 'Opened new clinic location in Austin', impact: 'positive' },
      { date: '2024-01-08', type: 'Partnership', description: 'Announced partnership with major health system', impact: 'positive' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'HealthTech Solutions Inc',
    type: ['Vendor', 'COO'],
    relationship: 'vendor',
    priority: 'high',
    lastActivity: '1 week ago',
    nextAction: 'Review new EMR integration proposal',
    website: 'https://healthtechsolutions.com',
    contact: {
      email: 'mchen@healthtech.com',
      phone: '(555) 234-5678'
    },
    recentActivity: [
      { date: '2024-01-12', type: 'Demo', description: 'New EMR features demonstration' },
      { date: '2024-01-08', type: 'Call', description: 'Discussed integration timeline' }
    ],
    industryMovements: [
      { date: '2024-01-13', type: 'Product Launch', description: 'Released AI-powered patient analytics tool', impact: 'positive' }
    ]
  },
  {
    id: '3',
    name: 'Dr. Jennifer Rodriguez',
    company: 'Prime Rehab Network',
    type: ['Client', 'Clinical Director'],
    relationship: 'client',
    priority: 'high',
    lastActivity: '3 days ago',
    nextAction: 'Schedule contract renewal meeting',
    contact: {
      email: 'jrodriguez@primerehab.com',
      phone: '(555) 345-6789'
    },
    recentActivity: [
      { date: '2024-01-14', type: 'Contract', description: 'Contract renewal discussion' },
      { date: '2024-01-09', type: 'Meeting', description: 'Quarterly business review' }
    ],
    industryMovements: [
      { date: '2024-01-12', type: 'Acquisition', description: 'Acquired 2 competing clinics in metro area', impact: 'positive' },
      { date: '2024-01-07', type: 'Award', description: 'Received "Best Workplace" award', impact: 'positive' }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    company: 'Apex Physical Therapy',
    type: ['Strategic Partner', 'CEO'],
    relationship: 'strategic-partner',
    priority: 'medium',
    lastActivity: '5 days ago',
    nextAction: 'Explore joint venture opportunities',
    contact: {
      email: 'dthompson@apexpt.com',
      phone: '(555) 456-7890'
    },
    recentActivity: [
      { date: '2024-01-11', type: 'Networking', description: 'Industry conference discussion' },
      { date: '2024-01-05', type: 'Email', description: 'Partnership proposal exchange' }
    ],
    industryMovements: [
      { date: '2024-01-10', type: 'Investment', description: 'Secured $2M Series A funding round', impact: 'positive' },
      { date: '2024-01-06', type: 'Leadership', description: 'Hired new VP of Operations', impact: 'neutral' }
    ]
  }
];

const relationshipColors = {
  vendor: 'bg-blue-100 text-blue-800',
  consultant: 'bg-purple-100 text-purple-800',
  client: 'bg-green-100 text-green-800',
  'strategic-partner': 'bg-orange-100 text-orange-800'
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-800'
};

export const BusinessPartnersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filteredPartners = mockPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || partner.relationship === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalMovements = mockPartners.reduce((sum, partner) => {
    return sum + partner.industryMovements.length;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Business Partners</h2>
          <p className="text-muted-foreground">Track your key business relationships and opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{mockPartners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Industry Movements</p>
                <p className="text-2xl font-bold">{totalMovements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{mockPartners.filter(p => p.priority === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Recent Activities</p>
                <p className="text-2xl font-bold">
                  {mockPartners.reduce((sum, p) => sum + p.recentActivity.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="client">Clients</TabsTrigger>
            <TabsTrigger value="vendor">Vendors</TabsTrigger>
            <TabsTrigger value="consultant">Consultants</TabsTrigger>
            <TabsTrigger value="strategic-partner">Strategic</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Partners List */}
      <div className="grid gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner.name}`} />
                  <AvatarFallback>{partner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{partner.name}</h3>
                    <Badge className={relationshipColors[partner.relationship]}>
                      {partner.relationship.replace('-', ' ')}
                    </Badge>
                    <Badge className={priorityColors[partner.priority]}>
                      {partner.priority} priority
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-1">{partner.company}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {partner.type.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Activity</p>
                      <p className="text-sm font-medium">{partner.lastActivity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Action</p>
                      <p className="text-sm font-medium">{partner.nextAction}</p>
                    </div>
                  </div>
                  
                  {partner.industryMovements.length > 0 && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Recent Industry Movements:</p>
                      {partner.industryMovements.map((movement, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{movement.description}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{movement.date}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                movement.impact === 'positive' ? 'border-green-500 text-green-600' :
                                movement.impact === 'negative' ? 'border-red-500 text-red-600' :
                                'border-gray-500 text-gray-600'
                              }`}
                            >
                              {movement.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                {partner.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Possible Introductions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Possible Introductions</h3>
          <Badge variant="outline">{mockIntroductions.length} opportunities</Badge>
        </div>
        
        <div className="grid gap-4">
          {mockIntroductions.map((intro) => (
            <Card key={intro.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{intro.partner1}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-medium text-sm">{intro.partner2}</span>
                    </div>
                    <Badge className={synergyColors[intro.synergy]}>
                      {intro.synergy} synergy
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Introduction Opportunity:</p>
                      <p className="text-sm">{intro.reason}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Mutual Benefit:</p>
                      <p className="text-sm">{intro.mutualBenefit}</p>
                    </div>
                  </div>
                </div>
                
                <Button size="sm" className="ml-4">
                  Facilitate Introduction
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-8">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No partners found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};