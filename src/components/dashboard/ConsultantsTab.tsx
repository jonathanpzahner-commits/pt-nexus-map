import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';
import { 
  Users, 
  TrendingUp, 
  GraduationCap, 
  CreditCard, 
  UserCheck, 
  Building2,
  Search,
  Star,
  MapPin,
  Clock,
  Monitor
} from 'lucide-react';

const consultantCategories = [
  {
    id: 'talent',
    title: 'Talent',
    icon: Users,
    description: 'Recruitment, staffing, and talent acquisition specialists',
    consultants: [
      { name: 'PT Talent Solutions', specialty: 'Executive Recruitment', rating: 4.8, location: 'Chicago, IL' },
      { name: 'HealthCare Staffing Pro', specialty: 'Permanent Placement', rating: 4.7, location: 'Austin, TX' },
      { name: 'Rehab Recruiters Inc', specialty: 'Travel PT Staffing', rating: 4.9, location: 'Denver, CO' }
    ]
  },
  {
    id: 'ma',
    title: 'M&A',
    icon: TrendingUp,
    description: 'Mergers, acquisitions, and business valuation experts',
    consultants: [
      { name: 'Healthcare M&A Advisors', specialty: 'Practice Acquisitions', rating: 4.9, location: 'New York, NY' },
      { name: 'PT Practice Brokers', specialty: 'Business Valuation', rating: 4.6, location: 'Los Angeles, CA' },
      { name: 'Rehab Capital Partners', specialty: 'Strategic Partnerships', rating: 4.8, location: 'Boston, MA' }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Continuing education and professional development',
    consultants: [
      { name: 'PT Education Experts', specialty: 'CEU Programs', rating: 4.7, location: 'Seattle, WA' },
      { name: 'Advanced Rehab Learning', specialty: 'Specialty Certifications', rating: 4.8, location: 'Atlanta, GA' },
      { name: 'Clinical Excellence Training', specialty: 'Leadership Development', rating: 4.9, location: 'Phoenix, AZ' }
    ]
  },
  {
    id: 'billing',
    title: 'Front Office-Billing',
    icon: CreditCard,
    description: 'Revenue cycle management and billing optimization',
    consultants: [
      { name: 'PT Billing Solutions', specialty: 'Revenue Cycle Mgmt', rating: 4.8, location: 'Dallas, TX' },
      { name: 'HealthCare RCM Pro', specialty: 'Insurance Optimization', rating: 4.7, location: 'Miami, FL' },
      { name: 'Rehab Revenue Partners', specialty: 'Billing Compliance', rating: 4.9, location: 'Portland, OR' }
    ]
  },
  {
    id: 'hr',
    title: 'Human Resources',
    icon: UserCheck,
    description: 'HR strategy, compliance, and employee management',
    consultants: [
      { name: 'PT HR Consultants', specialty: 'HR Compliance', rating: 4.6, location: 'San Francisco, CA' },
      { name: 'Healthcare HR Solutions', specialty: 'Employee Relations', rating: 4.8, location: 'Nashville, TN' },
      { name: 'Rehab People Partners', specialty: 'Performance Management', rating: 4.7, location: 'Minneapolis, MN' }
    ]
  },
  {
    id: 'technology',
    title: 'Technology',
    icon: Monitor,
    description: 'EMR, practice management software, and digital solutions',
    consultants: [
      { name: 'PT Tech Solutions', specialty: 'EMR Implementation', rating: 4.8, location: 'Silicon Valley, CA' },
      { name: 'Digital Health Partners', specialty: 'Practice Management', rating: 4.7, location: 'Austin, TX' },
      { name: 'Rehab Tech Advisors', specialty: 'Telehealth Integration', rating: 4.9, location: 'Seattle, WA' }
    ]
  },
  {
    id: 'growth',
    title: 'Growth',
    icon: Building2,
    description: 'Business expansion, marketing, and strategic growth',
    consultants: [
      { name: 'PT Growth Strategists', specialty: 'Market Expansion', rating: 4.9, location: 'Houston, TX' },
      { name: 'Rehab Marketing Pro', specialty: 'Digital Marketing', rating: 4.7, location: 'San Diego, CA' },
      { name: 'Healthcare Growth Partners', specialty: 'Strategic Planning', rating: 4.8, location: 'Charlotte, NC' }
    ]
  }
];

export const ConsultantsTab = () => {
  return (
    <div className="space-y-6">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage('consultants')} position="top" />
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Consultant Directory</h1>
          <p className="text-muted-foreground">
            Find specialized consultants for your physical therapy practice needs
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search consultants by specialty, location, or name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Filter by Location
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6">
        {consultantCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl">{category.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {category.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.consultants.map((consultant, index) => (
                    <Card key={index} className="border border-border/50 hover:border-primary/20 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">
                            {consultant.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {consultant.specialty}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{consultant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{consultant.location}</span>
                          </div>
                          <div className="pt-2">
                            <Button size="sm" className="w-full">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View All {category.title} Consultants
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Consultant CTA */}
      <Card className="border-dashed border-2 border-primary/20">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Are you a consultant?</h3>
          <p className="text-muted-foreground mb-4">
            Join our directory and connect with physical therapy practices seeking your expertise
          </p>
          <Button>
            Add Your Consulting Services
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};