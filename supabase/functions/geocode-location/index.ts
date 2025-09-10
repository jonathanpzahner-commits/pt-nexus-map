import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { address, city, state, zipCode, latitude, longitude, reverse } = body;
    
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    // Handle reverse geocoding (coordinates to address)
    if (reverse && latitude && longitude) {
      const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&limit=1&types=place,region,country`;
      
      const response = await fetch(reverseUrl);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error("Location not found");
      }

      const feature = data.features[0];
      const context = feature.context || [];
      
      // Extract state from context
      const stateFeature = context.find((c: any) => c.id.includes('region'));
      const state = stateFeature ? stateFeature.text : null;
      
      return new Response(
        JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: feature.place_name,
          state: state,
          city: feature.text
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle forward geocoding (address to coordinates)
    let searchQuery = "";
    if (address) {
      searchQuery = address;
    } else {
      const parts = [];
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (zipCode) parts.push(zipCode);
      searchQuery = parts.join(", ");
    }

    if (!searchQuery.trim()) {
      throw new Error("No location information provided");
    }

    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error("Location not found");
    }

    const feature = data.features[0];
    const [lon, lat] = feature.center;

    return new Response(
      JSON.stringify({
        latitude: lat,
        longitude: lon,
        address: feature.place_name,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});