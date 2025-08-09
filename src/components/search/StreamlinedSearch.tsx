import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SearchResults } from './SearchResults';
import { useServerSearch } from '@/hooks/useServerSearch';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface StreamlinedSearchProps {
  contextTypes?: string[];
}

export const StreamlinedSearch = ({ contextTypes }: StreamlinedSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    isLoading,
    totalResults,
  } = useServerSearch(contextTypes as any);

  const allEntityTypes = [
    { id: 'providers', label: 'Providers', color: 'bg-amber-500' },
    { id: 'companies', label: 'Companies', color: 'bg-blue-500' },
    { id: 'schools', label: 'Schools', color: 'bg-green-500' },
    { id: 'job_listings', label: 'Jobs', color: 'bg-red-500' },
    { id: 'consultant_companies', label: 'Consultants', color: 'bg-purple-500' },
    { id: 'equipment_companies', label: 'Equipment', color: 'bg-orange-500' },
    { id: 'pe_firms', label: 'PE Firms', color: 'bg-gray-500' },
    { id: 'profiles', label: 'Profiles', color: 'bg-pink-500' },
  ];

  const availableEntityTypes = contextTypes 
    ? allEntityTypes.filter(type => contextTypes.includes(type.id))
    : allEntityTypes;

  // Debounced location search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationInput.trim().length > 2) {
        fetchLocationSuggestions(locationInput.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [locationInput]);

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        fetchSearchSuggestions(searchQuery.trim());
      } else {
        setSearchSuggestions([]);
        setShowSearchSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('location-autocomplete', {
        body: { query }
      });
      if (error) {
        console.error('Location autocomplete error:', error);
        return;
      }
      if (data?.features) {
        setSuggestions(data.features.slice(0, 5));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Location search error:', error);
      toast({
        title: "Location search unavailable",
        description: "Please configure Mapbox token in edge function secrets",
        variant: "destructive"
      });
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    try {
      const searchTerm = query.toLowerCase();
      const suggestions: any[] = [];

      // Get company suggestions
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, company_type, city, state')
        .or(`name.ilike.%${searchTerm}%,company_type.ilike.%${searchTerm}%`)
        .limit(5);

      if (companies) {
        companies.forEach(company => {
          suggestions.push({
            id: company.id,
            type: 'company',
            title: company.name,
            subtitle: company.company_type,
            location: `${company.city}, ${company.state}`,
            category: 'Companies'
          });
        });
      }

      // Get provider suggestions
      const { data: providers } = await supabase
        .from('providers')
        .select('id, name, first_name, last_name, current_job_title, city, state, specializations')
        .or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,current_job_title.ilike.%${searchTerm}%,specializations.cs.{${searchTerm}}`)
        .limit(5);

      if (providers) {
        providers.forEach(provider => {
          suggestions.push({
            id: provider.id,
            type: 'provider',
            title: provider.name || `${provider.first_name} ${provider.last_name}`,
            subtitle: provider.current_job_title || 'Physical Therapist',
            location: `${provider.city}, ${provider.state}`,
            category: 'Providers'
          });
        });
      }

      // Get specialization suggestions
      const specializations = [
        'Orthopedic', 'Sports Medicine', 'Neurology', 'Geriatric', 'Pediatric',
        'Cardiopulmonary', 'Aquatic Therapy', 'Manual Therapy', 'Women\'s Health',
        'Vestibular', 'Hand Therapy', 'Wound Care'
      ];
      
      specializations.forEach(spec => {
        if (spec.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            id: spec,
            type: 'specialization',
            title: spec,
            subtitle: 'Specialization',
            category: 'Specializations'
          });
        }
      });

      setSearchSuggestions(suggestions.slice(0, 8));
      setShowSearchSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Search suggestions error:', error);
    }
  };

  const setLocation = (suggestion: LocationSuggestion) => {
    const [longitude, latitude] = suggestion.center;
    setLocationInput(suggestion.place_name);
    setShowSuggestions(false);
    updateFilters({
      userLatitude: latitude,
      userLongitude: longitude,
      location: suggestion.place_name
    });
  };

  const selectSearchSuggestion = (suggestion: any) => {
    if (suggestion.type === 'specialization') {
      updateFilters({ specialization: suggestion.title });
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion.title);
      // Navigate to entity details if it's a specific entity
      if (suggestion.id && suggestion.type !== 'specialization') {
        window.location.href = `/entity/${suggestion.type === 'provider' ? 'providers' : 'companies'}/${suggestion.id}`;
      }
    }
    setShowSearchSuggestions(false);
  };

  const handleEntityTypeChange = (entityType: string, checked: boolean) => {
    const newEntityTypes = checked 
      ? [...filters.entityTypes, entityType as any]
      : filters.entityTypes.filter(type => type !== entityType);
    updateFilters({ entityTypes: newEntityTypes });
  };

  const activeFiltersCount = [
    filters.location,
    filters.specialization,
    filters.companyType,
    filters.employmentType,
    filters.experienceLevel,
  ].filter(Boolean).length + (availableEntityTypes.length - filters.entityTypes.length);

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder="Search providers, companies, specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchSuggestions.length > 0 && setShowSearchSuggestions(true)}
                className="pl-10 h-10"
              />
              
              {/* Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id || index}`}
                      className="w-full px-3 py-2 text-left hover:bg-accent text-sm border-b border-border last:border-b-0 flex items-center justify-between"
                      onClick={() => selectSearchSuggestion(suggestion)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.subtitle}</div>
                        {suggestion.location && (
                          <div className="text-xs text-muted-foreground">{suggestion.location}</div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Location Search */}
            <div className="relative w-64">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={inputRef}
                placeholder="Location..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="pl-10 h-10"
              />
              
              {/* Location Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="w-full px-3 py-2 text-left hover:bg-accent text-sm"
                      onClick={() => setLocation(suggestion)}
                    >
                      {suggestion.place_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Radius */}
            <Select value={filters.radius?.toString() || "25"} onValueChange={(value) => updateFilters({ radius: Number(value) })}>
              <SelectTrigger className="w-24 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10mi</SelectItem>
                <SelectItem value="25">25mi</SelectItem>
                <SelectItem value="50">50mi</SelectItem>
                <SelectItem value="100">100mi</SelectItem>
              </SelectContent>
            </Select>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-3"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`ml-2 h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Profile Placeholder */}
      {!searchQuery && results.length === 0 && !isLoading && (
        <Card className="opacity-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-muted-foreground">Dr. Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Physical Therapist • Sports Medicine</p>
                <p className="text-xs text-muted-foreground">New York, NY • 5.2 miles away</p>
              </div>
              <Badge variant="secondary" className="opacity-50">Example</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {(searchQuery || totalResults > 0) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{totalResults.toLocaleString()} results found</span>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Expandable Filters */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Entity Types */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Show</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableEntityTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={filters.entityTypes.includes(type.id as any)}
                        onCheckedChange={(checked) => handleEntityTypeChange(type.id, checked as boolean)}
                      />
                      <Label htmlFor={type.id} className="text-sm flex items-center gap-2 cursor-pointer">
                        <div className={`w-2 h-2 rounded-full ${type.color}`} />
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Specialization</Label>
                  <Input
                    placeholder="e.g., Orthopedic, Sports"
                    value={filters.specialization || ''}
                    onChange={(e) => updateFilters({ specialization: e.target.value })}
                    className="mt-1"
                  />
                </div>

                {/* Conditional filters based on context */}
                {(!contextTypes || contextTypes.some(type => ['companies', 'consultant_companies', 'equipment_companies'].includes(type))) && (
                  <div>
                    <Label className="text-sm font-medium">Company Type</Label>
                    <Select value={filters.companyType || "all"} onValueChange={(value) => updateFilters({ companyType: value === "all" ? "" : value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        <SelectItem value="Private Practice">Private Practice</SelectItem>
                        <SelectItem value="Hospital System">Hospital System</SelectItem>
                        <SelectItem value="Rehabilitation Center">Rehabilitation Center</SelectItem>
                        <SelectItem value="Sports Medicine">Sports Medicine</SelectItem>
                        <SelectItem value="Home Health">Home Health</SelectItem>
                        <SelectItem value="Outpatient Clinic">Outpatient Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(!contextTypes || contextTypes.includes('job_listings')) && (
                  <div>
                    <Label className="text-sm font-medium">Employment Type</Label>
                    <Select value={filters.employmentType || "all"} onValueChange={(value) => updateFilters({ employmentType: value === "all" ? "" : value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(!contextTypes || contextTypes.some(type => ['providers', 'job_listings'].includes(type))) && (
                  <div>
                    <Label className="text-sm font-medium">Experience Level</Label>
                    <Select value={filters.experienceLevel || "all"} onValueChange={(value) => updateFilters({ experienceLevel: value === "all" ? "" : value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any level</SelectItem>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Search Results */}
      {(searchQuery || isLoading || totalResults > 0) && (
        <SearchResults results={results as any} isLoading={isLoading} />
      )}
    </div>
  );
};