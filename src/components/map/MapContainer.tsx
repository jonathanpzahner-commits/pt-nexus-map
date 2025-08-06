import { useState, useEffect } from 'react';
import { MapView } from './MapView';

export const MapContainer = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // Check if token is stored in localStorage
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem('mapbox_token', token);
  };

  return (
    <MapView 
      mapboxToken={mapboxToken} 
      onTokenSubmit={handleTokenSubmit}
    />
  );
};