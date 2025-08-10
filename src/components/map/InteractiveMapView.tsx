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

  // Don't fetch all data on load - only fetch after location search
  const [allData, setAllData] = useState({
    companies: [],
    schools: [],
    providers: [],
    jobListings: []
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
    if (!location || location.trim().length === 0) {
      return null;
    }
    
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

  const fetchDataWithinRadius = async (center: [number, number], radiusMiles: number) => {
    console.log(`Fetching data within ${radiusMiles} miles of [${center[1]}, ${center[0]}]`);
    
    try {
      // Use database functions for efficient radius filtering
      const [companiesResponse, providersResponse, schoolsResponse, jobsResponse] = await Promise.all([
        // Companies with coordinates
        supabase.rpc('companies_within_radius', {
          user_lat: center[1],
          user_lng: center[0], 
          radius_miles: radiusMiles
        }),
        
        // Providers with coordinates  
        supabase.rpc('providers_within_radius', {
          user_lat: center[1],
          user_lng: center[0],
          radius_miles: radiusMiles
        }),
        
        // Schools (need to geocode first, then filter)
        supabase.from('schools').select('*'),
        
        // Job listings (need to geocode first, then filter)  
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

      // Filter schools by geocoding city/state
      if (schoolsResponse.data) {
        for (const school of schoolsResponse.data) {
          if (school.city && school.state) {
            const coords = await geocodeLocation(`${school.city}, ${school.state}`);
            if (coords) {
              const distance = calculateDistance(center[1], center[0], coords[1], coords[0]);
              if (distance <= radiusMiles) {
                filtered.schools.push({ ...school, _coords: coords, distance_miles: distance });
              }
            }
          }
        }
      }

      // Filter job listings by geocoding city/state
      if (jobsResponse.data) {
        for (const job of jobsResponse.data) {
          if (job.city && job.state) {
            const coords = await geocodeLocation(`${job.city}, ${job.state}`);
            if (coords) {
              const distance = calculateDistance(center[1], center[0], coords[1], coords[0]);
              if (distance <= radiusMiles) {
                filtered.jobListings.push({ ...job, _coords: coords, distance_miles: distance });
              }
            }
          }
        }
      }

      console.log('Final filtered results:', {
        companies: filtered.companies.length,
        providers: filtered.providers.length,
        schools: filtered.schools.length,
        jobListings: filtered.jobListings.length
      });

      setFilteredData(filtered);
      setAllData(filtered);
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
    }
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

    await fetchDataWithinRadius(finalCoords, radius[0]);
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

    // Only show data after a location search - start with empty map
    const dataToShow = searchCenter ? filteredData : {
      companies: [],
      schools: [],     
      providers: [],
      jobListings: []
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
      
      // Companies (already have coordinates from database function)
      for (const company of dataToShow.companies) {
        const coords = company.longitude && company.latitude 
          ? [parseFloat(company.longitude), parseFloat(company.latitude)]
          : company._coords;
        
        if (coords) {
          markersAdded++;
          console.log(`Company marker ${markersAdded} added:`, company.name, coords);
          
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${company.name}</h3>
              <p class="text-xs text-gray-600">${company.company_type || 'Company'}</p>
              <p class="text-xs">${company.city}, ${company.state}</p>
              <p class="text-xs text-gray-500">${company.distance_miles ? `${company.distance_miles.toFixed(1)} miles` : ''}</p>
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
        }
      }

      // Schools
      for (const school of dataToShow.schools) {
        const coords = school._coords;
        
        if (coords) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${school.name}</h3>
              <p class="text-xs text-gray-600">School</p>
              <p class="text-xs">${school.city}, ${school.state}</p>
              <p class="text-xs text-gray-500">${school.distance_miles ? `${school.distance_miles.toFixed(1)} miles` : ''}</p>
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/schools/${school.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        }
      }

      // Providers (already have coordinates from database function) 
      for (const provider of dataToShow.providers) {
        const coords = provider.longitude && provider.latitude
          ? [parseFloat(provider.longitude), parseFloat(provider.latitude)]
          : provider._coords;
        
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
      }

      // Job Listings
      for (const job of dataToShow.jobListings) {
        const coords = job._coords;
        
        if (coords) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${job.title}</h3>
              <p class="text-xs text-gray-600">Job Listing</p>
              <p class="text-xs">${job.city}, ${job.state}</p>
              <p class="text-xs text-gray-500">${job.distance_miles ? `${job.distance_miles.toFixed(1)} miles` : ''}</p>
            </div>`
          );

          const marker = new mapboxgl.Marker({ color: '#EF4444' })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            navigate(`/entity/job_listings/${job.id}`);
          });

          marker.getElement().style.cursor = 'pointer';
        }
      }
      
      console.log(`Total markers added to map: ${markersAdded}`);
      
      if (!searchCenter && markersAdded === 0) {
        console.log('Map starting empty - search for a location to see markers');
      }
    };

    addMarkers();
  }, [filteredData, searchCenter, navigate]);

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