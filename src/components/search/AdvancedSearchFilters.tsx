import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Filter, Search } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AdvancedSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  // Basic search
  searchTerm: string;
  entityTypes: string[];
  
  // Location
  location: string;
  radius: number;
  
  // Provider-specific
  specializations: string[];
  yearsExperience: [number, number];
  licenseState: string;
  currentEmployer: string;
  
  // Company-specific
  companyType: string;
  employeeCount: [number, number];
  founded: [number, number];
  services: string[];
  
  // School-specific
  accreditation: string;
  programTypes: string[];
  tuitionRange: [number, number];
  
  // Job-specific
  employmentType: string;
  experienceLevel: string;
  salaryRange: [number, number];
  isRemote: boolean | null;
  
  // PE Firm specific
  firmType: string;
  dealSizeRange: [number, number];
  healthcareFocus: boolean | null;
  investmentStage: string[];
  
  // Consultant-specific
  consultingCategories: string[];
  industries: string[];
  territories: string[];
}

const initialFilters: SearchFilters = {
  searchTerm: '',
  entityTypes: ['providers', 'companies', 'schools', 'job_listings', 'equipment_companies', 'consultant_companies', 'pe_firms'],
  location: '',
  radius: 50,
  specializations: [],
  yearsExperience: [0, 30],
  licenseState: '',
  currentEmployer: '',
  companyType: '',
  employeeCount: [1, 10000],
  founded: [1900, new Date().getFullYear()],
  services: [],
  accreditation: '',
  programTypes: [],
  tuitionRange: [0, 200000],
  employmentType: '',
  experienceLevel: '',
  salaryRange: [0, 300000],
  isRemote: null,
  firmType: '',
  dealSizeRange: [1000000, 1000000000],
  healthcareFocus: null,
  investmentStage: [],
  consultingCategories: [],
  industries: [],
  territories: []
};

