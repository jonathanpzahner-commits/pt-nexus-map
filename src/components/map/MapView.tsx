import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Building2, GraduationCap, Briefcase, Users } from 'lucide-react';

interface MapViewProps {
  mapboxToken?: string;
  onTokenSubmit?: (token: string) => void;
}

export const MapView = ({ mapboxToken, onTokenSubmit }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(mapboxToken || '');

  // Fetch all location data
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) throw error;
      return data;
    },
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
      const { data, error } = await supabase.from('providers').select('*');
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

  // Geocoding function to convert city/state to coordinates
  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    if (!token) return null;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${token}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  };

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95.7129, 37.0902], // Center of USA
      zoom: 4,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    const addMarkersToMap = async () => {
      if (!map.current) return;

      // Add company markers
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
        
        // If no coords yet, try individual fields using type assertion
        if (!coords) {
          const companyAny = company as any;
          const city = companyAny.city || companyAny.location_city || companyAny.address_city;
          const state = companyAny.state || companyAny.location_state || companyAny.address_state;
          
          if (city && state) {
            locationString = `${city}, ${state}`;
            coords = await geocodeLocation(locationString);
          } else if (companyAny.address) {
            locationString = companyAny.address;
            coords = await geocodeLocation(locationString);
          } else if (companyAny.location) {
            locationString = companyAny.location;
            coords = await geocodeLocation(locationString);
          }
        }
        
        if (coords) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${company.name}</h3>
              <p class="text-xs text-gray-600">${company.company_type || 'Company'}</p>
              <p class="text-xs">${locationString}</p>
            </div>`
          );

          new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map.current);
        }
      }

      // Add school markers
      for (const school of schools) {
        if (school.city && school.state) {
          const location = `${school.city}, ${school.state}`;
          const coords = await geocodeLocation(location);
          if (coords) {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold text-sm">${school.name}</h3>
                <p class="text-xs text-gray-600">School</p>
                <p class="text-xs">${location}</p>
              </div>`
            );

            new mapboxgl.Marker({ color: '#10B981' })
              .setLngLat(coords)
              .setPopup(popup)
              .addTo(map.current);
          }
        }
      }

      // Add provider markers
      for (const provider of providers) {
        if (provider.city && provider.state) {
          const location = `${provider.city}, ${provider.state}`;
          const coords = await geocodeLocation(location);
          if (coords) {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold text-sm">${provider.name}</h3>
                <p class="text-xs text-gray-600">Provider</p>
                <p class="text-xs">${location}</p>
              </div>`
            );

            new mapboxgl.Marker({ color: '#F59E0B' })
              .setLngLat(coords)
              .setPopup(popup)
              .addTo(map.current);
          }
        }
      }

      // Add job listing markers
      for (const job of jobListings) {
        if (job.city && job.state) {
          const location = `${job.city}, ${job.state}`;
          const coords = await geocodeLocation(location);
          if (coords) {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold text-sm">${job.title}</h3>
                <p class="text-xs text-gray-600">Job Opening</p>
                <p class="text-xs">${location}</p>
              </div>`
            );

            new mapboxgl.Marker({ color: '#EF4444' })
              .setLngLat(coords)
              .setPopup(popup)
              .addTo(map.current);
          }
        }
      }
    };

    addMarkersToMap();

    return () => {
      map.current?.remove();
    };
  }, [token, companies, schools, providers, jobListings]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTokenSubmit) {
      onTokenSubmit(token);
    }
  };

  if (!mapboxToken && !token) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Setup Map
            </CardTitle>
            <CardDescription>
              Enter your Mapbox public token to view the PT ecosystem on a map.
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <Label htmlFor="token">Mapbox Public Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="pk.eyJ1..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Initialize Map
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <Card className="absolute top-4 left-4 z-10">
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
              <span>Job Listings</span>
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
              <span>{companies.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-500" />
              <span>{schools.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span>{providers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-red-500" />
              <span>{jobListings.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};