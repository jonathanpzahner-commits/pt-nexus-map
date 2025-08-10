import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [token, setToken] = useState(mapboxToken || '');
  const [searchLocation, setSearchLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{place_name: string, center: [number, number]}>>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [radius, setRadius] = useState([50]);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);
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

  // Fetch all location data
  const { data: companies = [], isLoading: companiesLoading, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...');
      const { data, error } = await supabase.from('companies').select('*');
      console.log('Companies query result:', { data: data?.length, error });
      if (error) {
        console.error('Companies query error:', error);
        throw error;
      }
      return data || [];
    },
  });

  console.log('Companies state:', { 
    data: companies?.length, 
    isLoading: companiesLoading, 
    error: companiesError 
  });

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schools').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('providers').select('*').not('latitude', 'is', null);
      if (error) throw error;
      return data;
    },
  });

  const { data: jobListings = [] } = useQuery({
    queryKey: ['job-listings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('job_listings').select('*');
      if (error) throw error;
      return data;
    },
  });

  const searchLocationSuggestions = async (query: string): Promise<void> => {
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
  };

  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      // Parse the location to determine if it's an address or city/state
      const parts = location.split(',').map(part => part.trim());
      let city = '';
      let state = '';
      let address = '';
      
      if (parts.length === 1) {
        // Could be a state name
        state = parts[0];
      } else if (parts.length === 2) {
        // City, State format
        city = parts[0];
        state = parts[1];
      } else {
        // Assume it's a full address
        address = location;
      }
      
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address, city, state }
      });
      
      if (error) {
        console.error('Geocoding error:', error);
        return null;
      }
      
      if (data?.latitude && data?.longitude) {
        return [data.longitude, data.latitude];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  };

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

  const filterDataByRadius = async (center: [number, number], radiusMiles: number) => {
    const filtered = {
      companies: [],
      schools: [],
      providers: [],
      jobListings: []
    };

    // Filter companies - check both company_locations array and individual city/state fields
    for (const company of companies) {
      let coords = null;
      let locationString = '';
      
      // Try company_locations array first
      if (company.company_locations && company.company_locations.length > 0) {
        for (const location of company.company_locations) {
          coords = await geocodeLocation(location);
          if (coords) {
            locationString = location;
            break;
          }
        }
      }
      
      // If no coords yet, try individual fields or any location-like field
      if (!coords) {
        // Check for common location field combinations using type assertion
        const companyAny = company as any;
        const city = companyAny.city;
        const state = companyAny.state;
        
        if (city && state) {
          locationString = `${city}, ${state}`;
          coords = await geocodeLocation(locationString);
        } else if (companyAny.address) {
          // Try full address if available
          locationString = companyAny.address;
          coords = await geocodeLocation(locationString);
        } else if (state) {
          // Try just state
          locationString = state;
          coords = await geocodeLocation(locationString);
        }
      }
      
      if (coords) {
        const distance = calculateDistance(center[1], center[0], coords[1], coords[0]);
        if (distance <= radiusMiles) {
          filtered.companies.push({ ...company, _coords: coords, _location: locationString });
        }
      }
    }

    // Filter schools
    for (const school of schools) {
      if (school.city && school.state) {
        const location = `${school.city}, ${school.state}`;
        const coords = await geocodeLocation(location);
        if (coords) {
          const distance = calculateDistance(center[1], center[0], coords[1], coords[0]);
          if (distance <= radiusMiles) {
            filtered.schools.push({ ...school, _coords: coords });
          }
        }
      }
    }

    // Filter providers (use stored lat/lng if available)
    for (const provider of providers) {
      let coords: [number, number] | null = null;
      
      if (provider.latitude && provider.longitude) {
        coords = [parseFloat(provider.longitude.toString()), parseFloat(provider.latitude.toString())];
      } else if (provider.city && provider.state) {
        const location = `${provider.city}, ${provider.state}`;
        coords = await geocodeLocation(location);
      }
      
      if (coords) {
        const distance = calculateDistance(center[1], center[0], parseFloat(coords[1].toString()), parseFloat(coords[0].toString()));
        if (distance <= radiusMiles) {
          filtered.providers.push({ ...provider, _coords: coords });
        }
      }
    }

    // Filter job listings
    for (const job of jobListings) {
      if (job.city && job.state) {
        const location = `${job.city}, ${job.state}`;
        const coords = await geocodeLocation(location);
        if (coords) {
          const distance = calculateDistance(center[1], center[0], coords[1], coords[0]);
          if (distance <= radiusMiles) {
            filtered.jobListings.push({ ...job, _coords: coords });
          }
        }
      }
    }

    setFilteredData(filtered);
    return filtered;
  };

  const handleLocationSelect = async (location: string, coords?: [number, number]) => {
    setSearchLocation(location);
    setIsLocationDropdownOpen(false);
    
    // Use provided coords or geocode the location
    const finalCoords = coords || await geocodeLocation(location);
    if (!finalCoords) {
      toast.error('Could not find location');
      return;
    }

    setSearchCenter(finalCoords);
    
    if (map.current) {
      map.current.flyTo({
        center: finalCoords,
        zoom: 10,
        essential: true
      });
    }

    await filterDataByRadius(finalCoords, radius[0]);
    toast.success(`Found locations within ${radius[0]} miles of ${location}`);
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    await handleLocationSelect(searchLocation);
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

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
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
  }, [token]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    const dataToShow = searchCenter ? filteredData : {
      companies: companies.slice(0, 100), // Reduce initial load for performance
      schools: schools.slice(0, 100), 
      providers: providers.slice(0, 100),
      jobListings: jobListings.slice(0, 50)
    };

    // Add markers for each category
    const addMarkers = async () => {
      console.log('Starting to add markers:', {
        companies: dataToShow.companies.length,
        schools: dataToShow.schools.length,
        providers: dataToShow.providers.length,
        jobListings: dataToShow.jobListings.length
      });
      
      let markersAdded = 0;
      
      // Companies
      for (const company of dataToShow.companies) {
        let coords = company._coords;
        
        if (!coords) {
          // Try company_locations array first
          if (company.company_locations && company.company_locations.length > 0) {
            coords = await geocodeLocation(company.company_locations[0]);
          } else {
            // Try individual location fields using type assertion
            const companyAny = company as any;
            const city = companyAny.city;
            const state = companyAny.state;
            
            if (city && state) {
              coords = await geocodeLocation(`${city}, ${state}`);
            } else if (companyAny.address) {
              coords = await geocodeLocation(companyAny.address);
            } else if (state) {
              coords = await geocodeLocation(state);
            }
          }
        }
        
        if (coords) {
          markersAdded++;
          console.log(`Company marker ${markersAdded} added:`, company.name, coords);
          
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${company.name}</h3>
              <p class="text-xs text-gray-600">${company.company_type || 'Company'}</p>
              <p class="text-xs">${company._location || ''}</p>
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/companies/${company.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        } else {
          console.log('Failed to geocode company:', company.name, company.company_locations);
        }
      }

      // Schools
      for (const school of dataToShow.schools) {
        const coords = school._coords || (school.city && school.state ? 
          await geocodeLocation(`${school.city}, ${school.state}`) : null);
        
        if (coords) {
          const marker = new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat(coords)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/schools/${school.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        }
      }

      // Providers
      for (const provider of dataToShow.providers) {
        let coords = provider._coords;
        
        if (!coords && provider.latitude && provider.longitude) {
          coords = [parseFloat(provider.longitude), parseFloat(provider.latitude)];
        } else if (!coords && provider.city && provider.state) {
          coords = await geocodeLocation(`${provider.city}, ${provider.state}`);
        }
        
        if (coords) {
          const marker = new mapboxgl.Marker({ color: '#F59E0B' })
            .setLngLat(coords)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/providers/${provider.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        }
      }

      // Job Listings
      for (const job of dataToShow.jobListings) {
        const coords = job._coords || (job.city && job.state ? 
          await geocodeLocation(`${job.city}, ${job.state}`) : null);
        
        if (coords) {
          const marker = new mapboxgl.Marker({ color: '#EF4444' })
            .setLngLat(coords)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/job_listings/${job.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        }
      }
      
      console.log(`Total markers added to map: ${markersAdded}`);
    };

    addMarkers();
  }, [filteredData, searchCenter, companies, schools, providers, jobListings, navigate]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTokenSubmit) {
      onTokenSubmit(token);
    }
  };

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
    companies: companies.slice(0, 1000),
    schools: schools.slice(0, 1000),
    providers: providers.slice(0, 1000),
    jobListings: jobListings.slice(0, 1000)
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
                    placeholder="Enter city, state (e.g. Lexington, KY)" 
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
            <Button onClick={handleSearch} size="sm" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search Location
            </Button>
          </div>
          
          <div>
            <Label className="text-xs">Radius: {radius[0]} miles</Label>
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
              <Label className="text-xs">Export Categories</Label>
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
                    <Label htmlFor={category} className="text-xs capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
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
              <div className="w-3 h-3 bg-blue-500 rounded-full cursor-pointer"></div>
              <span>Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer"></div>
              <span>Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full cursor-pointer"></div>
              <span>Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"></div>
              <span>Job Listings</span>
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