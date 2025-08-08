import { useState, useEffect } from 'react';
import { MapView } from './MapView';
import { supabase } from '@/integrations/supabase/client';

export const MapContainer = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) {
          console.error('Error getting mapbox token:', error);
        } else if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error fetching mapbox token:', error);
      } finally {
        setLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <MapView 
      mapboxToken={mapboxToken} 
      onTokenSubmit={() => {}} // No longer needed
    />
  );
};