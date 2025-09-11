import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Building2, GraduationCap, Briefcase, Users, Search, Download, CreditCard, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveMapViewProps {
  mapboxToken?: string;
  onTokenSubmit?: (token: string) => void;
}

export const InteractiveMapView = ({ mapboxToken, onTokenSubmit }: InteractiveMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{place_name: string, center: [number, number]}>>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [radius, setRadius] = useState([50]);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState({
    companies: [],
    schools: [],
    providers: [],
    jobListings: []
  });
  const [exportCategories, setExportCategories] = useState({
    companies: true,
    schools: true,
    providers: true,
    jobListings: true
  });
  const navigate = useNavigate();

  // Debounced location suggestions
  const searchLocationSuggestions = useCallback(
    async (query: string): Promise<void> => {
      if (query.length < 2) {
        setLocationSuggestions([]);
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke('location-autocomplete', {
          body: { query }
        });
        
        if (error) {
          console.error('Location search error:', error);
          setLocationSuggestions([]);
          return;
        }
        
        if (data?.features && data.features.length > 0) {
          const suggestions = data.features.map((feature: any) => ({
            place_name: feature.place_name,
            center: feature.center
          }));
          setLocationSuggestions(suggestions);
        } else {
          setLocationSuggestions([]);
        }
      } catch (error) {
        console.error('Location search error:', error);
        setLocationSuggestions([]);
      }
    },
    []
  );

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchDataWithinRadius = async (center: [number, number], radiusMiles: number) => {
    setIsSearching(true);
    console.log(`Fetching data within ${radiusMiles} miles of [${center[1]}, ${center[0]}]`);
    
    try {
      // Use database functions for efficient radius filtering where coordinates exist
      const [companiesResponse, providersResponse, schoolsResponse, jobsResponse] = await Promise.all([
        supabase.rpc('companies_within_radius', {
          user_lat: center[1],
          user_lng: center[0], 
          radius_miles: radiusMiles
        }),
        supabase.rpc('providers_within_radius', {
          user_lat: center[1],
          user_lng: center[0],
          radius_miles: radiusMiles
        }),
        supabase.from('schools').select('*'),
        supabase.from('job_listings').select('*')
      ]);

      console.log('Database responses:', {
        companies: companiesResponse.data?.length || 0,
        providers: providersResponse.data?.length || 0,
        schools: schoolsResponse.data?.length || 0,
        jobs: jobsResponse.data?.length || 0
      });

      const filtered = {
        companies: companiesResponse.data || [],
        providers: providersResponse.data || [],
        schools: [],
        jobListings: []
      };

      // If no companies from radius function, get all companies and filter by city/state
      if (filtered.companies.length === 0) {
        console.log('No companies with coordinates found, fetching all companies for city/state filtering');
        const allCompaniesResponse = await supabase.from('companies').select('*');
        if (allCompaniesResponse.data) {
          // Filter companies by state/city proximity (simplified)
          const centerState = await getStateFromCoords(center);
          filtered.companies = allCompaniesResponse.data.filter((company: any) => {
            return company.state && centerState && 
                   company.state.toLowerCase().includes(centerState.toLowerCase());
          }).map((company: any) => ({ ...company, distance_miles: 0 })).slice(0, 100); // Limit to 100 for performance
        }
      }

      // Filter schools by city/state distance
      if (schoolsResponse.data) {
        const centerState = await getStateFromCoords(center);
        filtered.schools = schoolsResponse.data.filter((school: any) => {
          if (!school.city || !school.state) return false;
          // Simple state matching for now - could be enhanced with proper geocoding
          return centerState && school.state.toLowerCase().includes(centerState.toLowerCase());
        }).slice(0, 50); // Limit for performance
      }

      // Filter job listings by city/state distance  
      if (jobsResponse.data) {
        const centerState = await getStateFromCoords(center);
        filtered.jobListings = jobsResponse.data.filter((job: any) => {
          if (!job.city || !job.state) return false;
          return centerState && job.state.toLowerCase().includes(centerState.toLowerCase());
        }).slice(0, 50); // Limit for performance
      }

      console.log('Final filtered results:', {
        companies: filtered.companies.length,
        providers: filtered.providers.length,
        schools: filtered.schools.length,
        jobListings: filtered.jobListings.length
      });

      setFilteredData(filtered);
      return filtered;
      
    } catch (error) {
      console.error('Error fetching data within radius:', error);
      toast.error('Error fetching location data');
      return {
        companies: [],
        providers: [],
        schools: [],
        jobListings: []
      };
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to get state from coordinates
  const getStateFromCoords = async (coords: [number, number]): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { 
          latitude: coords[1], 
          longitude: coords[0],
          reverse: true 
        }
      });
      
      if (data?.state) {
        return data.state;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
    return null;
  };

  const handleLocationSelect = async (location: string, coords?: [number, number]) => {
    setSearchLocation(location);
    setIsLocationDropdownOpen(false);
    
    if (!coords) {
      toast.error('Could not find location coordinates');
      return;
    }

    setSearchCenter(coords);
    
    if (map.current) {
      map.current.flyTo({
        center: coords,
        zoom: 10,
        essential: true
      });
    }

    const results = await fetchDataWithinRadius(coords, radius[0]);
    
    // Count only providers that have coordinates (will be displayed on map)
    const geocodedProviders = results.providers.filter((p: any) => p.latitude && p.longitude);
    const geocodedCompanies = results.companies.filter((c: any) => c.latitude && c.longitude);
    const totalMappable = geocodedProviders.length + geocodedCompanies.length + results.schools.length + results.jobListings.length;
    
    toast.success(`Found ${totalMappable} mappable locations within ${radius[0]} miles of ${location} (${geocodedProviders.length} PTs with coordinates, ${geocodedCompanies.length} companies, ${results.schools.length} schools, ${results.jobListings.length} jobs)`);
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    // Find coordinates from suggestions or geocode
    const suggestion = locationSuggestions.find(s => s.place_name === searchLocation);
    if (suggestion) {
      await handleLocationSelect(searchLocation, suggestion.center);
    } else {
      toast.error('Please select a location from the dropdown');
    }
  };

  const handleExport = async () => {
    if (!searchCenter) {
      toast.error('Please search for a location first');
      return;
    }

    const selectedCategories = Object.entries(exportCategories)
      .filter(([_, selected]) => selected)
      .map(([category, _]) => category);

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category to export');
      return;
    }

    // Calculate credits needed (1 credit per category)
    const creditsNeeded = selectedCategories.length;
    
    toast.info(`Export would use ${creditsNeeded} credit${creditsNeeded > 1 ? 's' : ''} - Feature coming soon!`);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95.7129, 37.0902],
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add markers when filtered data changes
  useEffect(() => {
    if (!map.current || !searchCenter) return;

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add markers for each category
    const addMarkers = () => {
      console.log('Adding markers:', {
        companies: filteredData.companies.length,
        schools: filteredData.schools.length,
        providers: filteredData.providers.length,
        jobListings: filteredData.jobListings.length
      });
      
      // Companies (fallback to city/state if no coordinates)
      const hiringCompanyIds = new Set((filteredData.jobListings || []).map((j: any) => j.company_id).filter(Boolean));
      const hiringCompanyNames = new Set((filteredData.jobListings || []).map((j: any) => (j.company_name || '').toLowerCase().trim()).filter(Boolean));

      filteredData.companies.forEach((company: any) => {
        let coords: [number, number] | null = null;
        
        // Try coordinates first
        if (company.longitude && company.latitude) {
          coords = [parseFloat(company.longitude), parseFloat(company.latitude)];
        }
        // Fallback: place at search center for companies without coordinates
        else if (company.city && company.state) {
          coords = searchCenter; // Place at search location
        }
        
        if (coords) {
          const isHiring = (company.id && hiringCompanyIds.has(company.id)) ||
            ((company.name || '') && hiringCompanyNames.has(String(company.name).toLowerCase().trim()));
          const markerColor = isHiring ? '#10B981' : '#3B82F6'; // Green for hiring, blue for non-hiring

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${company.name}</h3>
              <p class="text-xs text-gray-600">${company.company_type || 'Company'}</p>
              <p class="text-xs">${company.city || ''}, ${company.state || ''}</p>
              <p class="text-xs text-gray-500">${company.longitude && company.latitude ? 'Exact location' : 'Approximate location'}</p>
              ${isHiring ? '<p class="mt-1 text-[11px] font-medium text-green-600">🟢 Hiring now</p>' : ''}
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/companies/${company.id}`);
          });
          marker.getElement().style.cursor = 'pointer';
        }
      });

      // Schools (place at search center)
      filteredData.schools.forEach((school: any) => {
        if (school.city && school.state && searchCenter) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${school.name}</h3>
              <p class="text-xs text-gray-600">School</p>
              <p class="text-xs">${school.city}, ${school.state}</p>
              <p class="text-xs text-gray-500">Approximate location</p>
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat(searchCenter)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/schools/${school.id}`);
          });
          marker.getElement().style.cursor = 'pointer';
        }
      });

      // Providers
      filteredData.providers.forEach((provider: any) => {
        const coords = provider.longitude && provider.latitude
          ? [parseFloat(provider.longitude), parseFloat(provider.latitude)] as [number, number]
          : null;
        
        if (coords) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${provider.name || `${provider.first_name} ${provider.last_name}`}</h3>
              <p class="text-xs text-gray-600">Provider</p>
              <p class="text-xs">${provider.city}, ${provider.state}</p>
              <p class="text-xs text-gray-500">${provider.distance_miles ? `${provider.distance_miles.toFixed(1)} miles` : ''}</p>
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: '#F59E0B' })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/providers/${provider.id}`);
          });
          marker.getElement().style.cursor = 'pointer';
        }
      });
    };

    addMarkers();
  }, [filteredData, searchCenter, navigate]);

  if (!mapboxToken) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map Unavailable
            </CardTitle>
            <CardDescription>
              Interactive map service is currently unavailable. Please contact support if this persists.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const currentData = searchCenter ? filteredData : {
    companies: [],
    schools: [],
    providers: [],
    jobListings: []
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Search Controls */}
      <Card className="absolute top-4 left-4 z-10 w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Location Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Popover open={isLocationDropdownOpen} onOpenChange={setIsLocationDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isLocationDropdownOpen}
                  className="w-full justify-between"
                >
                  {searchLocation || "Search for a location..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Command>
                  <CommandInput 
                    placeholder="Enter city, state (e.g. Baltimore, MD)" 
                    value={searchLocation}
                    onValueChange={(value) => {
                      setSearchLocation(value);
                      searchLocationSuggestions(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                        setIsLocationDropdownOpen(false);
                      }
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>No locations found.</CommandEmpty>
                    <CommandGroup>
                      {locationSuggestions.map((suggestion, index) => (
                        <CommandItem
                          key={index}
                          value={suggestion.place_name}
                          onSelect={() => handleLocationSelect(suggestion.place_name, suggestion.center)}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {suggestion.place_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button onClick={handleSearch} size="sm" className="w-full" disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search Location'}
            </Button>
          </div>
          
          <div>
            <div className="text-xs mb-2">Radius: {radius[0]} miles</div>
            <Slider
              value={radius}
              onValueChange={setRadius}
              max={200}
              min={1}
              step={1}
              className="mt-1"
            />
          </div>

          {searchCenter && (
            <div className="space-y-2">
              <div className="text-xs">Export Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(exportCategories).map(([category, checked]) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={checked}
                      onCheckedChange={(checked) => 
                        setExportCategories(prev => ({ ...prev, [category]: !!checked }))
                      }
                    />
                    <label htmlFor={category} className="text-xs capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleExport} size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
                <CreditCard className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="absolute bottom-20 left-4 z-10">
        <CardContent className="p-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Companies hiring</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Click markers to view details
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="absolute top-4 right-4 z-10">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>{currentData.companies.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-500" />
              <span>{currentData.schools.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span>{currentData.providers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-red-500" />
              <span>{currentData.jobListings.length}</span>
            </div>
          </div>
          {searchCenter && (
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Within {radius[0]} miles
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};