export const AdvancedSearchFilters = ({ onSearch, onClear, isLoading }: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    location: false,
    providers: false,
    companies: false,
    schools: false,
    jobs: false,
    peFirms: false,
    consultants: false
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    onClear();
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const entityTypeOptions = [
    { id: 'providers', label: 'Physical Therapists', icon: '👩‍⚕️' },
    { id: 'companies', label: 'PT Companies', icon: '🏢' },
    { id: 'schools', label: 'PT Schools', icon: '🎓' },
    { id: 'job_listings', label: 'Job Openings', icon: '💼' },
    { id: 'equipment_companies', label: 'Equipment Companies', icon: '🏭' },
    { id: 'consultant_companies', label: 'Consultant Companies', icon: '💡' },
    { id: 'pe_firms', label: 'PE Firms', icon: '💰' }
  ];

  const specializations = [
    'Orthopedic', 'Neurologic', 'Sports Medicine', 'Pediatric', 'Geriatric',
    'Cardiac', 'Pulmonary', 'Women\'s Health', 'Aquatic', 'Manual Therapy',
    'Dry Needling', 'Vestibular', 'Hand Therapy', 'Wound Care', 'Lymphedema'
  ];

  const consultingCategories = [
    'Human Resources', 'Recruiting - Travel PT', 'Recruiting - Permanent Placement',
    'Recruiting - Executive', 'Front Office Operations (Revenue Cycle)', 'Operations',
    'Financial', 'MSO', 'M&A', 'Technology Implementation', 'Quality Improvement',
    'Compliance', 'Marketing', 'Strategic Planning'
  ];

  const investmentStages = ['Seed', 'Series A', 'Series B', 'Growth', 'Buyout', 'Expansion', 'Recapitalization'];

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Advanced PT Ecosystem Search</h2>
              <p className="text-muted-foreground">Use specific filters to find exactly what you need</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Enter names, specialties, locations, companies..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? 'Searching...' : 'Search PT Ecosystem'}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Types */}
      <Card>
        <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  What to Search
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {entityTypeOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.entityTypes.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('entityTypes', [...filters.entityTypes, option.id]);
                        } else {
                          updateFilter('entityTypes', filters.entityTypes.filter(t => t !== option.id));
                        }
                      }}
                    />
                    <Label htmlFor={option.id} className="cursor-pointer flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Location Filters */}
      <Card>
        <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>📍 Location & Geography</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.location ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label>Location (City, State, ZIP)</Label>
                <Input
                  placeholder="e.g., Los Angeles, CA or 90210"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>
              <div>
                <Label>Search Radius: {filters.radius} miles</Label>
                <Slider
                  value={[filters.radius]}
                  onValueChange={([value]) => updateFilter('radius', value)}
                  max={500}
                  min={1}
                  step={5}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Provider-Specific Filters */}
      {filters.entityTypes.includes('providers') && (
        <Card>
          <Collapsible open={expandedSections.providers} onOpenChange={() => toggleSection('providers')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle>👩‍⚕️ Physical Therapist Filters</CardTitle>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.providers ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <Label>Specializations</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {specializations.map(spec => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={filters.specializations.includes(spec)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('specializations', [...filters.specializations, spec]);
                            } else {
                              updateFilter('specializations', filters.specializations.filter(s => s !== spec));
                            }
                          }}
                        />
                        <Label htmlFor={spec} className="text-sm cursor-pointer">{spec}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Years of Experience: {filters.yearsExperience[0]} - {filters.yearsExperience[1]} years</Label>
                  <Slider
                    value={filters.yearsExperience}
                    onValueChange={(value) => updateFilter('yearsExperience', value as [number, number])}
                    max={30}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>License State</Label>
                    <Input
                      placeholder="e.g., CA, NY, TX"
                      value={filters.licenseState}
                      onChange={(e) => updateFilter('licenseState', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Current Employer</Label>
                    <Input
                      placeholder="Company or facility name"
                      value={filters.currentEmployer}
                      onChange={(e) => updateFilter('currentEmployer', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* PE Firm Filters */}
      {filters.entityTypes.includes('pe_firms') && (
        <Card>
          <Collapsible open={expandedSections.peFirms} onOpenChange={() => toggleSection('peFirms')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle>💰 Private Equity Firm Filters</CardTitle>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.peFirms ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <Label>Deal Size Range: ${(filters.dealSizeRange[0] / 1000000).toFixed(1)}M - ${(filters.dealSizeRange[1] / 1000000).toFixed(0)}M</Label>
                  <Slider
                    value={filters.dealSizeRange}
                    onValueChange={(value) => updateFilter('dealSizeRange', value as [number, number])}
                    max={1000000000}
                    min={1000000}
                    step={1000000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Investment Stage</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {investmentStages.map(stage => (
                      <div key={stage} className="flex items-center space-x-2">
                        <Checkbox
                          id={stage}
                          checked={filters.investmentStage.includes(stage)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('investmentStage', [...filters.investmentStage, stage]);
                            } else {
                              updateFilter('investmentStage', filters.investmentStage.filter(s => s !== stage));
                            }
                          }}
                        />
                        <Label htmlFor={stage} className="text-sm cursor-pointer">{stage}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Healthcare Focus</Label>
                  <Select value={filters.healthcareFocus?.toString() || 'all'} onValueChange={(value) => updateFilter('healthcareFocus', value === 'all' ? null : value === 'true')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Focus</SelectItem>
                      <SelectItem value="true">Healthcare Focused</SelectItem>
                      <SelectItem value="false">Non-Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Consultant Filters */}
      {filters.entityTypes.includes('consultant_companies') && (
        <Card>
          <Collapsible open={expandedSections.consultants} onOpenChange={() => toggleSection('consultants')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle>💡 Consultant Company Filters</CardTitle>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.consultants ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <Label>Consulting Categories</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {consultingCategories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.consultingCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('consultingCategories', [...filters.consultingCategories, category]);
                            } else {
                              updateFilter('consultingCategories', filters.consultingCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm cursor-pointer">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
};