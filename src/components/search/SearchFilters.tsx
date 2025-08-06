import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Filter } from 'lucide-react';
import { useState } from 'react';
import { SearchFilters as SearchFiltersType } from '@/hooks/useSearch';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export const SearchFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  totalResults 
}: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const entityTypeOptions = [
    { id: 'companies', label: 'Companies', color: 'bg-blue-500' },
    { id: 'schools', label: 'Schools', color: 'bg-green-500' },
    { id: 'providers', label: 'Providers', color: 'bg-amber-500' },
    { id: 'job_listings', label: 'Job Listings', color: 'bg-red-500' },
  ];

  const companyTypes = [
    'Private Practice',
    'Hospital System', 
    'Rehabilitation Center',
    'Sports Medicine',
    'Home Health',
    'Outpatient Clinic',
    'Technology Company',
    'Consulting Firm'
  ];

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Per Diem',
    'Travel',
    'Remote'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Director',
    'Executive'
  ];

  const handleEntityTypeChange = (entityType: string, checked: boolean) => {
    const newEntityTypes = checked 
      ? [...filters.entityTypes, entityType as any]
      : filters.entityTypes.filter(type => type !== entityType);
    
    onFiltersChange({ entityTypes: newEntityTypes });
  };

  const activeFiltersCount = [
    filters.location,
    filters.specialization,
    filters.companyType,
    filters.employmentType,
    filters.experienceLevel,
  ].filter(Boolean).length + (4 - filters.entityTypes.length);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-sm">Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {totalResults} results
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Entity Types */}
            <div>
              <Label className="text-sm font-medium">Show</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {entityTypeOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.entityTypes.includes(option.id as any)}
                      onCheckedChange={(checked) => 
                        handleEntityTypeChange(option.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={option.id}
                      className="text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={filters.location}
                onChange={(e) => onFiltersChange({ location: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Specialization */}
            <div>
              <Label htmlFor="specialization" className="text-sm font-medium">
                Specialization/Program
              </Label>
              <Input
                id="specialization"
                placeholder="e.g., Orthopedic, Neurologic, Sports"
                value={filters.specialization}
                onChange={(e) => onFiltersChange({ specialization: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Company Type */}
              <div>
                <Label className="text-sm font-medium">Company Type</Label>
                <Select 
                  value={filters.companyType} 
                  onValueChange={(value) => onFiltersChange({ companyType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {companyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type */}
              <div>
                <Label className="text-sm font-medium">Employment Type</Label>
                <Select 
                  value={filters.employmentType} 
                  onValueChange={(value) => onFiltersChange({ employmentType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <Label className="text-sm font-medium">Experience Level</Label>
                <Select 
                  value={filters.experienceLevel} 
                  onValueChange={(value) => onFiltersChange({ experienceLevel: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any level</SelectItem>
                    {experienceLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};