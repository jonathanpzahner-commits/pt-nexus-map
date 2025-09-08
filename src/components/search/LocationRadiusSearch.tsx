import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  context?: Array<{ text: string; id: string }>;
}

interface LocationRadiusSearchProps {
  onLocationSet: (latitude: number, longitude: number, address: string) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  currentLocation?: string;
}

export const LocationRadiusSearch = ({ 
  onLocationSet, 
  radius, 
  onRadiusChange, 
  currentLocation 
}: LocationRadiusSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationInput.trim().length > 2) {
        fetchSuggestions(locationInput.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    setIsLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('location-autocomplete', {
        body: { query }
      });

      if (error) throw error;

      if (data && data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    const [longitude, latitude] = suggestion.center;
    setLocationInput(suggestion.place_name);
    setShowSuggestions(false);
    onLocationSet(latitude, longitude, suggestion.place_name);
    toast({
      title: "Location set",
      description: `Searching within ${radius} miles of ${suggestion.place_name}`,
    });
  };

  const handleGeocodeLocation = async () => {
    if (!locationInput.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: locationInput }
      });

      if (error) throw error;

      onLocationSet(data.latitude, data.longitude, data.address);
      toast({
        title: "Location set",
        description: `Searching within ${radius} miles of ${data.address}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to geocode location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          const { data, error } = await supabase.functions.invoke('geocode-location', {
            body: { 
              city: "", 
              state: "", 
              address: `${latitude},${longitude}` 
            }
          });

          if (!error && data) {
            onLocationSet(latitude, longitude, data.address);
            toast({
              title: "Current location set",
              description: `Searching within ${radius} miles of your current location`,
            });
          } else {
            onLocationSet(latitude, longitude, "Current Location");
            toast({
              title: "Current location set",
              description: `Searching within ${radius} miles of your current location`,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get location details.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: "Unable to get your current location.",
          variant: "destructive",
        });
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    if (value.trim().length <= 2) {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location & Radius Search
      </h3>
      
      {currentLocation && (
        <div className="text-sm text-muted-foreground">
          Current: {currentLocation}
        </div>
      )}

      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Enter city, state, or address..."
              value={locationInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={() => {
                // Close suggestions after a small delay to allow click events
                setTimeout(() => {
                  if (!suggestionsRef.current?.contains(document.activeElement)) {
                    setShowSuggestions(false);
                  }
                }, 150);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && suggestions.length > 0) {
                  selectSuggestion(suggestions[0]);
                } else if (e.key === 'Enter') {
                  handleGeocodeLocation();
                }
              }}
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors border-none bg-transparent text-sm"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{suggestion.place_name}</div>
                        {suggestion.place_type && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {suggestion.place_type.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleGeocodeLocation}
            disabled={isLoading || !locationInput.trim()}
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Location'}
          </Button>
          <Button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Radius:</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="500"
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">miles</span>
        </div>
      </div>

      <div className="flex gap-2">
        {[10, 25, 50, 100].map((r) => (
          <Button
            key={r}
            variant={radius === r ? "default" : "outline"}
            size="sm"
            onClick={() => onRadiusChange(r)}
          >
            {r}mi
          </Button>
        ))}
      </div>
    </div>
  );
};