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
import { ProviderFilters } from './ProviderFilters';
import { ConsultantFilters } from './ConsultantFilters';
import { SchoolFilters } from './SchoolFilters';
import { useServerSearch } from '@/hooks/useServerSearch';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  place_type?: string[];
  context?: Array<{ text: string; id: string }>;
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
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchSuggestionsRef = useRef<HTMLDivElement>(null);
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close location suggestions
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      
      // Close search suggestions
      if (
        searchSuggestionsRef.current &&
        !searchSuggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allEntityTypes = [
    { id: 'providers', label: 'Providers', color: 'bg-amber-500' },
    { id: 'companies', label: 'Companies', color: 'bg-blue-500' },
    { id: 'schools', label: 'Schools', color: 'bg-green-500' },
    { id: 'job_listings', label: 'Jobs', color: 'bg-red-500' },
    { id: 'consultant_companies', label: 'Consultants', color: 'bg-purple-500' },
    { id: 'equipment_companies', label: 'Equipment Vendors', color: 'bg-orange-500' },
    { id: 'pe_firms', label: 'PE Firms', color: 'bg-gray-500' },
    { id: 'profiles', label: 'Profiles', color: 'bg-pink-500' },
  ];

  const availableEntityTypes = contextTypes 
    ? allEntityTypes.filter(type => contextTypes.includes(type.id))
    : allEntityTypes;

  // Debounced location search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationInput.trim().length > 1) { // Reduced from 2 to 1
        console.log("Triggering location search for:", locationInput.trim());
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
      console.log("Fetching location suggestions for:", query);
      const { data, error } = await supabase.functions.invoke('location-autocomplete', {
        body: { query }
      });
      
      console.log("Location autocomplete response:", data, error);
      
      if (error) {
        console.error('Location autocomplete error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      if (data?.features && Array.isArray(data.features) && data.features.length > 0) {
        console.log("Setting suggestions:", data.features);
        setSuggestions(data.features.slice(0, 8));
        setShowSuggestions(true);
      } else {
        console.log("No features in response or empty array");
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    try {
      const searchTerm = query.toLowerCase();
      const suggestions: any[] = [];

      // Import examples data
      const { SEARCH_EXAMPLES } = await import('@/data/providerFilters');

      // If query is empty or very short, show examples instead of database results
      if (searchTerm.length < 3) {
        // Add examples for each category
        const contextTypesToShow = contextTypes || ['providers', 'companies', 'consultant_companies', 'equipment_companies', 'pe_firms', 'profiles'];
        
        if (contextTypesToShow.includes('consultant_companies')) {
          SEARCH_EXAMPLES.consultants.forEach(example => {
            suggestions.push({
              id: `example-consultant-${example.name}`,
              type: 'example',
              title: example.name,
              subtitle: example.specialty,
              location: example.location,
              category: 'Consultants'
            });
          });
        }

        if (contextTypesToShow.includes('equipment_companies')) {
          SEARCH_EXAMPLES.equipment_vendors.forEach(example => {
            suggestions.push({
              id: `example-equipment-${example.name}`,
              type: 'example',
              title: example.name,
              subtitle: example.specialty,
              location: example.location,
              category: 'Equipment Vendors'
            });
          });
        }

        if (contextTypesToShow.includes('pe_firms')) {
          SEARCH_EXAMPLES.pe_firms.forEach(example => {
            suggestions.push({
              id: `example-pe-${example.name}`,
              type: 'example',
              title: example.name,
              subtitle: example.specialty,
              location: example.location,
              category: 'PE Firms'
            });
          });
        }

        if (contextTypesToShow.includes('profiles')) {
          SEARCH_EXAMPLES.profiles.forEach(example => {
            suggestions.push({
              id: `example-profile-${example.name}`,
              type: 'example',
              title: example.name,
              subtitle: example.specialty,
              location: example.location,
              category: 'Profiles'
            });
          });
        }

        setSearchSuggestions(suggestions.slice(0, 10));
        setShowSearchSuggestions(suggestions.length > 0);
        return;
      }

      // Enhanced search with location detection
      const isLocationQuery = /\b(in|at|near|from)\s+([a-zA-Z\s,]+)$/i.test(query) || 
                             /^[a-zA-Z\s,]+(?:,\s*[A-Z]{2})?$/.test(query);

      if (isLocationQuery) {
        // Fetch location suggestions directly
        const { data: locationData } = await supabase.functions.invoke('location-autocomplete', {
          body: { query: searchTerm }
        });
        
        if (locationData?.features) {
          locationData.features.slice(0, 5).forEach((location: any) => {
            suggestions.push({
              id: location.id,
              type: 'location',
              title: location.place_name,
              subtitle: 'Location',
              category: 'Locations',
              locationData: location
            });
          });
        }
      }

      // Enhanced specialization matching
      const specializations = [
        'Orthopedic', 'Sports Medicine', 'Neurology', 'Neurological', 'Geriatric', 'Pediatric',
        'Cardiopulmonary', 'Aquatic Therapy', 'Manual Therapy', 'Women\'s Health',
        'Vestibular', 'Hand Therapy', 'Wound Care', 'Pelvic Floor', 'Oncology',
        'Lymphedema', 'Dry Needling', 'McKenzie', 'Balance Training'
      ];
      
      specializations.forEach(spec => {
        if (spec.toLowerCase().includes(searchTerm) || searchTerm.includes(spec.toLowerCase())) {
          suggestions.push({
            id: spec,
            type: 'specialization',
            title: spec,
            subtitle: 'Specialization',
            category: 'Specializations'
          });
        }
      });

      setSearchSuggestions(suggestions.slice(0, 10));
      setShowSearchSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Search suggestions error:', error);
    }
  };

  const setLocation = (suggestion: LocationSuggestion) => {
    console.log("Setting location from suggestion:", suggestion);
    const [longitude, latitude] = suggestion.center;
    setLocationInput(suggestion.place_name);
    setShowSuggestions(false);
    updateFilters({
      userLatitude: latitude,
      userLongitude: longitude,
      location: suggestion.place_name
    });
    toast({
      title: "Location set",
      description: `Searching within ${filters.radius || 25} miles of ${suggestion.place_name}`,
    });
  };

  const selectSearchSuggestion = (suggestion: any) => {
    console.log("Search suggestion selected:", suggestion);
    
    // Close the suggestions dropdown
    setShowSearchSuggestions(false);
    
    if (suggestion.type === 'specialization') {
      updateFilters({ specialization: suggestion.title });
      setSearchQuery('');
    } else if (suggestion.type === 'location') {
      // Handle location selection
      const [longitude, latitude] = suggestion.locationData.center;
      setLocationInput(suggestion.title);
      updateFilters({
        userLatitude: latitude,
        userLongitude: longitude,
        location: suggestion.title
      });
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion.title);
      // Navigate to entity details if it's a specific entity
      if (suggestion.id && !['specialization', 'location'].includes(suggestion.type)) {
        const entityMap = {
          'provider': 'providers',
          'company': 'companies',
          'job_listing': 'job_listings',
          'school': 'schools'
        };
        const entityType = entityMap[suggestion.type as keyof typeof entityMap] || suggestion.type;
        window.location.href = `/entity/${entityType}/${suggestion.id}`;
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
    filters.primarySetting,
    filters.subSetting,
    filters.specialty,
    filters.certification,
    filters.consultantCategory,
    filters.consultantSpecialty,
    filters.costCategory,
    filters.programLength,
    filters.programType,
    filters.accreditation,
  ].filter(Boolean).length;

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
                onBlur={() => {
                  // Small delay to allow click events on suggestions to fire first
                  setTimeout(() => {
                    if (!searchSuggestionsRef.current?.contains(document.activeElement)) {
                      setShowSearchSuggestions(false);
                    }
                  }, 150);
                }}
                className="pl-10 h-10"
              />
              
              {/* Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div 
                  ref={searchSuggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-y-auto"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id || index}`}
                      className="w-full px-4 py-3 text-left hover:bg-accent text-sm border-b border-border last:border-b-0 flex items-center justify-between transition-colors"
                      onClick={() => selectSearchSuggestion(suggestion)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</div>
                        {suggestion.location && (
                          <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {suggestion.location}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
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
                onChange={(e) => {
                  console.log("Location input changed:", e.target.value);
                  setLocationInput(e.target.value);
                }}
                onFocus={() => {
                  console.log("Location input focused, suggestions available:", suggestions.length);
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  // Small delay to allow click events on suggestions to fire first
                  setTimeout(() => {
                    if (!suggestionsRef.current?.contains(document.activeElement)) {
                      setShowSuggestions(false);
                    }
                  }, 150);
                }}
                className="pl-10 h-10"
              />
              
              {/* Location Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-64 overflow-y-auto"
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="w-full px-4 py-3 text-left hover:bg-accent text-sm transition-colors flex items-center gap-2"
                      onClick={() => {
                        console.log("Location suggestion selected:", suggestion);
                        setLocation(suggestion);
                      }}
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{suggestion.place_name}</div>
                        {suggestion.place_type && suggestion.place_type.length > 0 && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {suggestion.place_type.join(', ')}
                          </div>
                        )}
                      </div>
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

      {/* Example Profile Placeholder - Only show when no search, no results, and only providers are selected */}
      {!searchQuery.trim() && !isLoading && results.length === 0 && 
       filters.entityTypes.length === 1 && filters.entityTypes.includes('providers') && (
        <Card className="opacity-60 pointer-events-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-muted-foreground">Dr. Sarah Johnson, DPT</h3>
                <p className="text-sm text-muted-foreground">Physical Therapist • Sports Medicine</p>
                <p className="text-xs text-muted-foreground">Seattle, WA • Example search result</p>
              </div>
              <Badge variant="secondary" className="opacity-50">Example</Badge>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Results Summary - Only show when actively searching or when non-provider entity types are selected */}
      {((searchQuery.trim().length > 0 || activeFiltersCount > 0) || 
        filters.entityTypes.some(type => ['companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms', 'profiles'].includes(type))) && 
       totalResults >= 0 && (
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
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Show</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const allTypes = availableEntityTypes.map(type => type.id);
                        updateFilters({ entityTypes: allTypes as any });
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateFilters({ entityTypes: [] });
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
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
                 {/* Provider-specific filters - Only show when providers are selected */}
                 {(!contextTypes || contextTypes.includes('providers')) && filters.entityTypes.includes('providers') && (
                   <div className="md:col-span-3 space-y-4">
                     <ProviderFilters filters={filters} updateFilters={updateFilters} />
                   </div>
                 )}

                  {/* Consultant-specific filters - Only show when consultants are selected */}
                  {(!contextTypes || contextTypes.includes('consultant_companies')) && filters.entityTypes.includes('consultant_companies') && (
                    <div className="md:col-span-3 space-y-4">
                      <ConsultantFilters filters={filters} updateFilters={updateFilters} />
                    </div>
                  )}

                  {/* School-specific filters - Only show when schools are selected */}
                  {(!contextTypes || contextTypes.includes('schools')) && filters.entityTypes.includes('schools') && (
                    <div className="md:col-span-3 space-y-4">
                      <SchoolFilters filters={filters} updateFilters={updateFilters} />
                    </div>
                  )}

                 {/* Legacy specialization - only show when not showing provider or consultant filters */}
                 {!(
                   ((!contextTypes || contextTypes.includes('providers')) && filters.entityTypes.includes('providers')) ||
                   ((!contextTypes || contextTypes.includes('consultant_companies')) && filters.entityTypes.includes('consultant_companies'))
                 ) && (
                   <div>
                     <Label className="text-sm font-medium">Specialization</Label>
                     <Input
                       placeholder="e.g., Orthopedic, Sports"
                       value={filters.specialization || ''}
                       onChange={(e) => updateFilters({ specialization: e.target.value })}
                       className="mt-1"
                     />
                   </div>
                 )}

                  {/* Company Type - only show when relevant entity types are selected */}
                  {(!contextTypes || contextTypes.some(type => ['companies', 'equipment_companies'].includes(type))) && 
                   filters.entityTypes.some(type => ['companies', 'equipment_companies'].includes(type)) && (
                   <div>
                     <Label className="text-sm font-medium">Company Type</Label>
                     <Select value={filters.companyType || 'all'} onValueChange={(value) => updateFilters({ companyType: value === 'all' ? '' : value })}>
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Any type" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">Any type</SelectItem>
                         <SelectItem value="Multi-Site Operator">Multi-Site Operator</SelectItem>
                         <SelectItem value="Private Practice">Private Practice</SelectItem>
                         <SelectItem value="Hospital System">Hospital System</SelectItem>
                         <SelectItem value="Rehabilitation Agency">Rehabilitation Agency</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 )}

                 {/* Job-specific filters - only show when job listings are selected */}
                 {(!contextTypes || contextTypes.includes('job_listings')) && filters.entityTypes.includes('job_listings') && (
                   <>
                     <div>
                       <Label className="text-sm font-medium">Employment Type</Label>
                       <Select value={filters.employmentType || 'all'} onValueChange={(value) => updateFilters({ employmentType: value === 'all' ? '' : value })}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Any type" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="all">Any type</SelectItem>
                           <SelectItem value="Full-time">Full-time</SelectItem>
                           <SelectItem value="Part-time">Part-time</SelectItem>
                           <SelectItem value="Contract">Contract</SelectItem>
                           <SelectItem value="Per Diem">Per Diem</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div>
                       <Label className="text-sm font-medium">Experience Level</Label>
                       <Select value={filters.experienceLevel || 'all'} onValueChange={(value) => updateFilters({ experienceLevel: value === 'all' ? '' : value })}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Any level" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="all">Any level</SelectItem>
                           <SelectItem value="Entry Level">Entry Level</SelectItem>
                           <SelectItem value="Mid Level">Mid Level</SelectItem>
                           <SelectItem value="Senior Level">Senior Level</SelectItem>
                           <SelectItem value="Executive">Executive</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </>
                 )}
               </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Search Results - Only show when there's a search query, active filters, or non-provider entity types selected */}
      {((searchQuery.trim().length > 0 || activeFiltersCount > 0) || 
        filters.entityTypes.some(type => ['companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms', 'profiles'].includes(type))) && (
        <SearchResults results={results as any} isLoading={isLoading} />
      )}
    </div>
  );
};