import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Crosshair } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

      <div className="flex gap-2">
        <Input
          placeholder="Enter city, state, or address..."
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGeocodeLocation()}
        />
        <Button 
          onClick={handleGeocodeLocation}
          disabled={isLoading || !locationInput.trim()}
          size="sm"
        >
          Set Location
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