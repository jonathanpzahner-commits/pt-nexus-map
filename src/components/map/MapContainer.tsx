import { useState, useEffect } from 'react';
import { MapView } from './MapView';
import { supabase } from '@/integrations/supabase/client';

export const MapContainer = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMapboxToken = async () => {
      console.log('Fetching Mapbox token...');
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        console.log('Token response:', { data, error });
        if (error) {
          console.error('Error getting mapbox token:', error);
        } else if (data?.token) {
          console.log('Token received successfully');
          setMapboxToken(data.token);
        } else {
          console.log('No token in response');
        }
      } catch (error) {
        console.error('Error fetching mapbox token:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  console.log('MapContainer render - loading:', loading, 'token:', mapboxToken ? 'present' : 'missing');

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (!mapboxToken) {
    return <div>Map unavailable: No token received</div>;
  }

  return (
    <MapView 
      mapboxToken={mapboxToken} 
      onTokenSubmit={() => {}} // No longer needed
    />
  );
};